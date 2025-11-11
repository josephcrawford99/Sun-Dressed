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
 * Fields to exclude from the OpenWeatherMap API response
 * Excludes: minutely, hourly, and alerts (not currently used in the app)
 */
export const EXCLUDED_FIELDS = 'minutely,hourly,alerts';

/**
 * OpenWeatherMap OneCall 3.0 API response type
 * Matches the actual API structure
 */
export interface OpenWeather30Response {
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
 * OpenWeatherMap 2.5 Current Weather API response type
 */
export interface OpenWeather25CurrentResponse {
  coord: {
    lon: number;
    lat: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  wind: {
    speed: number;
    deg: number;
    gust?: number;
  };
  clouds: {
    all: number;
  };
  rain?: {
    '1h': number;
  };
  snow?: {
    '1h': number;
  };
  dt: number;
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  name: string;
}

/**
 * OpenWeatherMap 2.5 Forecast API response type
 */
export interface OpenWeather25ForecastResponse {
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
    pop: number;
    rain?: {
      '3h': number;
    };
    snow?: {
      '3h': number;
    };
    dt_txt: string;
  }>;
  city: {
    coord: {
      lat: number;
      lon: number;
    };
    country: string;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}

/**
 * Unified weather data interface used by the app
 * Contains only the fields actually used across the application
 */
export interface WeatherData {
  lat: number;
  lon: number;
  name: string;
  temp: {
    current: number;
    min: number;
    max: number;
    feels_like: number;

  };
  pop: number;
  uvi?: number;
  description: string;
  icon: string;
}

/**
 * Result from fetching weather data from 3.0 API
 * Includes both raw API response and transformed unified data
 */
export interface Weather30Result {
  data: WeatherData;
  raw: OpenWeather30Response;
}

/**
 * Result from fetching weather data from 2.5 API
 * Includes both raw API responses and transformed unified data
 * Forecast is optional - can be disabled to save API calls since 3.0 provides better daily data
 */
export interface Weather25Result {
  data: WeatherData;
  raw: {
    current: OpenWeather25CurrentResponse;
    forecast?: OpenWeather25ForecastResponse;
  };
}

/**
 * Fetches weather data from OpenWeatherMap OneCall 3.0 API
 *
 * @param latitude - Latitude coordinate
 * @param longitude - Longitude coordinate
 * @param units - Units of measurement ('metric' for Celsius, 'imperial' for Fahrenheit, defaults to 'imperial')
 * @returns Promise with unified WeatherData and raw API response
 * @throws Error if API key is missing or fetch fails
 */
export async function fetch30WeatherData(
  latitude: number,
  longitude: number,
  units: TempFormat = 'imperial'
): Promise<Weather30Result> {
  // Get API key from environment
  const apiKey = process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY;
  if (!apiKey) {
    throw new Error('API key not configured. Please add EXPO_PUBLIC_OPENWEATHER_API_KEY to .env.local');
  }

  // Fetch weather from OneCall 3.0 API using axios
  try {
    const response = await axios.get<OpenWeather30Response>(
      `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}&exclude=${EXCLUDED_FIELDS}`
    );

    // Return both raw and transformed data
    return {
      data: transform30ToWeatherData(response.data),
      raw: response.data,
    };
  } catch (error) {
    handleWeatherApiError(error);
  }
}

/**
 * Fetches weather data from OpenWeatherMap 2.5 API
 *
 * Currently only fetches current weather (/weather endpoint).
 * Forecast endpoint is commented out to save API calls since 3.0 provides better daily data.
 * Uncomment the forecast section below to re-enable it.
 *
 * @param latitude - Latitude coordinate
 * @param longitude - Longitude coordinate
 * @param units - Units of measurement ('metric' for Celsius, 'imperial' for Fahrenheit, defaults to 'imperial')
 * @returns Promise with unified WeatherData and raw API responses
 * @throws Error if API key is missing or fetch fails
 */
export async function fetch25WeatherData(
  latitude: number,
  longitude: number,
  units: TempFormat = 'imperial'
): Promise<Weather25Result> {
  // Get API key from environment
  const apiKey = process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY;
  if (!apiKey) {
    throw new Error('API key not configured. Please add EXPO_PUBLIC_OPENWEATHER_API_KEY to .env.local');
  }

  // Fetch current weather from 2.5 API
  try {
    const currentResponse = await axios.get<OpenWeather25CurrentResponse>(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}`
    );

    // OPTIONAL: Uncomment to also fetch forecast data (adds extra API call)
    // const forecastResponse = await axios.get<OpenWeather25ForecastResponse>(
    //   `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}`
    // );

    // Return both raw and transformed data
    return {
      data: transform25ToWeatherData(currentResponse.data),
      raw: {
        current: currentResponse.data,
        // forecast: forecastResponse.data, // Uncomment if fetching forecast above
      },
    };
  } catch (error) {
    handleWeatherApiError(error);
  }
}

/**
 * Transforms OpenWeatherMap 3.0 response to unified WeatherData interface
 *
 * @param data - Raw 3.0 API response
 * @returns Unified WeatherData interface
 */
export function transform30ToWeatherData(data: OpenWeather30Response): WeatherData {
  return {
    lat: data.lat,
    lon: data.lon,
    name: '', // 3.0 API doesn't provide city name
    temp: {
      current: data.current.temp,
      min: data.daily[0].temp.min,
      max: data.daily[0].temp.max,
      feels_like: data.current.feels_like,
    },
    pop: data.daily[0].pop,
    uvi: data.current.uvi,
    description: data.current.weather[0].description,
    icon: data.current.weather[0].icon,
  };
}

/**
 * Estimates precipitation probability from current weather conditions
 * Used when forecast data is not available
 *
 * @param current - Current weather from 2.5 API
 * @returns Estimated probability of precipitation (0-1)
 */
function estimatePrecipitationProbability(current: OpenWeather25CurrentResponse): number {
  // If currently raining or snowing, high probability
  if (current.rain?.['1h'] && current.rain['1h'] > 0) {
    return 0.8; // 80% if actively raining
  }
  if (current.snow?.['1h'] && current.snow['1h'] > 0) {
    return 0.8; // 80% if actively snowing
  }

  // Check weather condition
  const weatherMain = current.weather[0]?.main?.toLowerCase() || '';
  if (weatherMain === 'rain' || weatherMain === 'drizzle' || weatherMain === 'thunderstorm') {
    return 0.7; // 70% if weather condition indicates rain
  }
  if (weatherMain === 'snow') {
    return 0.7; // 70% if weather condition indicates snow
  }

  // Estimate based on cloud coverage
  const cloudiness = current.clouds.all;
  if (cloudiness > 80) {
    return 0.4; // 40% for very cloudy
  }
  if (cloudiness > 50) {
    return 0.2; // 20% for moderately cloudy
  }

  return 0; // Clear or lightly cloudy
}

/**
 * Transforms OpenWeatherMap 2.5 responses to unified WeatherData interface
 * Note: 2.5 API does not provide UV index, so it will be undefined
 *
 * @param current - Current weather from 2.5 API
 * @param forecast - Optional forecast data from 2.5 API (if not provided, uses current weather data for daily values)
 * @returns Unified WeatherData interface
 */
export function transform25ToWeatherData(
  current: OpenWeather25CurrentResponse,
  forecast?: OpenWeather25ForecastResponse
): WeatherData {
  let tempMin = current.main.temp_min;
  let tempMax = current.main.temp_max;
  let avgPop = 0;

  // If forecast data is provided, use it to calculate more accurate daily values
  if (forecast) {
    // Group forecast data by day (forecast provides 3-hour intervals)
    // We'll use the first day (today) from the forecast
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime() / 1000;
    const tomorrowStart = todayStart + 86400;

    // Filter today's forecast entries
    const todayEntries = forecast.list.filter(
      (entry) => entry.dt >= todayStart && entry.dt < tomorrowStart
    );

    // Calculate min/max temps for today from forecast
    const temps = todayEntries.map((entry) => entry.main.temp);
    if (temps.length > 0) {
      tempMin = Math.min(...temps);
      tempMax = Math.max(...temps);
    }

    // Calculate average precipitation probability for today
    const pops = todayEntries.map((entry) => entry.pop);
    avgPop = pops.length > 0 ? pops.reduce((a, b) => a + b, 0) / pops.length : 0;
  } else {
    // No forecast data - estimate precipitation probability from current conditions
    avgPop = estimatePrecipitationProbability(current);
  }

  return {
    lat: current.coord.lat,
    lon: current.coord.lon,
    name: current.name,
    temp: {
      current: current.main.temp,
      min: tempMin,
      max: tempMax,
      feels_like: current.main.feels_like,
    },
    pop: avgPop,
    uvi: undefined, // 2.5 API doesn't provide UV index
    description: current.weather[0].description,
    icon: current.weather[0].icon,
  };
}

/**
 * Merges weather data from 3.0 and 2.5 APIs to get the best of both
 * Strategy:
 * - Use 2.5 for current conditions (fresher, updates every 5 minutes)
 * - Use 3.0 for UV index and daily forecast (more comprehensive)
 * - Fallback to whichever is available if only one succeeds
 *
 * @param data30 - Weather data from 3.0 API (may be undefined)
 * @param data25 - Weather data from 2.5 API (may be undefined)
 * @returns Merged WeatherData or undefined if neither available
 */
export function mergeWeatherData(
  data30: WeatherData | undefined,
  data25: WeatherData | undefined
): WeatherData | undefined {
  // If neither available, return undefined
  if (!data30 && !data25) return undefined;

  // If only one available, use it
  if (!data30) return data25;
  if (!data25) return data30;

  // Both available - synthesize optimally
  return {
    lat: data30.lat,
    lon: data30.lon,
    name: data25.name, // 2.5 has city name, 3.0 doesn't
    temp: {
      // Use 2.5 for current temp and feels_like (fresher, updates every 5 minutes)
      current: data25.temp.current,
      feels_like: data25.temp.feels_like,
      // Use 3.0 for daily min/max (more comprehensive and accurate)
      min: data30.temp.min,
      max: data30.temp.max,
    },
    // Use 3.0's pop if available, otherwise fall back to 2.5's estimated pop
    pop: data30.pop !== undefined ? data30.pop : data25.pop,
    // Use 3.0 for UV index (2.5 doesn't have it)
    uvi: data30.uvi,
    // Use 2.5 for current weather description and icon (fresher)
    description: data25.description,
    icon: data25.icon,
  };
}
