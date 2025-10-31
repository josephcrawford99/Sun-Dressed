/**
 * OpenWeatherMap Service
 * Handles communication with OpenWeatherMap OneCall 3.0 API
 */

import axios from 'axios';

/**
 * OpenWeatherMap OneCall 3.0 API response type
 */
export interface WeatherData {
  lat: number;
  lon: number;
  timezone: string;
  current?: {
    dt: number;
    temp: number;
    feels_like: number;
    pressure: number;
    humidity: number;
    dew_point: number;
    uvi: number;
    weather: Array<{
      id: number;
      main: string;
      description: string;
      icon: string;
    }>;
  };
  daily?: Array<{
    dt: number;
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
    pressure: number;
    humidity: number;
    dew_point: number;
    wind_speed: number;
    wind_deg: number;
    weather: Array<{
      id: number;
      main: string;
      description: string;
      icon: string;
    }>;
    clouds: number;
    pop: number;
    uvi: number;
  }>;
  [key: string]: any;
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
 * @returns Promise with weather data and raw JSON string
 * @throws Error if API key is missing or fetch fails
 */
export async function fetchWeatherData(
  latitude: number,
  longitude: number
): Promise<WeatherFetchResult> {
  // Get API key from environment
  const apiKey = process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY;
  if (!apiKey) {
    throw new Error('API key not configured. Please add EXPO_PUBLIC_OPENWEATHER_API_KEY to .env.local');
  }

  // Fetch weather from OneCall 3.0 API using axios
  const response = await axios.get<WeatherData>(
    `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
  );

  const data = response.data;
  const rawJson = JSON.stringify(data, null, 2);

  return {
    data,
    rawJson,
  };
}
