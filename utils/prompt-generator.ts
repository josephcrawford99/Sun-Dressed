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
  const currentTemp = weatherData.current?.temp ? Math.round(weatherData.current.temp) : 'N/A';
  const feelsLike = weatherData.current?.feels_like ? Math.round(weatherData.current.feels_like) : 'N/A';

  // Get today's forecast data (first item in daily array)
  const todayForecast = weatherData.daily?.[0];
  const highTemp = todayForecast?.temp?.max ? Math.round(todayForecast.temp.max) : 'N/A';
  const lowTemp = todayForecast?.temp?.min ? Math.round(todayForecast.temp.min) : 'N/A';

  // Get precipitation chance (pop = probability of precipitation)
  const chanceOfRain = todayForecast?.pop ? Math.round(todayForecast.pop * 100) : 0;

  // Get UV index
  const uvIndex = todayForecast?.uvi || weatherData.current?.uvi || 0;

  // Get weather description
  const weatherDescription = weatherData.current?.weather?.[0]?.description || 'unknown conditions';

  // Build the prompt
  const prompt = `You are a fashion advisor. Based on the following weather conditions and user preferences, suggest a complete outfit.

WEATHER CONDITIONS:
- Time of day: ${currentTime.toLocaleTimeString()}
- Current Temperature: ${currentTemp}${tempSymbol} (Feels like: ${feelsLike}${tempSymbol})
- Today's High: ${highTemp}${tempSymbol}
- Today's Low: ${lowTemp}${tempSymbol}
- Chance of Rain: ${chanceOfRain}%
- UV Index: ${uvIndex}
- Conditions: ${weatherDescription}

USER PREFERENCES:
- User's gender (will be masculine, feminine, neutral) (do not include in the response, this is for internal use only): ${userPrefs.style || 'neutral'}
- Activity: ${userPrefs.activity || 'general daily activities (do not include in the response)'}

IMPORTANT: You MUST respond with ONLY valid JSON in the exact format shown below. Do not include any other text, explanations, or markdown formatting outside the JSON.

Required JSON format:
{
  "items": [
    {
      "name": "Item Name",
      "description": "Short description of what the item is",
      "blurb": "One sentence about why this item is perfect for these conditions and complements the outfit"
    }
  ],
  "overallDescription": "A personable summary of the outfit as a whole and why it works perfectly for today's conditions, speaking as a friendly fashion advisor"
}

Include appropriate clothing items based on the weather and activity (e.g., tops, bottoms, outerwear, footwear, accessories). Keep recommendations practical and weather-appropriate. Speak warmly and personably in the overallDescription.`;

  return prompt;
}
