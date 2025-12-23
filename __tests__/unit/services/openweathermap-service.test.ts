/**
 * Unit tests for OpenWeatherMap Service
 * Tests the 5-day/3-hour forecast API integration
 */

import axios from 'axios';
import { fetchWeatherData } from '@/services/openweathermap-service';
import { createMockForecastResponse } from '../../test-helpers';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Restore isAxiosError to work properly with mocked errors
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(mockedAxios as any).isAxiosError = (error: unknown) => {
  return (error as Record<string, unknown>)?.isAxiosError === true;
};

describe('openweathermap-service', () => {
  const mockForecastResponse = createMockForecastResponse();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchWeatherData', () => {
    describe('API Key Validation', () => {
      it('should throw error when API key is missing', async () => {
        const originalValue = process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY;
        delete process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY;

        try {
          await expect(fetchWeatherData(40.7128, -74.006)).rejects.toThrow(
            'API key not configured. Please add EXPO_PUBLIC_OPENWEATHER_API_KEY to .env.local'
          );
        } finally {
          process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY = originalValue;
        }
      });

      it('should throw error when API key is empty string', async () => {
        const originalValue = process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY;
        process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY = '';

        try {
          await expect(fetchWeatherData(40.7128, -74.006)).rejects.toThrow(
            'API key not configured. Please add EXPO_PUBLIC_OPENWEATHER_API_KEY to .env.local'
          );
        } finally {
          process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY = originalValue;
        }
      });
    });

    describe('Successful API Calls', () => {
      const originalValue = process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY;

      beforeEach(() => {
        process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY = 'test-api-key-12345';
      });

      afterEach(() => {
        process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY = originalValue;
      });

      it('should fetch weather data successfully with default imperial units', async () => {
        const latitude = 40.7128;
        const longitude = -74.006;
        mockedAxios.get.mockResolvedValue({ data: mockForecastResponse });

        const result = await fetchWeatherData(latitude, longitude);

        expect(result).toBeDefined();
        expect(result.lat).toBe(40.7128);
        expect(result.lon).toBe(-74.006);
        expect(result.name).toBe('New York');
        expect(mockedAxios.get).toHaveBeenCalledTimes(1);
        expect(mockedAxios.get).toHaveBeenCalledWith(
          expect.stringContaining('api.openweathermap.org/data/2.5/forecast')
        );
      });

      it('should fetch weather data successfully with metric units', async () => {
        const latitude = 51.5074;
        const longitude = -0.1278;
        mockedAxios.get.mockResolvedValue({ data: mockForecastResponse });

        const result = await fetchWeatherData(latitude, longitude, 'metric');

        expect(result).toBeDefined();
        expect(mockedAxios.get).toHaveBeenCalledWith(
          expect.stringContaining('units=metric')
        );
      });

      it('should fetch weather data successfully with imperial units explicitly', async () => {
        const latitude = 34.0522;
        const longitude = -118.2437;
        mockedAxios.get.mockResolvedValue({ data: mockForecastResponse });

        const result = await fetchWeatherData(latitude, longitude, 'imperial');

        expect(result).toBeDefined();
        expect(mockedAxios.get).toHaveBeenCalledWith(
          expect.stringContaining('units=imperial')
        );
      });

      it('should handle negative coordinates correctly', async () => {
        const latitude = -33.8688;
        const longitude = 151.2093;
        mockedAxios.get.mockResolvedValue({ data: mockForecastResponse });

        const result = await fetchWeatherData(latitude, longitude);

        expect(result).toBeDefined();
        expect(mockedAxios.get).toHaveBeenCalledWith(
          expect.stringContaining(`lat=${latitude}&lon=${longitude}`)
        );
      });
    });

    describe('URL and Query Parameter Construction', () => {
      const originalValue = process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY;

      beforeEach(() => {
        process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY = 'test-api-key-12345';
        mockedAxios.get.mockResolvedValue({ data: mockForecastResponse });
      });

      afterEach(() => {
        process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY = originalValue;
      });

      it('should construct correct URL with all required parameters', async () => {
        const latitude = 40.7128;
        const longitude = -74.006;

        await fetchWeatherData(latitude, longitude);

        const calledUrl = mockedAxios.get.mock.calls[0][0];
        expect(calledUrl).toContain('https://api.openweathermap.org/data/2.5/forecast');
        expect(calledUrl).toContain(`lat=${latitude}`);
        expect(calledUrl).toContain(`lon=${longitude}`);
        expect(calledUrl).toContain('appid=test-api-key-12345');
        expect(calledUrl).toContain('units=imperial');
        expect(calledUrl).toContain('cnt=8');
      });

      it('should use cnt=8 to get 24 hours of forecast data', async () => {
        await fetchWeatherData(40.7128, -74.006);

        const calledUrl = mockedAxios.get.mock.calls[0][0];
        expect(calledUrl).toContain('cnt=8');
      });

      it('should use correct API endpoint version 2.5 forecast', async () => {
        await fetchWeatherData(40.7128, -74.006);

        const calledUrl = mockedAxios.get.mock.calls[0][0];
        expect(calledUrl).toContain('/data/2.5/forecast');
      });
    });

    describe('Response Transformation', () => {
      const originalValue = process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY;

      beforeEach(() => {
        process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY = 'test-api-key-12345';
      });

      afterEach(() => {
        process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY = originalValue;
      });

      it('should transform forecast response to WeatherData correctly', async () => {
        mockedAxios.get.mockResolvedValue({ data: mockForecastResponse });

        const result = await fetchWeatherData(40.7128, -74.006);

        // Check transformed data
        expect(result.lat).toBe(40.7128);
        expect(result.lon).toBe(-74.006);
        expect(result.name).toBe('New York');
        expect(result.temp.current).toBe(72); // First chunk's temp
        expect(result.temp.feels_like).toBe(68); // First chunk's feels_like
        expect(result.description).toBe('clear sky'); // First chunk's description
        expect(result.icon).toBe('01d'); // First chunk's icon
      });

      it('should calculate min temp from all chunks', async () => {
        mockedAxios.get.mockResolvedValue({ data: mockForecastResponse });

        const result = await fetchWeatherData(40.7128, -74.006);

        // Min temp from mock data is 58 (from chunk 7)
        expect(result.temp.min).toBe(58);
      });

      it('should calculate max temp from all chunks', async () => {
        mockedAxios.get.mockResolvedValue({ data: mockForecastResponse });

        const result = await fetchWeatherData(40.7128, -74.006);

        // Max temp from mock data is 75 (from chunk 2)
        expect(result.temp.max).toBe(75);
      });

      it('should calculate max pop from all chunks', async () => {
        mockedAxios.get.mockResolvedValue({ data: mockForecastResponse });

        const result = await fetchWeatherData(40.7128, -74.006);

        // Max pop from mock data is 0.15 (from chunk 3)
        expect(result.pop).toBe(0.15);
      });

      it('should use wind data from first chunk', async () => {
        mockedAxios.get.mockResolvedValue({ data: mockForecastResponse });

        const result = await fetchWeatherData(40.7128, -74.006);

        expect(result.wind.speed).toBe(10);
        expect(result.wind.gust).toBe(15);
      });

      it('should handle missing wind gust', async () => {
        const responseWithNoGust = {
          ...mockForecastResponse,
          list: mockForecastResponse.list.map((item, i) =>
            i === 0 ? { ...item, wind: { speed: 10, deg: 180 } } : item
          ),
        };
        mockedAxios.get.mockResolvedValue({ data: responseWithNoGust });

        const result = await fetchWeatherData(40.7128, -74.006);

        expect(result.wind.speed).toBe(10);
        expect(result.wind.gust).toBeUndefined();
      });
    });

    describe('Error Handling', () => {
      const originalValue = process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY;

      beforeEach(() => {
        process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY = 'test-api-key-12345';
      });

      afterEach(() => {
        process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY = originalValue;
      });

      it('should throw user-friendly error for 503 Service Unavailable', async () => {
        const error: any = new Error('Request failed');
        error.isAxiosError = true;
        error.response = { status: 503, statusText: 'Service Unavailable' };
        mockedAxios.get.mockRejectedValue(error);

        await expect(fetchWeatherData(40.7128, -74.006)).rejects.toThrow(
          'Weather service unavailable (503). Please try again later.'
        );
      });

      it('should throw user-friendly error for 401 Unauthorized', async () => {
        const error: any = new Error('Request failed');
        error.isAxiosError = true;
        error.response = { status: 401, statusText: 'Unauthorized' };
        mockedAxios.get.mockRejectedValue(error);

        await expect(fetchWeatherData(40.7128, -74.006)).rejects.toThrow(
          'Weather API key authentication failed.'
        );
      });

      it('should throw user-friendly error for 429 Rate Limit', async () => {
        const error: any = new Error('Request failed');
        error.isAxiosError = true;
        error.response = { status: 429, statusText: 'Too Many Requests' };
        mockedAxios.get.mockRejectedValue(error);

        await expect(fetchWeatherData(40.7128, -74.006)).rejects.toThrow(
          'Weather API rate limit exceeded. Please try again later.'
        );
      });

      it('should throw error with status code for other API errors', async () => {
        const error: any = new Error('Request failed');
        error.isAxiosError = true;
        error.response = { status: 500, statusText: 'Internal Server Error' };
        mockedAxios.get.mockRejectedValue(error);

        await expect(fetchWeatherData(40.7128, -74.006)).rejects.toThrow(
          'Weather API error (500): Internal Server Error'
        );
      });

      it('should throw network error message when request fails', async () => {
        const error: any = new Error('Network Error');
        error.isAxiosError = true;
        error.request = {}; // No response means network error
        mockedAxios.get.mockRejectedValue(error);

        await expect(fetchWeatherData(40.7128, -74.006)).rejects.toThrow(
          'Network error: Unable to reach weather service. Check your connection.'
        );
      });

      it('should rethrow non-axios errors', async () => {
        const error = new Error('Unexpected error');
        mockedAxios.get.mockRejectedValue(error);

        await expect(fetchWeatherData(40.7128, -74.006)).rejects.toThrow('Unexpected error');
      });
    });

    describe('Edge Cases', () => {
      const originalValue = process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY;

      beforeEach(() => {
        process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY = 'test-api-key-12345';
      });

      afterEach(() => {
        process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY = originalValue;
      });

      it('should handle coordinates at equator (0, 0)', async () => {
        mockedAxios.get.mockResolvedValue({ data: mockForecastResponse });

        const result = await fetchWeatherData(0, 0);

        expect(result).toBeDefined();
        expect(mockedAxios.get).toHaveBeenCalledWith(
          expect.stringContaining('lat=0&lon=0')
        );
      });

      it('should handle extreme northern coordinates', async () => {
        mockedAxios.get.mockResolvedValue({ data: mockForecastResponse });

        const result = await fetchWeatherData(89.9, 0);

        expect(result).toBeDefined();
      });

      it('should handle extreme southern coordinates', async () => {
        mockedAxios.get.mockResolvedValue({ data: mockForecastResponse });

        const result = await fetchWeatherData(-89.9, 0);

        expect(result).toBeDefined();
      });

      it('should handle decimal coordinates with high precision', async () => {
        const latitude = 40.712776;
        const longitude = -74.005974;
        mockedAxios.get.mockResolvedValue({ data: mockForecastResponse });

        const result = await fetchWeatherData(latitude, longitude);

        expect(result).toBeDefined();
        expect(mockedAxios.get).toHaveBeenCalledWith(
          expect.stringContaining(`lat=${latitude}&lon=${longitude}`)
        );
      });
    });
  });
});
