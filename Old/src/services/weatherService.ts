import axios from 'axios';
import { WEATHER_API, TIME_RANGES } from '../utils/constants';

export interface WeatherData {
  temperature: number;
  feels_like: number;
  humidity: number;
  wind_speed: number;
  description: string;
  icon: string;
  time_of_day?: 'morning' | 'afternoon' | 'evening' | 'night';
  sunset?: number; // Unix timestamp
}

export interface DailyForecast {
  morning: WeatherData;
  afternoon: WeatherData;
  evening: WeatherData;
  date: string;
}

export class WeatherError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'WeatherError';
  }
}

/**
 * Get current weather for a given location
 */
export const getCurrentWeather = async (
  location: string
): Promise<WeatherData> => {
  try {
    const response = await axios.get(`${WEATHER_API.BASE_URL}/weather`, {
      params: {
        q: location,
        appid: WEATHER_API.KEY,
        units: WEATHER_API.UNITS
      }
    });

    const data = response.data;
    const timeOfDay = getTimeOfDay();

    return {
      temperature: Math.round(data.main.temp),
      feels_like: Math.round(data.main.feels_like),
      humidity: data.main.humidity,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      wind_speed: data.wind.speed,
      time_of_day: timeOfDay,
      sunset: data.sys?.sunset ? Math.floor(data.sys.sunset / 1000) : undefined
    };
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new WeatherError('Invalid API key. Please check your configuration.', 'INVALID_API_KEY');
      } else if (error.response?.status === 404) {
        throw new WeatherError(`Location "${location}" not found. Please check the city name.`, 'LOCATION_NOT_FOUND');
      } else if (error.response?.status === 429) {
        throw new WeatherError('API rate limit exceeded. Please try again later.', 'RATE_LIMIT');
      } else if (!error.response) {
        throw new WeatherError('Network error. Please check your connection.', 'NETWORK_ERROR');
      }
    }
    throw new WeatherError('Failed to fetch weather data. Please try again.', 'UNKNOWN_ERROR');
  }
};

/**
 * Get 5-day forecast for a given location
 */
export const getForecast = async (
  location: string
): Promise<DailyForecast[]> => {
  try {
    const response = await axios.get(`${WEATHER_API.BASE_URL}/forecast`, {
      params: {
        q: location,
        appid: WEATHER_API.KEY,
        units: WEATHER_API.UNITS
      }
    });

    // Process the forecast data
    const forecastList = response.data.list;
    const forecastByDay: Record<string, any[]> = {};

    // Group forecast data by day
    forecastList.forEach((item: any) => {
      const date = new Date(item.dt * 1000);
      const dateStr = date.toISOString().split('T')[0];

      if (!forecastByDay[dateStr]) {
        forecastByDay[dateStr] = [];
      }

      forecastByDay[dateStr].push(item);
    });

    // Create DailyForecast objects for each day
    const dailyForecasts: DailyForecast[] = Object.keys(forecastByDay).map(date => {
      const dayData = forecastByDay[date];

      // Find forecast items closest to morning, afternoon, evening times
      const morning = findClosestForecast(dayData, TIME_RANGES.MORNING.start + 2); // 7 AM
      const afternoon = findClosestForecast(dayData, TIME_RANGES.AFTERNOON.start + 2); // 2 PM
      const evening = findClosestForecast(dayData, TIME_RANGES.EVENING.start + 2); // 7 PM

      return {
        date,
        morning: formatForecast(morning),
        afternoon: formatForecast(afternoon),
        evening: formatForecast(evening)
      };
    });

    return dailyForecasts.slice(0, 5); // Return 5-day forecast
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new WeatherError('Invalid API key. Please check your configuration.', 'INVALID_API_KEY');
      } else if (error.response?.status === 404) {
        throw new WeatherError(`Location "${location}" not found. Please check the city name.`, 'LOCATION_NOT_FOUND');
      } else if (error.response?.status === 429) {
        throw new WeatherError('API rate limit exceeded. Please try again later.', 'RATE_LIMIT');
      } else if (!error.response) {
        throw new WeatherError('Network error. Please check your connection.', 'NETWORK_ERROR');
      }
    }
    throw new WeatherError('Failed to fetch forecast data. Please try again.', 'UNKNOWN_ERROR');
  }
};

/**
 * Helper function to find the forecast closest to a specific hour
 */
const findClosestForecast = (forecasts: any[], targetHour: number): any => {
  return forecasts.reduce((closest, current) => {
    const currentHour = new Date(current.dt * 1000).getHours();
    const closestHour = closest ? new Date(closest.dt * 1000).getHours() : -1;

    const currentDiff = Math.abs(currentHour - targetHour);
    const closestDiff = closest ? Math.abs(closestHour - targetHour) : Infinity;

    return currentDiff < closestDiff ? current : closest;
  }, null);
};

/**
 * Format forecast data into WeatherData
 */
const formatForecast = (forecastItem: any): WeatherData => {
  if (!forecastItem) {
    // Provide a default object if no forecast is available for the time
    return {
      temperature: 0,
      feels_like: 0,
      humidity: 0,
      wind_speed: 0,
      description: 'No data',
      icon: '01d'
    };
  }

  return {
    temperature: Math.round(forecastItem.main.temp),
    feels_like: Math.round(forecastItem.main.feels_like),
    humidity: forecastItem.main.humidity,
    description: forecastItem.weather[0].description,
    icon: forecastItem.weather[0].icon,
    wind_speed: forecastItem.wind.speed
  };
};

/**
 * Determine the time of day based on current hour
 */
const getTimeOfDay = (): 'morning' | 'afternoon' | 'evening' | 'night' => {
  const hour = new Date().getHours();

  if (hour >= TIME_RANGES.MORNING.start && hour <= TIME_RANGES.MORNING.end) {
    return 'morning';
  } else if (hour >= TIME_RANGES.AFTERNOON.start && hour <= TIME_RANGES.AFTERNOON.end) {
    return 'afternoon';
  } else if (hour >= TIME_RANGES.EVENING.start && hour <= TIME_RANGES.EVENING.end) {
    return 'evening';
  } else {
    return 'night';
  }
};

/**
 * Test if the API key is valid and working
 */
export const testApiKey = async () => {
  try {
    const response = await fetch(
      `${WEATHER_API.BASE_URL}/weather?q=New York&units=${WEATHER_API.UNITS}&appid=${WEATHER_API.KEY}`
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API Error: ${errorData.message}`);
    }

    const data = await response.json();
    return {
      success: true,
      data: data
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

export const getWeatherData = async (location: string): Promise<WeatherData> => {
  // This should integrate with your actual weather API
  // For now, returning mock data
  const mockData: WeatherData = {
    temperature: 72,
    feels_like: 74,
    humidity: 65,
    wind_speed: 5,
    description: "Clear sky",
    icon: "01d",
    sunset: Math.floor(new Date().setHours(19, 0, 0) / 1000), // Example sunset at 7 PM
  };

  return mockData;
};
