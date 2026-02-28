import { TempFormat } from '@/services/openweathermap-service';
import { OutfitStyle } from '@/types/outfit';
import { WeatherData } from '@/types/weather';

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
 * @param weatherData - Current weather data including temperature, forecast, etc.
 * @param tempFormat - Temperature format to use in the prompt ('metric' or 'imperial')
 * @param allowedItems - Pre-filtered list of item names the LLM can suggest
 * @returns Structured prompt string to send to Gemini API
 */
export function buildOutfitPrompt(
  userPrefs: UserPreferences,
  weatherData: WeatherData,
  tempFormat: TempFormat,
  allowedItems: string[],
  approvedItems: string[] = [],
  disapprovedItems: string[] = [],
): string {
  const currentTime = new Date();

  const tempSymbol = tempFormat === 'metric' ? '°C' : '°F';
  const windSpeedUnit = tempFormat === 'imperial' ? 'mph' : 'm/s';

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
    `- Location: ${weatherData.name}`,
    `- Current Temperature: ${currentTemp}${tempSymbol} (Feels like: ${feelsLike}${tempSymbol})`,
    `- Today's High: ${highTemp}${tempSymbol}`,
    `- Today's Low: ${lowTemp}${tempSymbol}`,
    `- Chance of Rain: ${chanceOfRain}%`,
    `- Wind Speed: ${Math.round(weatherData.wind.speed)} ${windSpeedUnit}`,
  ];

  // Only add Wind Gust if available
  if (weatherData.wind.gust !== undefined) {
    weatherConditions.push(`- Wind Gust: ${Math.round(weatherData.wind.gust)} ${windSpeedUnit}`);
  }

  weatherConditions.push(`- Conditions: ${weatherDescription}`);

  // Build the prompt
  const prompt = `You are a fashion advisor. Based on the following weather conditions and user preferences, suggest a complete outfit.

WEATHER CONDITIONS:
${weatherConditions.join('\n')}

USER PREFERENCES:
- User's gender (will be masculine, feminine, neutral) (do not include in the response, this is for internal use only): ${userPrefs.style || 'neutral'}
- Activity: ${userPrefs.activity || 'general daily activities (do not include in the response)'}

ALLOWED CLOTHING ITEMS:
You MUST ONLY use item names from this list. Do not suggest any items not on this list:
${(disapprovedItems.length > 0 ? allowedItems.filter((item: string) => !disapprovedItems.includes(item)) : allowedItems).join(', ')}

IMPORTANT: Item names in your response must match EXACTLY as shown above, including any text in parentheses.
${approvedItems.length > 0 ? `\nUSER PREFERRED ITEMS:\nThe user has indicated they like these items. Try to incorporate them into the outfit if they are weather-appropriate:\n${approvedItems.join(', ')}\n` : ''}${disapprovedItems.length > 0 ? `\nUSER DISLIKED ITEMS:\nThe user does not want these items suggested. Do NOT include any of these in the outfit:\n${disapprovedItems.join(', ')}\n` : ''}
IMPORTANT: You MUST respond with ONLY valid JSON in the exact format shown below. Do not include any other text, explanations, or markdown formatting outside the JSON.

Required JSON format:
{
  "items": [
    {
      "name": "Exact item name from the ALLOWED CLOTHING ITEMS list above",
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
