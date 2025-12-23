/**
 * Release Tests - Critical User Paths
 *
 * These integration tests verify critical functionality before each release:
 * - User preferences persistence
 * - Weather data integration
 * - Outfit generation pipeline
 * - Error handling and resilience
 *
 * Run before deployment: npm run test:release
 */

// Mock axios BEFORE importing modules that use it
jest.mock('axios');

import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { fetchWeatherData } from '@/services/openweathermap-service';
import { generateOutfitRecommendation } from '@/services/gemini-service';
import { parseOutfitJSON } from '@/utils/outfit-parser';
import { capitalizeAllWords } from '@/utils/strings';
import { buildOutfitPrompt } from '@/utils/prompt-generator';
import { WeatherData } from '@/types/weather';
import { createMockWeatherData, createMockForecastResponse } from '../test-helpers';

const mockedAxios = axios as jest.Mocked<typeof axios>;

// Sample weather data for testing (using new 5-day/3-hour forecast structure)
const mockWeatherData: WeatherData = createMockWeatherData();

// Mock forecast API response for axios mock
const mockForecastResponse = createMockForecastResponse();

describe('Release Tests - Critical User Paths', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();

    // Reset environment variables
    process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY = 'test-weather-key';
    process.env.EXPO_PUBLIC_GEMINI_API_KEY = 'test-gemini-key';
  });

  describe('User Preferences Workflow', () => {
    it('should persist style and temperature preferences across sessions', async () => {
      // Arrange - Mock AsyncStorage to simulate persistence
      const mockStorage: Record<string, string> = {};
      (AsyncStorage.getItem as jest.MockedFunction<typeof AsyncStorage.getItem>).mockImplementation(
        (key) => Promise.resolve(mockStorage[key] || null)
      );
      (AsyncStorage.setItem as jest.MockedFunction<typeof AsyncStorage.setItem>).mockImplementation(
        (key, value) => {
          mockStorage[key] = value;
          return Promise.resolve();
        }
      );

      // Act - Simulate saving preferences
      const preferences = {
        style: 'feminine',
        tempFormat: 'metric',
      };
      await AsyncStorage.setItem('sundressed-storage', JSON.stringify({ state: preferences }));

      // Simulate app restart - retrieve preferences
      const storedData = await AsyncStorage.getItem('sundressed-storage');
      const retrieved = storedData ? JSON.parse(storedData) : null;

      // Assert - Preferences should persist
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'sundressed-storage',
        expect.stringContaining('feminine')
      );
      expect(retrieved?.state?.style).toBe('feminine');
      expect(retrieved?.state?.tempFormat).toBe('metric');
    });

    it('should handle missing stored preferences gracefully', async () => {
      // Arrange - Mock empty storage
      (AsyncStorage.getItem as jest.MockedFunction<typeof AsyncStorage.getItem>).mockResolvedValue(null);

      // Act - Try to retrieve preferences
      const storedData = await AsyncStorage.getItem('sundressed-storage');

      // Assert - Should return null without errors
      expect(storedData).toBeNull();
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('sundressed-storage');
    });

    it('should handle corrupted stored data gracefully', async () => {
      // Arrange - Mock corrupted JSON data
      (AsyncStorage.getItem as jest.MockedFunction<typeof AsyncStorage.getItem>).mockResolvedValue('invalid-json{{{');

      // Act - Try to parse corrupted data
      const storedData = await AsyncStorage.getItem('sundressed-storage');
      let parsed = null;
      let error = null;

      try {
        parsed = JSON.parse(storedData!);
      } catch (e) {
        error = e;
      }

      // Assert - Should handle parse error gracefully
      expect(error).toBeTruthy();
      expect(parsed).toBeNull();
    });
  });

  describe('Weather Integration', () => {
    it('should fetch weather data successfully with valid API key', async () => {
      // Arrange
      mockedAxios.get.mockResolvedValue({ data: mockForecastResponse });

      // Act
      const result = await fetchWeatherData(40.7128, -74.006, 'imperial');

      // Assert - fetchWeatherData now returns WeatherData directly
      expect(result).toBeDefined();
      expect(result.temp.current).toBe(72);
      expect(result.description).toBe('clear sky');
      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('api.openweathermap.org/data/2.5/forecast')
      );
    });

    it('should handle weather API errors gracefully', async () => {
      // Arrange - Mock API error
      mockedAxios.get.mockRejectedValue(new Error('Network error'));

      // Act & Assert - Should throw meaningful error
      await expect(
        fetchWeatherData(40.7128, -74.006, 'imperial')
      ).rejects.toThrow('Network error');
    });

    it('should handle missing API key gracefully', async () => {
      // Arrange - Remove API key
      delete process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY;

      // Act & Assert - Should throw meaningful error
      await expect(
        fetchWeatherData(40.7128, -74.006, 'imperial')
      ).rejects.toThrow('API key not configured');
    });

    it('should use correct temperature units in API request', async () => {
      // Arrange
      mockedAxios.get.mockResolvedValue({ data: mockForecastResponse });

      // Act - Request metric units
      await fetchWeatherData(40.7128, -74.006, 'metric');

      // Assert - Should include units parameter
      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('units=metric')
      );
    });

    it('should handle invalid coordinates gracefully', async () => {
      // Arrange - Mock API error for invalid coordinates
      mockedAxios.get.mockRejectedValue(new Error('Invalid coordinates'));

      // Act & Assert
      await expect(
        fetchWeatherData(999, 999, 'imperial')
      ).rejects.toThrow('Invalid coordinates');
    });
  });

  describe('Outfit Generation Pipeline', () => {
    it('should parse valid AI response into outfit recommendation', () => {
      // Arrange - Valid AI response
      const validResponse = `{
  "items": [
    {
      "name": "Light Cotton T-Shirt",
      "description": "Breathable and comfortable for warm weather",
      "blurb": "Perfect for keeping cool on a sunny day"
    },
    {
      "name": "Denim Shorts",
      "description": "Classic casual bottoms",
      "blurb": "Comfortable and stylish for outdoor activities"
    }
  ],
  "overallDescription": "This outfit is perfect for a warm, sunny day!",
  "warmCoatRecommended": false,
  "rainGearRecommended": false
}`;

      // Act
      const outfit = parseOutfitJSON(validResponse);

      // Assert
      expect(outfit.items).toHaveLength(2);
      expect(outfit.items[0].name).toBe('Light Cotton T-Shirt');
      expect(outfit.items[1].name).toBe('Denim Shorts');
      expect(outfit.overallDescription).toContain('perfect for a warm, sunny day');
      expect(outfit.warmCoatRecommended).toBe(false);
      expect(outfit.rainGearRecommended).toBe(false);
    });

    it('should parse AI response wrapped in markdown code blocks', () => {
      // Arrange - Response with markdown formatting
      const markdownResponse = `\`\`\`json
{
  "items": [
    {
      "name": "Winter Coat",
      "description": "Heavy insulated outerwear",
      "blurb": "Essential for cold weather protection"
    }
  ],
  "overallDescription": "Stay warm with this cozy outfit!",
  "warmCoatRecommended": true,
  "rainGearRecommended": false
}
\`\`\``;

      // Act
      const outfit = parseOutfitJSON(markdownResponse);

      // Assert
      expect(outfit.items).toHaveLength(1);
      expect(outfit.items[0].name).toBe('Winter Coat');
      expect(outfit.warmCoatRecommended).toBe(true);
    });

    it('should handle malformed JSON response gracefully', () => {
      // Arrange - Invalid JSON
      const invalidResponse = 'This is not JSON at all!';

      // Act & Assert - Should throw meaningful error
      expect(() => parseOutfitJSON(invalidResponse)).toThrow('Failed to parse JSON');
    });

    it('should validate required fields in outfit response', () => {
      // Arrange - Missing required fields
      const incompleteResponse = `{
  "items": [],
  "overallDescription": "Description here"
}`;

      // Act & Assert - Should throw validation error
      expect(() => parseOutfitJSON(incompleteResponse)).toThrow('warmCoatRecommended');
    });

    it('should validate item structure in outfit response', () => {
      // Arrange - Items missing required fields
      const invalidItemsResponse = `{
  "items": [
    {
      "name": "T-Shirt"
    }
  ],
  "overallDescription": "Description",
  "warmCoatRecommended": false,
  "rainGearRecommended": false
}`;

      // Act & Assert - Should throw validation error for missing item fields
      expect(() => parseOutfitJSON(invalidItemsResponse)).toThrow('description');
    });

    it('should generate outfit recommendation with valid inputs', async () => {
      // Arrange - Mock successful Gemini API response
      const mockGeminiResponse = {
        candidates: [
          {
            content: {
              parts: [
                {
                  text: JSON.stringify({
                    items: [
                      {
                        name: 'Summer Dress',
                        description: 'Light flowy sundress',
                        blurb: 'Perfect for hot weather and outdoor events',
                      },
                    ],
                    overallDescription: 'A beautiful outfit for a sunny day!',
                    warmCoatRecommended: false,
                    rainGearRecommended: false,
                  }),
                },
              ],
            },
          },
        ],
      };
      mockedAxios.post.mockResolvedValue({ data: mockGeminiResponse });

      // Act
      const prompt = 'Generate outfit for sunny 75°F weather';
      const result = await generateOutfitRecommendation(prompt);

      // Assert
      expect(result.recommendation.items).toHaveLength(1);
      expect(result.recommendation.items[0].name).toBe('Summer Dress');
      expect(result.rawText).toContain('Summer Dress');
      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining('generativelanguage.googleapis.com'),
        expect.objectContaining({
          contents: expect.arrayContaining([
            expect.objectContaining({
              parts: expect.arrayContaining([
                expect.objectContaining({ text: prompt }),
              ]),
            }),
          ]),
        }),
        expect.objectContaining({
          headers: expect.objectContaining({
            'x-goog-api-key': 'test-gemini-key',
          }),
        })
      );
    });

    it('should handle Gemini API missing API key', async () => {
      // Arrange - Remove API key
      delete process.env.EXPO_PUBLIC_GEMINI_API_KEY;

      // Act & Assert
      await expect(
        generateOutfitRecommendation('Test prompt')
      ).rejects.toThrow('Gemini API key not configured');
    });

    it('should handle Gemini API errors gracefully', async () => {
      // Arrange - Mock API error
      mockedAxios.post.mockRejectedValue(new Error('API rate limit exceeded'));

      // Act & Assert
      await expect(
        generateOutfitRecommendation('Test prompt')
      ).rejects.toThrow('API rate limit exceeded');
    });

    it('should handle empty Gemini API response', async () => {
      // Arrange - Mock empty response
      mockedAxios.post.mockResolvedValue({
        data: {
          candidates: [],
        },
      });

      // Act & Assert
      await expect(
        generateOutfitRecommendation('Test prompt')
      ).rejects.toThrow('No response generated from Gemini API');
    });

    it('should handle malformed Gemini API response structure', async () => {
      // Arrange - Mock response with missing content
      mockedAxios.post.mockResolvedValue({
        data: {
          candidates: [
            {
              content: {
                parts: [],
              },
            },
          ],
        },
      });

      // Act & Assert
      await expect(
        generateOutfitRecommendation('Test prompt')
      ).rejects.toThrow('Invalid response format from Gemini API');
    });
  });

  describe('Prompt Generation Integration', () => {
    it('should generate complete prompt with all user preferences and weather data', () => {
      // Arrange
      const userPrefs = {
        style: 'masculine' as const,
        activity: 'outdoor hiking',
      };

      // Act
      const prompt = buildOutfitPrompt(userPrefs, mockWeatherData, 'imperial');

      // Assert - Verify all critical data is included (new structure)
      expect(prompt).toContain('72°F'); // Current temp
      expect(prompt).toContain('Feels like: 68°F');
      expect(prompt).toContain("Today's High: 75°F");
      expect(prompt).toContain("Today's Low: 60°F");
      expect(prompt).toContain('Chance of Rain: 30%');
      expect(prompt).toContain('clear sky');
      expect(prompt).toContain('masculine');
      expect(prompt).toContain('outdoor hiking');
    });

    it('should use metric units when specified', () => {
      // Arrange
      const userPrefs = { style: 'neutral' as const, activity: '' };

      // Act
      const prompt = buildOutfitPrompt(userPrefs, mockWeatherData, 'metric');

      // Assert
      expect(prompt).toContain('°C');
      expect(prompt).not.toContain('°F');
    });

    it('should include default activity when not specified', () => {
      // Arrange
      const userPrefs = { style: 'neutral' as const, activity: '' };

      // Act
      const prompt = buildOutfitPrompt(userPrefs, mockWeatherData, 'imperial');

      // Assert
      expect(prompt).toContain('general daily activities');
    });
  });

  describe('String Utilities Integration', () => {
    it('should capitalize clothing item names correctly', () => {
      // Arrange
      const items = [
        'light cotton t-shirt',
        'denim shorts',
        'running sneakers',
      ];

      // Act
      const capitalized = items.map(capitalizeAllWords);

      // Assert
      expect(capitalized[0]).toBe('Light Cotton T-shirt');
      expect(capitalized[1]).toBe('Denim Shorts');
      expect(capitalized[2]).toBe('Running Sneakers');
    });

    it('should handle empty strings in capitalization', () => {
      // Arrange & Act
      const result = capitalizeAllWords('');

      // Assert
      expect(result).toBe('');
    });

    it('should preserve multiple spaces in capitalization', () => {
      // Arrange
      const input = 'hello    world';

      // Act
      const result = capitalizeAllWords(input);

      // Assert
      expect(result).toContain('   '); // Multiple spaces preserved
      expect(result.split(' ').filter(w => w).length).toBe(2);
    });

    it('should handle single word capitalization', () => {
      // Arrange & Act
      const result = capitalizeAllWords('shirt');

      // Assert
      expect(result).toBe('Shirt');
    });

    it('should handle all uppercase input', () => {
      // Arrange & Act
      const result = capitalizeAllWords('COTTON T-SHIRT');

      // Assert
      expect(result).toBe('Cotton T-shirt');
    });
  });

  describe('End-to-End Critical Path', () => {
    it('should complete full outfit generation workflow', async () => {
      // Arrange - Setup complete workflow
      // 1. Mock weather API (5-day/3-hour forecast)
      mockedAxios.get.mockResolvedValue({ data: mockForecastResponse });

      // 2. Mock Gemini API
      const mockOutfitResponse = {
        candidates: [
          {
            content: {
              parts: [
                {
                  text: JSON.stringify({
                    items: [
                      {
                        name: 'Lightweight Linen Shirt',
                        description: 'Breathable button-up for warm weather',
                        blurb: 'Keeps you cool and looking sharp',
                      },
                      {
                        name: 'Chino Shorts',
                        description: 'Smart casual shorts',
                        blurb: 'Perfect blend of comfort and style',
                      },
                    ],
                    overallDescription: 'This outfit balances comfort and style for a beautiful day!',
                    warmCoatRecommended: false,
                    rainGearRecommended: false,
                  }),
                },
              ],
            },
          },
        ],
      };
      mockedAxios.post.mockResolvedValue({ data: mockOutfitResponse });

      // 3. Setup user preferences
      const userPrefs = {
        style: 'masculine' as const,
        activity: 'casual brunch',
      };

      // Act - Execute full workflow
      // Step 1: Fetch weather (now returns WeatherData directly)
      const weatherResult = await fetchWeatherData(40.7128, -74.006, 'imperial');

      // Step 2: Build prompt
      const prompt = buildOutfitPrompt(userPrefs, weatherResult, 'imperial');

      // Step 3: Generate outfit
      const outfitResult = await generateOutfitRecommendation(prompt);

      // Assert - Verify complete workflow
      expect(weatherResult.temp.current).toBe(72);
      expect(prompt).toContain('masculine');
      expect(prompt).toContain('casual brunch');
      expect(outfitResult.recommendation.items).toHaveLength(2);
      expect(outfitResult.recommendation.items[0].name).toBe('Lightweight Linen Shirt');
      expect(outfitResult.recommendation.warmCoatRecommended).toBe(false);
    });

    it('should handle workflow failure at weather fetch gracefully', async () => {
      // Arrange - Mock weather API failure
      mockedAxios.get.mockRejectedValue(new Error('Weather service unavailable'));

      // Act & Assert - Should fail early with clear error
      await expect(
        fetchWeatherData(40.7128, -74.006, 'imperial')
      ).rejects.toThrow('Weather service unavailable');
    });

    it('should handle workflow failure at outfit generation gracefully', async () => {
      // Arrange - Weather succeeds, but Gemini fails
      mockedAxios.get.mockResolvedValue({ data: mockForecastResponse });
      mockedAxios.post.mockRejectedValue(new Error('Gemini service timeout'));

      const userPrefs = { style: 'neutral' as const, activity: '' };

      // Act - Get weather successfully (now returns WeatherData directly)
      const weatherResult = await fetchWeatherData(40.7128, -74.006, 'imperial');
      const prompt = buildOutfitPrompt(userPrefs, weatherResult, 'imperial');

      // Assert - Weather should succeed, outfit generation should fail
      expect(weatherResult).toBeDefined();
      await expect(
        generateOutfitRecommendation(prompt)
      ).rejects.toThrow('Gemini service timeout');
    });
  });

  describe('Error Resilience', () => {
    it('should provide helpful error message for missing weather API key', async () => {
      // Arrange
      delete process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY;

      // Act & Assert
      await expect(
        fetchWeatherData(40.7128, -74.006, 'imperial')
      ).rejects.toThrow('Please add EXPO_PUBLIC_OPENWEATHER_API_KEY to .env.local');
    });

    it('should provide helpful error message for missing Gemini API key', async () => {
      // Arrange
      delete process.env.EXPO_PUBLIC_GEMINI_API_KEY;

      // Act & Assert
      await expect(
        generateOutfitRecommendation('test')
      ).rejects.toThrow('Please add EXPO_PUBLIC_GEMINI_API_KEY to .env.local');
    });

    it('should handle network timeouts gracefully', async () => {
      // Arrange - Mock timeout error
      mockedAxios.get.mockRejectedValue(new Error('timeout of 10000ms exceeded'));

      // Act & Assert
      await expect(
        fetchWeatherData(40.7128, -74.006, 'imperial')
      ).rejects.toThrow('timeout');
    });
  });
});
