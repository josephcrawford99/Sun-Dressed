/**
 * OpenWeatherMap Service
 * Handles communication with OpenWeatherMap OneCall 3.0 API
 */

import axios from 'axios';

/**
 * Temperature format/units options (matches OpenWeatherMap API units parameter)
 */
export type TempFormat = 'metric' | 'imperial';

/**
 * Fields to exclude from the OpenWeatherMap API response
 * Excludes: minutely, hourly, and alerts (not currently used in the app)
 */
export const EXCLUDED_FIELDS = 'minutely,hourly,alerts';

/**
 * OpenWeatherMap OneCall 3.0 API response type
 * Matches the actual API structure
 */
export interface WeatherData {
  lat: number;
  lon: number;
  timezone: string;
  current: {
    dt: number;
    temp: number;
    feels_like: number;
    humidity: number;
    uvi: number;
    wind_speed: number;
    wind_gust?: number;
    weather: Array<{
      id: number;
      main: string;
      description: string;
      icon: string;
    }>;
  };
  daily: Array<{
    dt: number;
    sunrise: number;
    sunset: number;
    summary?: string;
    temp: {
      min: number;
      max: number;
      day: number;
      night: number;
      eve: number;
      morn: number;
    };
    feels_like: {
      day: number;
      night: number;
      eve: number;
      morn: number;
    };
    humidity: number;
    wind_speed: number;
    wind_gust?: number;
    weather: Array<{
      id: number;
      main: string;
      description: string;
      icon: string;
    }>;
    pop: number;
    uvi: number;
    rain?: number;
    snow?: number;
  }>;
}


/**
 * Result from fetching weather data
 */
export interface WeatherFetchResult {
  data: WeatherData;
  rawJson: string;
}

/**
 * Fetches weather data from OpenWeatherMap OneCall 3.0 API
 *
 * @param latitude - Latitude coordinate
 * @param longitude - Longitude coordinate
 * @param units - Units of measurement ('metric' for Celsius, 'imperial' for Fahrenheit, defaults to 'imperial')
 * @returns Promise with raw weather data, processed data, and raw JSON string
 * @throws Error if API key is missing or fetch fails
 */
export async function fetchWeatherData(
  latitude: number,
  longitude: number,
  units: TempFormat = 'imperial'
): Promise<WeatherFetchResult> {
  // Get API key from environment
  const apiKey = process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY;
  if (!apiKey) {
    throw new Error('API key not configured. Please add EXPO_PUBLIC_OPENWEATHER_API_KEY to .env.local');
  }

  // Fetch weather from OneCall 3.0 API using axios
  const response = await axios.get<WeatherData>(
    `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}&exclude=${EXCLUDED_FIELDS}`
  );

  const data = response.data;
  const rawJson = JSON.stringify(data, null, 2);

  return {
    data,
    rawJson,
  };
}
