import { WeatherData } from '@/hooks/use-openweathermap';
import { OutfitStyle } from '@/store/store';

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
 * @returns Structured prompt string to send to Gemini API
 */
export function buildOutfitPrompt(userPrefs: UserPreferences, weatherData: WeatherData): string {
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
- Current Temperature: ${currentTemp}°C (Feels like: ${feelsLike}°C)
- Today's High: ${highTemp}°C
- Today's Low: ${lowTemp}°C
- Chance of Rain: ${chanceOfRain}%
- UV Index: ${uvIndex}
- Conditions: ${weatherDescription}

USER PREFERENCES:
- Clothing Gender Preference (will be masculine, feminine, neutral): ${userPrefs.style || 'neutral'}
- Activity: ${userPrefs.activity || 'general daily activities'}

Please provide a detailed outfit recommendation including:
1. Upper body clothing
2. Lower body clothing
3. Footwear
4. Accessories (if applicable, considering weather conditions)
5. Brief explanation of why this outfit works for the conditions

Keep the recommendation practical and weather-appropriate.`;

  return prompt;
}
