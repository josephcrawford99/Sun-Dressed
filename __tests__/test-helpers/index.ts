/**
 * Test Helpers and Utilities
 *
 * This file contains reusable test utilities to make tests more maintainable
 * and resilient to feature changes.
 */

import { WeatherData } from '@/types/weather';
import { Outfit, ClothingItem } from '@/types/outfit';

/**
 * Creates a complete mock WeatherData object with sensible defaults
 * Override any fields you need for your specific test
 */
export function createMockWeatherData(overrides?: Partial<WeatherData>): WeatherData {
  return {
    lat: 40.7128,
    lon: -74.006,
    name: 'New York',
    temp: {
      current: 72,
      min: 60,
      max: 75,
      feels_like: 68,
    },
    pop: 0.3,
    wind: {
      speed: 10,
      gust: 15,
    },
    description: 'clear sky',
    icon: '01d',
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
 * Creates a minimal weather data object (useful for testing edge cases)
 */
export function createMinimalWeatherData(): WeatherData {
  return {
    lat: 0,
    lon: 0,
    name: '',
    temp: {
      current: 0,
      min: 0,
      max: 0,
      feels_like: 0,
    },
    pop: 0,
    wind: {
      speed: 0,
    },
    description: '',
    icon: '',
  };
}

/**
 * Creates a mock OpenWeatherMap 5-day/3-hour forecast API response
 */
export function createMockForecastResponse() {
  return {
    cod: '200',
    message: 0,
    cnt: 8,
    list: [
      {
        dt: 1699000000,
        main: {
          temp: 72,
          feels_like: 68,
          temp_min: 70,
          temp_max: 74,
          pressure: 1015,
          humidity: 65,
        },
        weather: [
          {
            id: 800,
            main: 'Clear',
            description: 'clear sky',
            icon: '01d',
          },
        ],
        clouds: { all: 0 },
        wind: {
          speed: 10,
          deg: 180,
          gust: 15,
        },
        visibility: 10000,
        pop: 0.1,
        sys: { pod: 'd' },
        dt_txt: '2023-11-01 12:00:00',
      },
      {
        dt: 1699010800,
        main: {
          temp: 75,
          feels_like: 72,
          temp_min: 73,
          temp_max: 77,
          pressure: 1014,
          humidity: 60,
        },
        weather: [
          {
            id: 800,
            main: 'Clear',
            description: 'clear sky',
            icon: '01d',
          },
        ],
        clouds: { all: 5 },
        wind: {
          speed: 12,
          deg: 190,
          gust: 18,
        },
        visibility: 10000,
        pop: 0.05,
        sys: { pod: 'd' },
        dt_txt: '2023-11-01 15:00:00',
      },
      {
        dt: 1699021600,
        main: {
          temp: 70,
          feels_like: 67,
          temp_min: 68,
          temp_max: 72,
          pressure: 1015,
          humidity: 68,
        },
        weather: [
          {
            id: 801,
            main: 'Clouds',
            description: 'few clouds',
            icon: '02d',
          },
        ],
        clouds: { all: 20 },
        wind: {
          speed: 8,
          deg: 200,
        },
        visibility: 10000,
        pop: 0.15,
        sys: { pod: 'd' },
        dt_txt: '2023-11-01 18:00:00',
      },
      {
        dt: 1699032400,
        main: {
          temp: 65,
          feels_like: 63,
          temp_min: 63,
          temp_max: 67,
          pressure: 1016,
          humidity: 72,
        },
        weather: [
          {
            id: 800,
            main: 'Clear',
            description: 'clear sky',
            icon: '01n',
          },
        ],
        clouds: { all: 0 },
        wind: {
          speed: 6,
          deg: 210,
        },
        visibility: 10000,
        pop: 0.1,
        sys: { pod: 'n' },
        dt_txt: '2023-11-01 21:00:00',
      },
      {
        dt: 1699043200,
        main: {
          temp: 62,
          feels_like: 60,
          temp_min: 60,
          temp_max: 64,
          pressure: 1017,
          humidity: 75,
        },
        weather: [
          {
            id: 800,
            main: 'Clear',
            description: 'clear sky',
            icon: '01n',
          },
        ],
        clouds: { all: 0 },
        wind: {
          speed: 5,
          deg: 220,
        },
        visibility: 10000,
        pop: 0.05,
        sys: { pod: 'n' },
        dt_txt: '2023-11-02 00:00:00',
      },
      {
        dt: 1699054000,
        main: {
          temp: 60,
          feels_like: 58,
          temp_min: 58,
          temp_max: 62,
          pressure: 1018,
          humidity: 78,
        },
        weather: [
          {
            id: 800,
            main: 'Clear',
            description: 'clear sky',
            icon: '01n',
          },
        ],
        clouds: { all: 0 },
        wind: {
          speed: 4,
          deg: 230,
        },
        visibility: 10000,
        pop: 0.0,
        sys: { pod: 'n' },
        dt_txt: '2023-11-02 03:00:00',
      },
      {
        dt: 1699064800,
        main: {
          temp: 58,
          feels_like: 56,
          temp_min: 56,
          temp_max: 60,
          pressure: 1018,
          humidity: 80,
        },
        weather: [
          {
            id: 800,
            main: 'Clear',
            description: 'clear sky',
            icon: '01n',
          },
        ],
        clouds: { all: 0 },
        wind: {
          speed: 3,
          deg: 240,
        },
        visibility: 10000,
        pop: 0.0,
        sys: { pod: 'n' },
        dt_txt: '2023-11-02 06:00:00',
      },
      {
        dt: 1699075600,
        main: {
          temp: 61,
          feels_like: 59,
          temp_min: 59,
          temp_max: 63,
          pressure: 1017,
          humidity: 76,
        },
        weather: [
          {
            id: 800,
            main: 'Clear',
            description: 'clear sky',
            icon: '01d',
          },
        ],
        clouds: { all: 5 },
        wind: {
          speed: 5,
          deg: 180,
        },
        visibility: 10000,
        pop: 0.0,
        sys: { pod: 'd' },
        dt_txt: '2023-11-02 09:00:00',
      },
    ],
    city: {
      id: 5128581,
      name: 'New York',
      coord: {
        lat: 40.7128,
        lon: -74.006,
      },
      country: 'US',
      population: 8175133,
      timezone: -18000,
      sunrise: 1698998000,
      sunset: 1699038000,
    },
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
