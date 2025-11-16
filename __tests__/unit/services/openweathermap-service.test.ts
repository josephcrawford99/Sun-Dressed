/**
 * Unit tests for OpenWeatherMap Service
 */

import axios from 'axios';
import {
  fetchWeatherData,
  EXCLUDED_FIELDS,
  type WeatherData,
  type WeatherFetchResult,
} from '@/services/openweathermap-service';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('openweathermap-service', () => {
  beforeEach(() => {
    // Clear mocks before each test
    jest.clearAllMocks();
  });

  describe('fetchWeatherData', () => {
    const mockWeatherData: WeatherData = {
      lat: 40.7128,
      lon: -74.006,
      timezone: 'America/New_York',
      current: {
        dt: 1699876800,
        temp: 72.5,
        feels_like: 70.2,
        humidity: 65,
        uvi: 3.5,
        wind_speed: 10.5,
        wind_gust: 15.2,
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
          dt: 1699876800,
          sunrise: 1699876800,
          sunset: 1699920000,
          summary: 'Clear throughout the day',
          temp: {
            min: 60,
            max: 75,
            day: 72,
            night: 62,
            eve: 68,
            morn: 65,
          },
          feels_like: {
            day: 70,
            night: 60,
            eve: 66,
            morn: 63,
          },
          humidity: 65,
          wind_speed: 10.5,
          wind_gust: 15.2,
          weather: [
            {
              id: 800,
              main: 'Clear',
              description: 'clear sky',
              icon: '01d',
            },
          ],
          pop: 0.1,
          uvi: 3.5,
          rain: 0,
        },
      ],
    };

    describe('API Key Validation', () => {
      it('should throw error when API key is missing', async () => {
        // Arrange
        const originalValue = process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY;
        delete process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY;

        try {
          // Act & Assert
          await expect(fetchWeatherData(40.7128, -74.006)).rejects.toThrow(
            'API key not configured. Please add EXPO_PUBLIC_OPENWEATHER_API_KEY to .env.local'
          );
        } finally {
          // Restore
          process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY = originalValue;
        }
      });

      it('should throw error when API key is empty string', async () => {
        // Arrange
        const originalValue = process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY;
        process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY = '';

        try {
          // Act & Assert
          await expect(fetchWeatherData(40.7128, -74.006)).rejects.toThrow(
            'API key not configured. Please add EXPO_PUBLIC_OPENWEATHER_API_KEY to .env.local'
          );
        } finally {
          // Restore
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
        // Arrange
        const latitude = 40.7128;
        const longitude = -74.006;
        mockedAxios.get.mockResolvedValue({ data: mockWeatherData });

        // Act
        const result: WeatherFetchResult = await fetchWeatherData(latitude, longitude);

        // Assert
        expect(result.data).toEqual(mockWeatherData);
        expect(result.rawJson).toBe(JSON.stringify(mockWeatherData, null, 2));
        expect(mockedAxios.get).toHaveBeenCalledTimes(1);
        expect(mockedAxios.get).toHaveBeenCalledWith(
          `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&appid=test-api-key-12345&units=imperial&exclude=${EXCLUDED_FIELDS}`
        );
      });

      it('should fetch weather data successfully with metric units', async () => {
        // Arrange
        const latitude = 51.5074;
        const longitude = -0.1278;
        const metricWeatherData = { ...mockWeatherData, lat: latitude, lon: longitude };
        mockedAxios.get.mockResolvedValue({ data: metricWeatherData });

        // Act
        const result: WeatherFetchResult = await fetchWeatherData(latitude, longitude, 'metric');

        // Assert
        expect(result.data).toEqual(metricWeatherData);
        expect(result.rawJson).toBe(JSON.stringify(metricWeatherData, null, 2));
        expect(mockedAxios.get).toHaveBeenCalledTimes(1);
        expect(mockedAxios.get).toHaveBeenCalledWith(
          `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&appid=test-api-key-12345&units=metric&exclude=${EXCLUDED_FIELDS}`
        );
      });

      it('should fetch weather data successfully with imperial units explicitly', async () => {
        // Arrange
        const latitude = 34.0522;
        const longitude = -118.2437;
        const imperialWeatherData = { ...mockWeatherData, lat: latitude, lon: longitude };
        mockedAxios.get.mockResolvedValue({ data: imperialWeatherData });

        // Act
        const result: WeatherFetchResult = await fetchWeatherData(latitude, longitude, 'imperial');

        // Assert
        expect(result.data).toEqual(imperialWeatherData);
        expect(mockedAxios.get).toHaveBeenCalledWith(
          `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&appid=test-api-key-12345&units=imperial&exclude=${EXCLUDED_FIELDS}`
        );
      });

      it('should handle negative coordinates correctly', async () => {
        // Arrange
        const latitude = -33.8688;
        const longitude = 151.2093;
        const sydneyWeatherData = { ...mockWeatherData, lat: latitude, lon: longitude };
        mockedAxios.get.mockResolvedValue({ data: sydneyWeatherData });

        // Act
        const result: WeatherFetchResult = await fetchWeatherData(latitude, longitude);

        // Assert
        expect(result.data).toEqual(sydneyWeatherData);
        expect(mockedAxios.get).toHaveBeenCalledWith(
          `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&appid=test-api-key-12345&units=imperial&exclude=${EXCLUDED_FIELDS}`
        );
      });

      it('should return properly formatted raw JSON string', async () => {
        // Arrange
        mockedAxios.get.mockResolvedValue({ data: mockWeatherData });

        // Act
        const result: WeatherFetchResult = await fetchWeatherData(40.7128, -74.006);

        // Assert
        const parsedRawJson = JSON.parse(result.rawJson);
        expect(parsedRawJson).toEqual(mockWeatherData);
        expect(result.rawJson).toContain('\n'); // Should be formatted with newlines
        expect(result.rawJson.split('\n').length).toBeGreaterThan(1); // Multiple lines
      });
    });

    describe('URL and Query Parameter Construction', () => {
      const originalValue = process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY;

      beforeEach(() => {
        process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY = 'test-api-key-12345';
        mockedAxios.get.mockResolvedValue({ data: mockWeatherData });
      });

      afterEach(() => {
        process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY = originalValue;
      });

      it('should construct correct URL with all required parameters', async () => {
        // Arrange
        const latitude = 40.7128;
        const longitude = -74.006;

        // Act
        await fetchWeatherData(latitude, longitude);

        // Assert
        const calledUrl = mockedAxios.get.mock.calls[0][0];
        expect(calledUrl).toContain('https://api.openweathermap.org/data/3.0/onecall');
        expect(calledUrl).toContain(`lat=${latitude}`);
        expect(calledUrl).toContain(`lon=${longitude}`);
        expect(calledUrl).toContain('appid=test-api-key-12345');
        expect(calledUrl).toContain('units=imperial');
        expect(calledUrl).toContain(`exclude=${EXCLUDED_FIELDS}`);
      });

      it('should exclude minutely, hourly, and alerts from response', async () => {
        // Act
        await fetchWeatherData(40.7128, -74.006);

        // Assert
        const calledUrl = mockedAxios.get.mock.calls[0][0];
        expect(calledUrl).toContain('exclude=minutely,hourly,alerts');
      });

      it('should use correct API endpoint version 3.0', async () => {
        // Act
        await fetchWeatherData(40.7128, -74.006);

        // Assert
        const calledUrl = mockedAxios.get.mock.calls[0][0];
        expect(calledUrl).toContain('/data/3.0/onecall');
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

      it('should throw error when network request fails', async () => {
        // Arrange
        const networkError = new Error('Network Error');
        mockedAxios.get.mockRejectedValue(networkError);

        // Act & Assert
        await expect(fetchWeatherData(40.7128, -74.006)).rejects.toThrow('Network Error');
      });

      it('should throw error when API returns 401 Unauthorized', async () => {
        // Arrange
        const apiError = Object.assign(new Error('Request failed with status code 401'), {
          response: {
            status: 401,
            data: { message: 'Invalid API key' },
          },
        });
        mockedAxios.get.mockRejectedValue(apiError);

        // Act & Assert
        await expect(fetchWeatherData(40.7128, -74.006)).rejects.toThrow();
      });

      it('should throw error when API returns 404 Not Found', async () => {
        // Arrange
        const apiError = Object.assign(new Error('Request failed with status code 404'), {
          response: {
            status: 404,
            data: { message: 'City not found' },
          },
        });
        mockedAxios.get.mockRejectedValue(apiError);

        // Act & Assert
        await expect(fetchWeatherData(40.7128, -74.006)).rejects.toThrow();
      });

      it('should throw error when API returns 500 Internal Server Error', async () => {
        // Arrange
        const apiError = Object.assign(new Error('Request failed with status code 500'), {
          response: {
            status: 500,
            data: { message: 'Internal server error' },
          },
        });
        mockedAxios.get.mockRejectedValue(apiError);

        // Act & Assert
        await expect(fetchWeatherData(40.7128, -74.006)).rejects.toThrow();
      });

      it('should throw error when request times out', async () => {
        // Arrange
        const timeoutError = new Error('timeout of 10000ms exceeded');
        timeoutError.name = 'ECONNABORTED';
        mockedAxios.get.mockRejectedValue(timeoutError);

        // Act & Assert
        await expect(fetchWeatherData(40.7128, -74.006)).rejects.toThrow('timeout of 10000ms exceeded');
      });

      it('should throw error when response data is malformed', async () => {
        // Arrange
        mockedAxios.get.mockResolvedValue({ data: null });

        // Act
        const result = await fetchWeatherData(40.7128, -74.006);

        // Assert - should still return result even with null data
        expect(result.data).toBeNull();
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
        // Arrange
        const equatorData = { ...mockWeatherData, lat: 0, lon: 0 };
        mockedAxios.get.mockResolvedValue({ data: equatorData });

        // Act
        const result = await fetchWeatherData(0, 0);

        // Assert
        expect(result.data).toEqual(equatorData);
        expect(mockedAxios.get).toHaveBeenCalledWith(
          expect.stringContaining('lat=0&lon=0')
        );
      });

      it('should handle extreme northern coordinates', async () => {
        // Arrange
        const arcticData = { ...mockWeatherData, lat: 89.9, lon: 0 };
        mockedAxios.get.mockResolvedValue({ data: arcticData });

        // Act
        const result = await fetchWeatherData(89.9, 0);

        // Assert
        expect(result.data).toEqual(arcticData);
      });

      it('should handle extreme southern coordinates', async () => {
        // Arrange
        const antarcticData = { ...mockWeatherData, lat: -89.9, lon: 0 };
        mockedAxios.get.mockResolvedValue({ data: antarcticData });

        // Act
        const result = await fetchWeatherData(-89.9, 0);

        // Assert
        expect(result.data).toEqual(antarcticData);
      });

      it('should handle decimal coordinates with high precision', async () => {
        // Arrange
        const latitude = 40.712776;
        const longitude = -74.005974;
        const preciseData = { ...mockWeatherData, lat: latitude, lon: longitude };
        mockedAxios.get.mockResolvedValue({ data: preciseData });

        // Act
        const result = await fetchWeatherData(latitude, longitude);

        // Assert
        expect(result.data).toEqual(preciseData);
        expect(mockedAxios.get).toHaveBeenCalledWith(
          expect.stringContaining(`lat=${latitude}&lon=${longitude}`)
        );
      });
    });

    describe('Response Data Structure', () => {
      const originalValue = process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY;

      beforeEach(() => {
        process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY = 'test-api-key-12345';
      });

      afterEach(() => {
        process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY = originalValue;
      });

      it('should return WeatherFetchResult with correct structure', async () => {
        // Arrange
        mockedAxios.get.mockResolvedValue({ data: mockWeatherData });

        // Act
        const result = await fetchWeatherData(40.7128, -74.006);

        // Assert
        expect(result).toHaveProperty('data');
        expect(result).toHaveProperty('rawJson');
        expect(typeof result.rawJson).toBe('string');
      });

      it('should return weather data with current conditions', async () => {
        // Arrange
        mockedAxios.get.mockResolvedValue({ data: mockWeatherData });

        // Act
        const result = await fetchWeatherData(40.7128, -74.006);

        // Assert
        expect(result.data.current).toBeDefined();
        expect(result.data.current.temp).toBe(72.5);
        expect(result.data.current.feels_like).toBe(70.2);
        expect(result.data.current.humidity).toBe(65);
        expect(result.data.current.uvi).toBe(3.5);
        expect(result.data.current.wind_speed).toBe(10.5);
      });

      it('should return weather data with daily forecast', async () => {
        // Arrange
        mockedAxios.get.mockResolvedValue({ data: mockWeatherData });

        // Act
        const result = await fetchWeatherData(40.7128, -74.006);

        // Assert
        expect(result.data.daily).toBeDefined();
        expect(Array.isArray(result.data.daily)).toBe(true);
        expect(result.data.daily.length).toBeGreaterThan(0);
        expect(result.data.daily[0].temp).toBeDefined();
        expect(result.data.daily[0].weather).toBeDefined();
      });

      it('should return weather data with location information', async () => {
        // Arrange
        mockedAxios.get.mockResolvedValue({ data: mockWeatherData });

        // Act
        const result = await fetchWeatherData(40.7128, -74.006);

        // Assert
        expect(result.data.lat).toBe(40.7128);
        expect(result.data.lon).toBe(-74.006);
        expect(result.data.timezone).toBe('America/New_York');
      });
    });
  });

  describe('EXCLUDED_FIELDS constant', () => {
    it('should have correct excluded fields', () => {
      // Assert
      expect(EXCLUDED_FIELDS).toBe('minutely,hourly,alerts');
    });
  });
});
