import { WeatherData } from '../services/weatherService';
import { UserPreferences } from './storage';

/**
 * Convert temperature from Celsius to Fahrenheit
 */
export const celsiusToFahrenheit = (celsius: number): number => {
  return Math.round((celsius * 9) / 5 + 32);
};

/**
 * Format temperature based on user preferences
 */
export const formatTemperature = (
  temperature: number,
  preferences: UserPreferences
): string => {
  if (preferences.temperatureUnit === 'fahrenheit') {
    return `${celsiusToFahrenheit(temperature)}°F`;
  }
  return `${temperature}°C`;
};

/**
 * Get the URL for a weather icon from OpenWeatherMap
 * @param iconCode The icon code from the OpenWeatherMap API
 * @returns The URL to the weather icon
 */
export const getWeatherIconUrl = (iconCode: string): string => {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
};

/**
 * Format wind speed with unit
 */
export const formatWindSpeed = (speed: number): string => {
  return `${speed} m/s`;
};

/**
 * Get a user-friendly description of the weather
 */
export const getWeatherDescription = (weatherData: WeatherData): string => {
  const { temperature, description, time_of_day } = weatherData;

  let timePhrase = '';
  switch (time_of_day) {
    case 'morning':
      timePhrase = 'this morning';
      break;
    case 'afternoon':
      timePhrase = 'this afternoon';
      break;
    case 'evening':
      timePhrase = 'this evening';
      break;
  }

  return `${description.charAt(0).toUpperCase() + description.slice(1)} ${timePhrase}, ${temperature}°C`;
};
