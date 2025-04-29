import axios from 'axios';
import { WEATHER_API, TIME_RANGES } from '../utils/constants';

export interface WeatherData {
  temperature: number;
  feels_like: number;
  humidity: number;
  wind_speed: number;
  description: string;
  icon: string;
  sunset?: number; // Unix timestamp
}

export interface DailyForecast {
  morning: WeatherData;
  afternoon: WeatherData;
  evening: WeatherData;
  date: string;
}

class WeatherError extends Error {
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
    // This is a simplified example - actual implementation would be more complex
    const forecastData: DailyForecast[] = [];

    // Process the data and return formatted forecasts
    // ...

    return forecastData;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new WeatherError('Invalid API key. Please check your configuration.', 'INVALID_API_KEY');
      } else if (error.response?.status === 404) {
        throw new WeatherError(`Location "${location}" not found. Please check the city name.`, 'LOCATION_NOT_FOUND');
      }
    }
    throw new WeatherError('Failed to fetch forecast data. Please try again.', 'UNKNOWN_ERROR');
  }
};

/**
 * Determine the time of day based on current hour
 */
const getTimeOfDay = (): 'morning' | 'afternoon' | 'evening' => {
  const hour = new Date().getHours();

  if (hour >= TIME_RANGES.MORNING.start && hour <= TIME_RANGES.MORNING.end) {
    return 'morning';
  } else if (hour >= TIME_RANGES.AFTERNOON.start && hour <= TIME_RANGES.AFTERNOON.end) {
    return 'afternoon';
  } else {
    return 'evening';
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
