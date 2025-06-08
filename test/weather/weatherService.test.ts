/**
 * Weather Service Tests - Testing weather API integration
 * These tests should FAIL initially and PASS when weather service is implemented
 */

import axios from 'axios';
import { 
  fetchWeatherData, 
  getCurrentLocationWeather,
  getWeatherForLocation 
} from '@/services/weatherService'; // This service doesn't exist yet
import { mockWeatherData, mockWeatherApiResponse } from '../__fixtures__/weatherData';

// Mock axios
jest.mock('axios');
const mockAxios = axios as jest.Mocked<typeof axios>;

// Mock expo-location
jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(),
  getCurrentPositionAsync: jest.fn(),
  reverseGeocodeAsync: jest.fn(),
}));

describe('weatherService', () => {
  const mockApiKey = 'test-weather-api-key';

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY = mockApiKey;
  });

  describe('fetchWeatherData', () => {
    it('should fetch weather data for given coordinates', async () => {
      mockAxios.get.mockResolvedValue(mockWeatherApiResponse.success);

      const result = await fetchWeatherData(37.7749, -122.4194); // San Francisco coords

      expect(result).toEqual(expect.objectContaining({
        temperature: expect.any(Number),
        humidity: expect.any(Number),
        windSpeed: expect.any(Number),
        description: expect.any(String),
        condition: expect.any(String),
      }));

      expect(mockAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('openweathermap.org'),
        expect.objectContaining({
          params: expect.objectContaining({
            lat: 37.7749,
            lon: -122.4194,
            appid: mockApiKey,
            units: 'imperial',
          }),
        })
      );
    });

    it('should handle API errors gracefully', async () => {
      mockAxios.get.mockRejectedValue(new Error('Weather API unavailable'));

      await expect(
        fetchWeatherData(40.7128, -74.0060)
      ).rejects.toThrow('Failed to fetch weather data');
    });

    it('should validate API key configuration', async () => {
      delete process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY;

      await expect(
        fetchWeatherData(34.0522, -118.2437)
      ).rejects.toThrow('Weather API key not configured');
    });

    it('should transform API response to app format', async () => {
      const apiResponse = {
        data: {
          main: { temp: 75, humidity: 60 },
          wind: { speed: 8 },
          weather: [{ description: 'clear sky', main: 'Clear' }],
          name: 'Los Angeles',
        },
      };

      mockAxios.get.mockResolvedValue(apiResponse);

      const result = await fetchWeatherData(34.0522, -118.2437);

      expect(result).toEqual({
        temperature: 75,
        humidity: 60,
        windSpeed: 8,
        description: 'clear sky',
        condition: 'clear',
        location: 'Los Angeles',
        timestamp: expect.any(Date),
      });
    });
  });

  describe('getCurrentLocationWeather', () => {
    it('should request location permissions and fetch weather', async () => {
      const { requestForegroundPermissionsAsync, getCurrentPositionAsync } = 
        require('expo-location');

      requestForegroundPermissionsAsync.mockResolvedValue({ status: 'granted' });
      getCurrentPositionAsync.mockResolvedValue({
        coords: { latitude: 37.7749, longitude: -122.4194 },
      });
      
      mockAxios.get.mockResolvedValue(mockWeatherApiResponse.success);

      const result = await getCurrentLocationWeather();

      expect(requestForegroundPermissionsAsync).toHaveBeenCalled();
      expect(getCurrentPositionAsync).toHaveBeenCalled();
      expect(result).toEqual(expect.objectContaining({
        temperature: expect.any(Number),
        location: expect.any(String),
      }));
    });

    it('should handle location permission denial', async () => {
      const { requestForegroundPermissionsAsync } = require('expo-location');
      requestForegroundPermissionsAsync.mockResolvedValue({ status: 'denied' });

      await expect(getCurrentLocationWeather()).rejects.toThrow(
        'Location permission required'
      );
    });

    it('should handle location service errors', async () => {
      const { requestForegroundPermissionsAsync, getCurrentPositionAsync } = 
        require('expo-location');

      requestForegroundPermissionsAsync.mockResolvedValue({ status: 'granted' });
      getCurrentPositionAsync.mockRejectedValue(new Error('Location unavailable'));

      await expect(getCurrentLocationWeather()).rejects.toThrow(
        'Failed to get current location'
      );
    });
  });

  describe('getWeatherForLocation', () => {
    it('should fetch weather for named location', async () => {
      const geocodingResponse = {
        data: [
          {
            lat: 40.7128,
            lon: -74.0060,
            name: 'New York',
            country: 'US',
          },
        ],
      };

      mockAxios.get
        .mockResolvedValueOnce(geocodingResponse) // Geocoding call
        .mockResolvedValueOnce(mockWeatherApiResponse.success); // Weather call

      const result = await getWeatherForLocation('New York, NY');

      expect(result).toEqual(expect.objectContaining({
        temperature: expect.any(Number),
        location: expect.stringContaining('New York'),
      }));

      expect(mockAxios.get).toHaveBeenCalledTimes(2);
    });

    it('should handle invalid location names', async () => {
      mockAxios.get.mockResolvedValue({ data: [] }); // Empty geocoding result

      await expect(
        getWeatherForLocation('Invalid Location Name')
      ).rejects.toThrow('Location not found');
    });

    it('should cache weather data for performance', async () => {
      mockAxios.get.mockResolvedValue(mockWeatherApiResponse.success);

      // First call
      await getWeatherForLocation('Paris, France');
      
      // Second call with same location
      await getWeatherForLocation('Paris, France');

      // Should use cached data and not make second API call
      expect(mockAxios.get).toHaveBeenCalledTimes(1);
    });
  });

  describe('weather condition mapping', () => {
    it('should map API weather conditions to app conditions', async () => {
      const testCases = [
        { apiMain: 'Clear', expected: 'sunny' },
        { apiMain: 'Clouds', expected: 'cloudy' },
        { apiMain: 'Rain', expected: 'rainy' },
        { apiMain: 'Snow', expected: 'snowy' },
        { apiMain: 'Thunderstorm', expected: 'stormy' },
      ];

      for (const testCase of testCases) {
        const apiResponse = {
          data: {
            main: { temp: 70, humidity: 50 },
            wind: { speed: 5 },
            weather: [{ description: 'test', main: testCase.apiMain }],
            name: 'Test City',
          },
        };

        mockAxios.get.mockResolvedValue(apiResponse);

        const result = await fetchWeatherData(0, 0);
        
        expect(result.condition).toBe(testCase.expected);
      }
    });
  });

  describe('error handling and retries', () => {
    it('should retry failed requests up to 3 times', async () => {
      mockAxios.get
        .mockRejectedValueOnce(new Error('Network error'))
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce(mockWeatherApiResponse.success);

      const result = await fetchWeatherData(37.7749, -122.4194);

      expect(mockAxios.get).toHaveBeenCalledTimes(3);
      expect(result).toBeDefined();
    });

    it('should fail after 3 retry attempts', async () => {
      mockAxios.get.mockRejectedValue(new Error('Persistent network error'));

      await expect(
        fetchWeatherData(37.7749, -122.4194)
      ).rejects.toThrow('Failed to fetch weather data');

      expect(mockAxios.get).toHaveBeenCalledTimes(3);
    });
  });
});