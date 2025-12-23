/**
 * OpenWeatherMap Service
 * Handles communication with OpenWeatherMap 5-day/3-hour Forecast API
 */

import { WeatherData } from '@/types/weather';
import axios from 'axios';

/**
 * Temperature format/units options (matches OpenWeatherMap API units parameter)
 */
export type TempFormat = 'metric' | 'imperial';

/**
 * Centralized error handler for OpenWeatherMap API calls
 * Converts axios errors into user-friendly error messages
 *
 * @param error - The error caught from axios request
 * @throws Error with user-friendly message
 */
function handleWeatherApiError(error: unknown): never {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      const status = error.response.status;
      if (status === 503) {
        throw new Error('Weather service unavailable (503). Please try again later.');
      }
      if (status === 401) {
        throw new Error('Weather API key authentication failed.');
      }
      if (status === 429) {
        throw new Error('Weather API rate limit exceeded. Please try again later.');
      }
      throw new Error(`Weather API error (${status}): ${error.response.statusText}`);
    }
    if (error.request) {
      throw new Error('Network error: Unable to reach weather service. Check your connection.');
    }
  }
  throw error;
}

/**
 * OpenWeatherMap 5-day/3-hour Forecast API response type
 * Internal type - not exported to keep raw API details encapsulated
 */
interface OpenWeatherForecastResponse {
  cod: string;
  message: number;
  cnt: number;
  list: Array<{
    dt: number;
    main: {
      temp: number;
      feels_like: number;
      temp_min: number;
      temp_max: number;
      pressure: number;
      humidity: number;
    };
    weather: Array<{
      id: number;
      main: string;
      description: string;
      icon: string;
    }>;
    clouds: {
      all: number;
    };
    wind: {
      speed: number;
      deg: number;
      gust?: number;
    };
    visibility: number;
    pop: number;
    rain?: {
      '3h': number;
    };
    snow?: {
      '3h': number;
    };
    sys: {
      pod: string;
    };
    dt_txt: string;
  }>;
  city: {
    id: number;
    name: string;
    coord: {
      lat: number;
      lon: number;
    };
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}

/**
 * Number of 3-hour forecast chunks to fetch
 * 8 chunks = 24 hours of forecast data
 */
const FORECAST_COUNT = 8;

/**
 * Cached raw API response for debug purposes only
 * This is module-level state, not exported directly
 */
let cachedRawResponse: OpenWeatherForecastResponse | null = null;

/**
 * Transforms OpenWeatherMap 5-day/3-hour Forecast response to unified WeatherData interface
 *
 * Uses the first forecast chunk for current conditions since the API provides
 * forecast data starting from the nearest upcoming 3-hour window.
 *
 * Min/Max temperatures are calculated from all chunks in the response (24 hours).
 * Pop (probability of precipitation) uses the maximum value from all chunks.
 *
 * @param response - Raw forecast API response
 * @returns Unified WeatherData interface
 */
function transformForecastToWeatherData(response: OpenWeatherForecastResponse): WeatherData {
  const { list, city } = response;

  // Use first chunk for current/immediate forecast
  const firstChunk = list[0];

  // Calculate min/max from all chunks
  const temps = list.map((item) => item.main.temp);
  const minTemp = Math.min(...temps);
  const maxTemp = Math.max(...temps);

  // Get maximum probability of precipitation across all chunks
  const maxPop = Math.max(...list.map((item) => item.pop));

  return {
    lat: city.coord.lat,
    lon: city.coord.lon,
    name: city.name,
    temp: {
      current: firstChunk.main.temp,
      min: minTemp,
      max: maxTemp,
      feels_like: firstChunk.main.feels_like,
    },
    pop: maxPop,
    wind: {
      speed: firstChunk.wind.speed,
      gust: firstChunk.wind.gust,
    },
    description: firstChunk.weather[0].description,
    icon: firstChunk.weather[0].icon,
  };
}

/**
 * Fetches weather data from OpenWeatherMap 5-day/3-hour Forecast API
 * Automatically transforms the response to WeatherData
 *
 * @param latitude - Latitude coordinate
 * @param longitude - Longitude coordinate
 * @param units - Units of measurement ('metric' for Celsius, 'imperial' for Fahrenheit, defaults to 'imperial')
 * @returns Promise with unified WeatherData
 * @throws Error if API key is missing or fetch fails
 */
export async function fetchWeatherData(
  latitude: number,
  longitude: number,
  units: TempFormat = 'imperial'
): Promise<WeatherData> {
  const apiKey = process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY;
  if (!apiKey) {
    throw new Error('API key not configured. Please add EXPO_PUBLIC_OPENWEATHER_API_KEY to .env.local');
  }

  try {
    const response = await axios.get<OpenWeatherForecastResponse>(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}&cnt=${FORECAST_COUNT}`
    );

    // Cache raw response for debug access
    cachedRawResponse = response.data;

    return transformForecastToWeatherData(response.data);
  } catch (error) {
    handleWeatherApiError(error);
  }
}

/**
 * Returns the cached raw API response for debug purposes only
 * This should only be used by the debug screen
 *
 * @returns The last raw API response, or null if no data has been fetched
 */
export function getDebugRawForecast(): unknown {
  return cachedRawResponse;
}
