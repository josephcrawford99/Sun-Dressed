import axios from 'axios';

// You would store this in an environment variable in a real app
const API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export interface WeatherData {
  temperature: number;
  feels_like: number;
  humidity: number;
  description: string;
  icon: string;
  wind_speed: number;
  time_of_day: 'morning' | 'afternoon' | 'evening';
}

export interface DailyForecast {
  morning: WeatherData;
  afternoon: WeatherData;
  evening: WeatherData;
  date: string;
}

/**
 * Get current weather for a given location
 */
export const getCurrentWeather = async (
  location: string
): Promise<WeatherData> => {
  try {
    const response = await axios.get(`${BASE_URL}/weather`, {
      params: {
        q: location,
        appid: API_KEY,
        units: 'metric'
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
      time_of_day: timeOfDay
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw new Error('Failed to fetch weather data');
  }
};

/**
 * Get 5-day forecast for a given location
 */
export const getForecast = async (
  location: string
): Promise<DailyForecast[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/forecast`, {
      params: {
        q: location,
        appid: API_KEY,
        units: 'metric'
      }
    });

    // Process the forecast data
    // This is a simplified example - actual implementation would be more complex
    const forecastData: DailyForecast[] = [];

    // Process the data and return formatted forecasts
    // ...

    return forecastData;
  } catch (error) {
    console.error('Error fetching forecast data:', error);
    throw new Error('Failed to fetch forecast data');
  }
};

/**
 * Determine the time of day based on current hour
 */
const getTimeOfDay = (): 'morning' | 'afternoon' | 'evening' => {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) {
    return 'morning';
  } else if (hour >= 12 && hour < 17) {
    return 'afternoon';
  } else {
    return 'evening';
  }
};
