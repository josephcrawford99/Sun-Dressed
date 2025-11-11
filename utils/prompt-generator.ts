import { TempFormat, WeatherData } from '@/services/openweathermap-service';
import { OutfitStyle } from '@/types/outfit';

/**
 * User preferences for outfit generation
 */
export interface UserPreferences {
  style: OutfitStyle | null;
  activity: string;
}

/**
 * Builds a structured prompt for outfit recommendation based on user preferences and weather data
 *
 * @param userPrefs - User's style preferences and planned activity
 * @param weatherData - Current weather data including temperature, forecast, UV index, etc.
 * @param tempFormat - Temperature format to use in the prompt ('metric' or 'imperial')
 * @returns Structured prompt string to send to Gemini API
 */
export function buildOutfitPrompt(userPrefs: UserPreferences, weatherData: WeatherData, tempFormat: TempFormat): string {
  const currentTime = new Date();

  const tempSymbol = tempFormat === 'metric' ? '°C' : '°F';
  // Extract weather information
  const currentTemp = Math.round(weatherData.temp.current);
  const feelsLike = Math.round(weatherData.temp.feels_like);
  const highTemp = Math.round(weatherData.temp.max);
  const lowTemp = Math.round(weatherData.temp.min);

  // Get precipitation chance (pop = probability of precipitation)
  const chanceOfRain = Math.round(weatherData.pop * 100);

  // Get weather description
  const weatherDescription = weatherData.description;

  // Build weather conditions list, only including available data
  const weatherConditions = [
    `- Time of day: ${currentTime.toLocaleTimeString()}`,
    `- Current Temperature: ${currentTemp}${tempSymbol} (Feels like: ${feelsLike}${tempSymbol})`,
    `- Today's High: ${highTemp}${tempSymbol}`,
    `- Today's Low: ${lowTemp}${tempSymbol}`,
    `- Chance of Rain: ${chanceOfRain}%`,
  ];

  // Only add UV Index if available
  if (weatherData.uvi !== undefined) {
    weatherConditions.push(`- UV Index: ${Math.round(weatherData.uvi)}`);
  }

  weatherConditions.push(`- Conditions: ${weatherDescription}`);

  // Build the prompt
  const prompt = `You are a fashion advisor. Based on the following weather conditions and user preferences, suggest a complete outfit.

WEATHER CONDITIONS:
${weatherConditions.join('\n')}

USER PREFERENCES:
- User's gender (will be masculine, feminine, neutral) (do not include in the response, this is for internal use only): ${userPrefs.style || 'neutral'}
- Activity: ${userPrefs.activity || 'general daily activities (do not include in the response)'}

IMPORTANT: You MUST respond with ONLY valid JSON in the exact format shown below. Do not include any other text, explanations, or markdown formatting outside the JSON.

Required JSON format:
{
  "items": [
    {
      "name": "Item Name",
      "description": "Short description of what the item is. Do NOT include the item name in this field. Not a complete sentence, no punctuation.",
      "blurb": "One sentence about why this item is perfect for these conditions and complements the outfit"
    }
  ],
  "overallDescription": "A personable summary of the outfit as a whole and why it works perfectly for today's conditions, speaking as a friendly fashion advisor",
  "warmCoatRecommended": boolean (true if weather conditions suggest a warm coat is needed based on temperature, wind, or overall conditions),
  "rainGearRecommended": boolean (true if weather conditions suggest rain gear is needed based on chance of rain or current precipitation)
}

Include appropriate clothing items based on the weather and activity (e.g., tops, bottoms, outerwear, footwear, accessories). Keep recommendations practical and weather-appropriate. Speak warmly and personably in the overallDescription.`;

  return prompt;
}
