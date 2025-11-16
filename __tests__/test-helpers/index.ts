/**
 * Test Helpers and Utilities
 *
 * This file contains reusable test utilities to make tests more maintainable
 * and resilient to feature changes.
 */

import { WeatherData } from '@/services/openweathermap-service';
import { Outfit, ClothingItem } from '@/types/outfit';

/**
 * Creates a complete mock WeatherData object with sensible defaults
 * Override any fields you need for your specific test
 */
export function createMockWeatherData(overrides?: Partial<WeatherData>): WeatherData {
  return {
    lat: 40.7128,
    lon: -74.006,
    timezone: 'America/New_York',
    current: {
      dt: 1699000000,
      temp: 72,
      feels_like: 68,
      humidity: 65,
      uvi: 5,
      wind_speed: 10,
      weather: [
        {
          id: 800,
          main: 'Clear',
          description: 'clear sky',
          icon: '01d',
        },
      ],
    },
    daily: [
      {
        dt: 1699000000,
        sunrise: 1698998000,
        sunset: 1699038000,
        temp: {
          min: 60,
          max: 75,
          day: 70,
          night: 62,
          eve: 68,
          morn: 61,
        },
        feels_like: {
          day: 68,
          night: 60,
          eve: 66,
          morn: 59,
        },
        humidity: 65,
        wind_speed: 10,
        weather: [
          {
            id: 800,
            main: 'Clear',
            description: 'clear sky',
            icon: '01d',
          },
        ],
        pop: 0.3,
        uvi: 6,
      },
    ],
    ...overrides,
  };
}

/**
 * Creates a mock ClothingItem with sensible defaults
 */
export function createMockClothingItem(overrides?: Partial<ClothingItem>): ClothingItem {
  return {
    name: 'Light Cotton T-Shirt',
    description: 'Breathable crew neck in neutral colors',
    blurb: 'Perfect for staying cool in warm weather while looking casual and relaxed.',
    ...overrides,
  };
}

/**
 * Creates a mock Outfit with sensible defaults
 */
export function createMockOutfit(overrides?: Partial<Outfit>): Outfit {
  return {
    items: [
      createMockClothingItem(),
      createMockClothingItem({
        name: 'Slim-Fit Jeans',
        description: 'Classic blue denim',
        blurb: 'Comfortable and versatile for everyday wear.',
      }),
    ],
    overallDescription:
      "Today's outfit balances comfort and style perfectly for the mild weather conditions.",
    warmCoatRecommended: false,
    rainGearRecommended: false,
    ...overrides,
  };
}

/**
 * Creates a minimal weather data object (useful for testing error handling)
 */
export function createMinimalWeatherData(): WeatherData {
  return {
    lat: 0,
    lon: 0,
    timezone: 'UTC',
    current: {} as any,
    daily: [],
  };
}

/**
 * Waits for async operations to complete
 * Useful when testing async state updates
 */
export function waitForAsync(ms: number = 0): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Mock environment variable setup
 * Use in beforeEach to set up test environment variables
 */
export function setupMockEnv(vars: Record<string, string>): void {
  Object.entries(vars).forEach(([key, value]) => {
    process.env[key] = value;
  });
}

/**
 * Clean up environment variables
 * Use in afterEach to clean up test environment
 */
export function cleanupMockEnv(keys: string[]): void {
  keys.forEach((key) => {
    delete process.env[key];
  });
}

/**
 * Creates a mock axios response
 */
export function createMockAxiosResponse<T>(data: T) {
  return {
    data,
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {} as any,
  };
}

/**
 * Creates a mock axios error
 */
export function createMockAxiosError(
  message: string,
  code?: string,
  statusCode?: number
): Error {
  const error: any = new Error(message);
  error.isAxiosError = true;
  if (code) error.code = code;
  if (statusCode) {
    error.response = {
      status: statusCode,
      data: { error: message },
    };
  }
  return error;
}
