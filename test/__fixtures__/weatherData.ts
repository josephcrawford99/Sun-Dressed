/**
 * Weather Data Fixtures - Test data for weather API integration
 */

import { WeatherData } from '@/types/weather';

export const mockWeatherData: WeatherData = {
  temperature: 72,
  humidity: 65,
  windSpeed: 8,
  description: 'Partly cloudy',
  condition: 'partly-cloudy',
  location: 'San Francisco, CA',
  timestamp: new Date('2025-06-08T12:00:00Z'),
};

export const mockWeatherDataVariations = {
  hot: {
    temperature: 95,
    humidity: 45,
    windSpeed: 5,
    description: 'Sunny',
    condition: 'sunny',
    location: 'Phoenix, AZ',
    timestamp: new Date('2025-07-15T14:00:00Z'),
  },
  cold: {
    temperature: 32,
    humidity: 80,
    windSpeed: 15,
    description: 'Snow showers',
    condition: 'snow',
    location: 'Minneapolis, MN',
    timestamp: new Date('2025-01-15T10:00:00Z'),
  },
  rainy: {
    temperature: 55,
    humidity: 90,
    windSpeed: 12,
    description: 'Heavy rain',
    condition: 'rain',
    location: 'Seattle, WA',
    timestamp: new Date('2025-11-10T16:00:00Z'),
  },
} as const;

// Mock API responses
export const mockWeatherApiResponse = {
  success: {
    data: {
      main: {
        temp: 72,
        humidity: 65,
      },
      wind: {
        speed: 8,
      },
      weather: [
        {
          description: 'partly cloudy',
          main: 'Clouds',
        },
      ],
      name: 'San Francisco',
    },
  },
  error: {
    message: 'Weather API error',
    code: 404,
  },
};

export const createMockWeatherData = (overrides: Partial<WeatherData> = {}): WeatherData => ({
  temperature: 70,
  humidity: 60,
  windSpeed: 10,
  description: 'Clear sky',
  condition: 'clear',
  location: 'Test Location',
  timestamp: new Date(),
  ...overrides,
});