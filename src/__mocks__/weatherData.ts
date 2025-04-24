import { WeatherData, DailyForecast } from '../services/weatherService';

// Mock current weather data
export const mockSunnyWeather: WeatherData = {
  temperature: 25,
  feels_like: 27,
  humidity: 40,
  description: 'clear sky',
  icon: '01d',
  wind_speed: 3.5,
  time_of_day: 'afternoon'
};

export const mockRainyWeather: WeatherData = {
  temperature: 18,
  feels_like: 16,
  humidity: 80,
  description: 'light rain',
  icon: '10d',
  wind_speed: 4.2,
  time_of_day: 'morning'
};

export const mockCloudyWeather: WeatherData = {
  temperature: 22,
  feels_like: 23,
  humidity: 60,
  description: 'scattered clouds',
  icon: '03d',
  wind_speed: 2.8,
  time_of_day: 'afternoon'
};

export const mockSnowyWeather: WeatherData = {
  temperature: -2,
  feels_like: -5,
  humidity: 85,
  description: 'light snow',
  icon: '13d',
  wind_speed: 1.5,
  time_of_day: 'morning'
};

export const mockNightWeather: WeatherData = {
  temperature: 15,
  feels_like: 14,
  humidity: 70,
  description: 'clear sky',
  icon: '01n',
  wind_speed: 1.2,
  time_of_day: 'evening'
};

// Mock forecast data
export const mockDailyForecast: DailyForecast = {
  morning: {
    temperature: 18,
    feels_like: 17,
    humidity: 75,
    description: 'few clouds',
    icon: '02d',
    wind_speed: 2.1,
    time_of_day: 'morning'
  },
  afternoon: {
    temperature: 24,
    feels_like: 25,
    humidity: 55,
    description: 'scattered clouds',
    icon: '03d',
    wind_speed: 3.2,
    time_of_day: 'afternoon'
  },
  evening: {
    temperature: 20,
    feels_like: 19,
    humidity: 65,
    description: 'broken clouds',
    icon: '04n',
    wind_speed: 2.5,
    time_of_day: 'evening'
  },
  date: '2023-06-20'
};
