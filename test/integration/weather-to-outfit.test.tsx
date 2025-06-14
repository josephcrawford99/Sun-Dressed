/**
 * Weather to Outfit Integration Tests - Testing complete user journey
 * These tests should FAIL initially and PASS when weather integration is implemented
 */

import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import HomeScreen from '@/app/(tabs)/home';
import { mockWeatherData, mockWeatherDataVariations } from '../__fixtures__/weatherData';
import { mockGeneratedOutfit, mockOutfitScenarios } from '../__fixtures__/outfitData';
import { renderWithProviders } from '../utils/testHelpers';

// Mock all services
jest.mock('@/services/weatherService', () => ({
  getWeatherForLocation: jest.fn(),
  getCurrentLocationWeather: jest.fn(),
}));

jest.mock('@/services/locationService', () => ({
  searchLocations: jest.fn(),
  getCurrentLocation: jest.fn(),
}));

jest.mock('@/services/outfitService', () => ({
  generateOutfit: jest.fn(),
}));

// Mock navigation
jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
  },
}));

describe('Weather to Outfit Integration', () => {
  const mockWeatherService = require('@/services/weatherService');
  const mockLocationService = require('@/services/locationService');
  const mockOutfitService = require('@/services/outfitService');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderHomeScreen = () => {
    return renderWithProviders(<HomeScreen />);
  };

  describe('complete weather-to-outfit journey', () => {
    it('should allow user to search location, get weather, and generate outfit', async () => {
      // Setup mocks for successful journey
      mockLocationService.searchLocations.mockResolvedValue([
        {
          placeId: 'sf-place-id',
          description: 'San Francisco, CA, USA',
          mainText: 'San Francisco',
          secondaryText: 'CA, USA',
        },
      ]);

      mockWeatherService.getWeatherForLocation.mockResolvedValue(mockWeatherData);
      mockOutfitService.generateOutfit.mockResolvedValue(mockGeneratedOutfit);

      const { getByTestId, getByText } = renderHomeScreen();

      // Step 1: Search for location
      const locationInput = getByTestId('location-search-input');
      fireEvent.changeText(locationInput, 'San Francisco');

      // Should show search suggestions
      await waitFor(() => {
        expect(getByText('San Francisco, CA, USA')).toBeOnTheScreen();
      });

      // Step 2: Select location
      fireEvent.press(getByText('San Francisco, CA, USA'));

      // Should fetch weather data
      expect(mockWeatherService.getWeatherForLocation).toHaveBeenCalledWith(
        'San Francisco, CA, USA'
      );

      // Step 3: Weather data should be displayed
      await waitFor(() => {
        expect(getByText('72°F')).toBeOnTheScreen();
        expect(getByText('Partly cloudy')).toBeOnTheScreen();
      });

      // Step 4: Generate outfit based on weather
      const generateButton = getByTestId('generate-outfit-button');
      fireEvent.press(generateButton);

      expect(mockOutfitService.generateOutfit).toHaveBeenCalledWith(
        mockWeatherData,
        'San Francisco, CA, USA',
        'casual' // Default activity type
      );

      // Step 5: Outfit should be displayed
      await waitFor(() => {
        expect(getByText('Light Cotton T-Shirt')).toBeOnTheScreen();
        expect(getByText('Lightweight Chinos')).toBeOnTheScreen();
        expect(getByText('White Sneakers')).toBeOnTheScreen();
      });
    });

    it('should use current location when location access is granted', async () => {
      mockLocationService.getCurrentLocation.mockResolvedValue({
        latitude: 37.7749,
        longitude: -122.4194,
        accuracy: 10,
      });

      mockWeatherService.getCurrentLocationWeather.mockResolvedValue(mockWeatherData);
      mockOutfitService.generateOutfit.mockResolvedValue(mockGeneratedOutfit);

      const { getByTestId } = renderHomeScreen();

      // Use current location button
      const currentLocationButton = getByTestId('current-location-button');
      fireEvent.press(currentLocationButton);

      expect(mockLocationService.getCurrentLocation).toHaveBeenCalled();
      expect(mockWeatherService.getCurrentLocationWeather).toHaveBeenCalled();

      // Weather and outfit should be generated
      await waitFor(() => {
        expect(mockOutfitService.generateOutfit).toHaveBeenCalledWith(
          mockWeatherData,
          expect.any(String),
          'casual'
        );
      });
    });

    it('should adapt outfit suggestions to different weather conditions', async () => {
      const testCases = [
        {
          weather: mockWeatherDataVariations.hot,
          expectedItems: ['Tank Top', 'Shorts', 'Sandals'],
          location: 'Phoenix, AZ',
        },
        {
          weather: mockWeatherDataVariations.cold,
          expectedItems: ['Winter Coat', 'Warm Pants', 'Boots'],
          location: 'Minneapolis, MN',
        },
        {
          weather: mockWeatherDataVariations.rainy,
          expectedItems: ['Rain Jacket', 'Waterproof Shoes'],
          location: 'Seattle, WA',
        },
      ];

      for (const testCase of testCases) {
        mockWeatherService.getWeatherForLocation.mockResolvedValue(testCase.weather);
        mockOutfitService.generateOutfit.mockResolvedValue({
          ...mockGeneratedOutfit,
          items: testCase.expectedItems.map((name, index) => ({
            id: `item-${index}`,
            category: 'top',
            name,
            description: `Weather-appropriate ${name}`,
            color: 'blue',
            material: 'cotton',
            isRequired: true,
          })),
        });

        const { getByTestId } = renderHomeScreen();

        // Simulate location selection
        const locationInput = getByTestId('location-search-input');
        fireEvent.changeText(locationInput, testCase.location);

        // Generate outfit
        const generateButton = getByTestId('generate-outfit-button');
        fireEvent.press(generateButton);

        expect(mockOutfitService.generateOutfit).toHaveBeenCalledWith(
          testCase.weather,
          testCase.location,
          'casual'
        );

        // Verify weather-appropriate items are suggested
        await waitFor(() => {
          testCase.expectedItems.forEach(item => {
            expect(getByText(item)).toBeOnTheScreen();
          });
        });
      }
    });
  });

  describe('error handling in integration flow', () => {
    it('should handle weather API errors gracefully', async () => {
      mockLocationService.searchLocations.mockResolvedValue([
        { description: 'Test Location', placeId: 'test-place' },
      ]);

      mockWeatherService.getWeatherForLocation.mockRejectedValue(
        new Error('Weather service unavailable')
      );

      const { getByTestId, getByText } = renderHomeScreen();

      // Search and select location
      const locationInput = getByTestId('location-search-input');
      fireEvent.changeText(locationInput, 'Test Location');

      await waitFor(() => {
        expect(getByText('Test Location')).toBeOnTheScreen();
      });

      fireEvent.press(getByText('Test Location'));

      // Should show weather error
      await waitFor(() => {
        expect(getByText(/weather.*unavailable/i)).toBeOnTheScreen();
      });

      // Generate button should be disabled or show fallback
      const generateButton = getByTestId('generate-outfit-button');
      expect(generateButton).toBeDisabled();
    });

    it('should handle location permission denial', async () => {
      mockLocationService.getCurrentLocation.mockRejectedValue(
        new Error('Location permission denied')
      );

      const { getByTestId, getByText } = renderHomeScreen();

      const currentLocationButton = getByTestId('current-location-button');
      fireEvent.press(currentLocationButton);

      await waitFor(() => {
        expect(getByText(/location permission/i)).toBeOnTheScreen();
      });

      // Should provide fallback to manual location entry
      expect(getByTestId('location-search-input')).toBeOnTheScreen();
    });

    it('should handle outfit generation failures', async () => {
      mockWeatherService.getWeatherForLocation.mockResolvedValue(mockWeatherData);
      mockOutfitService.generateOutfit.mockRejectedValue(
        new Error('AI service temporarily unavailable')
      );

      const { getByTestId, getByText } = renderHomeScreen();

      // Simulate weather data loaded
      const generateButton = getByTestId('generate-outfit-button');
      fireEvent.press(generateButton);

      await waitFor(() => {
        expect(getByText(/outfit generation.*failed/i)).toBeOnTheScreen();
      });

      // Should provide retry option
      expect(getByTestId('retry-outfit-button')).toBeOnTheScreen();
    });

    it('should handle network connectivity issues', async () => {
      mockLocationService.searchLocations.mockRejectedValue(
        new Error('Network request failed')
      );

      const { getByTestId, getByText } = renderHomeScreen();

      const locationInput = getByTestId('location-search-input');
      fireEvent.changeText(locationInput, 'Any Location');

      await waitFor(() => {
        expect(getByText(/network.*connection/i)).toBeOnTheScreen();
      });

      // Should show offline mode or cached data option
      expect(getByTestId('offline-mode-indicator')).toBeOnTheScreen();
    });
  });

  describe('activity type integration', () => {
    it('should generate different outfits for different activities', async () => {
      mockWeatherService.getWeatherForLocation.mockResolvedValue(mockWeatherData);

      const activities = ['business', 'outdoor', 'casual', 'formal'];

      for (const activity of activities) {
        const expectedOutfit = {
          ...mockGeneratedOutfit,
          items: mockOutfitScenarios[activity]?.items || mockGeneratedOutfit.items,
        };

        mockOutfitService.generateOutfit.mockResolvedValue(expectedOutfit);

        const { getByTestId } = renderHomeScreen();

        // Select activity type
        const activitySelector = getByTestId('activity-type-selector');
        fireEvent.press(activitySelector);

        const activityOption = getByTestId(`activity-${activity}`);
        fireEvent.press(activityOption);

        // Generate outfit
        const generateButton = getByTestId('generate-outfit-button');
        fireEvent.press(generateButton);

        expect(mockOutfitService.generateOutfit).toHaveBeenCalledWith(
          mockWeatherData,
          expect.any(String),
          activity
        );

        // Verify activity-appropriate items
        await waitFor(() => {
          expectedOutfit.items.forEach(item => {
            expect(getByText(item.name)).toBeOnTheScreen();
          });
        });
      }
    });
  });

  describe('data persistence and state management', () => {
    it('should remember last selected location across app sessions', async () => {
      // Simulate app restart with persisted location
      mockWeatherService.getWeatherForLocation.mockResolvedValue(mockWeatherData);

      const { getByTestId, getByDisplayValue } = renderHomeScreen();

      // Should load previously selected location
      await waitFor(() => {
        expect(getByDisplayValue('San Francisco, CA')).toBeOnTheScreen();
      });

      // Should automatically load weather for saved location
      expect(mockWeatherService.getWeatherForLocation).toHaveBeenCalledWith(
        'San Francisco, CA'
      );
    });

    it('should cache weather data to reduce API calls', async () => {
      mockWeatherService.getWeatherForLocation.mockResolvedValue(mockWeatherData);

      const { getByTestId } = renderHomeScreen();

      // First weather request
      const generateButton = getByTestId('generate-outfit-button');
      fireEvent.press(generateButton);

      await waitFor(() => {
        expect(mockWeatherService.getWeatherForLocation).toHaveBeenCalledTimes(1);
      });

      // Second request within cache window
      fireEvent.press(generateButton);

      // Should use cached data, not make second API call
      expect(mockWeatherService.getWeatherForLocation).toHaveBeenCalledTimes(1);
    });
  });
});