/**
 * Outfit Service Tests - Testing AI outfit generation with Gemini API
 * These tests should PASS as the service is fully implemented
 */

import axios from 'axios';
import { generateOutfit } from '@/services/outfitService';
import { mockWeatherData } from '../__fixtures__/weatherData';
import { mockGeminiApiResponse, mockOutfitItems } from '../__fixtures__/outfitData';

// Mock axios
jest.mock('axios');
const mockAxios = axios as jest.Mocked<typeof axios>;

// Mock rate limiter
jest.mock('@/services/rateLimiter', () => ({
  checkRateLimit: jest.fn().mockReturnValue(true),
}));

// Mock environment variables
const originalEnv = process.env;

describe('outfitService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env = {
      ...originalEnv,
      EXPO_PUBLIC_GEMINI_API_KEY: 'test-api-key',
    };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('generateOutfit', () => {
    it('should generate outfit successfully with valid inputs', async () => {
      const mockResponse = {
        data: {
          candidates: [
            {
              content: {
                parts: [
                  {
                    text: JSON.stringify({
                      items: mockOutfitItems,
                      reasoning: 'Selected weather-appropriate clothing',
                    }),
                  },
                ],
              },
            },
          ],
        },
      };

      mockAxios.post.mockResolvedValue(mockResponse);

      const result = await generateOutfit(
        mockWeatherData,
        'Paris, France',
        'business'
      );

      expect(result).toBeDefined();
      expect(result.items).toHaveLength(4);
      expect(result.items[0].category).toBe('top');
      expect(mockAxios.post).toHaveBeenCalledTimes(1);
    });

    it('should include weather data in API request', async () => {
      const mockResponse = {
        data: {
          candidates: [
            {
              content: {
                parts: [
                  {
                    text: JSON.stringify({
                      items: mockOutfitItems,
                      reasoning: 'Weather-based selection',
                    }),
                  },
                ],
              },
            },
          ],
        },
      };

      mockAxios.post.mockResolvedValue(mockResponse);

      await generateOutfit(mockWeatherData, 'Tokyo, Japan', 'casual');

      const requestPayload = mockAxios.post.mock.calls[0][1];
      expect(requestPayload).toContain('72°F');
      expect(requestPayload).toContain('Partly cloudy');
      expect(requestPayload).toContain('Tokyo, Japan');
      expect(requestPayload).toContain('casual');
    });

    it('should handle different activity types correctly', async () => {
      const mockResponse = {
        data: {
          candidates: [
            {
              content: {
                parts: [
                  {
                    text: JSON.stringify({
                      items: mockOutfitItems,
                      reasoning: 'Activity-specific clothing selection',
                    }),
                  },
                ],
              },
            },
          ],
        },
      };

      mockAxios.post.mockResolvedValue(mockResponse);

      // Test business activity
      await generateOutfit(mockWeatherData, 'New York, NY', 'business');
      let requestPayload = mockAxios.post.mock.calls[0][1];
      expect(requestPayload).toContain('business');

      // Test outdoor activity
      await generateOutfit(mockWeatherData, 'Denver, CO', 'outdoor');
      requestPayload = mockAxios.post.mock.calls[1][1];
      expect(requestPayload).toContain('outdoor');
    });

    it('should handle API timeout errors', async () => {
      const timeoutError = {
        code: 'ECONNABORTED',
        message: 'timeout exceeded',
      };

      mockAxios.post.mockRejectedValue(timeoutError);

      await expect(
        generateOutfit(mockWeatherData, 'London, UK', 'casual')
      ).rejects.toThrow('Failed to generate outfit: Request timeout');
    });

    it('should handle API rate limit errors', async () => {
      const rateLimitError = {
        response: {
          status: 429,
          data: { error: 'Rate limit exceeded' },
        },
        message: 'Rate limit exceeded',
      };

      mockAxios.post.mockRejectedValue(rateLimitError);

      await expect(
        generateOutfit(mockWeatherData, 'Seattle, WA', 'casual')
      ).rejects.toThrow('Failed to generate outfit: Rate limit exceeded');
    });

    it('should handle invalid JSON responses', async () => {
      const invalidResponse = {
        data: {
          candidates: [
            {
              content: {
                parts: [
                  {
                    text: 'invalid json response',
                  },
                ],
              },
            },
          ],
        },
      };

      mockAxios.post.mockResolvedValue(invalidResponse);

      await expect(
        generateOutfit(mockWeatherData, 'Miami, FL', 'casual')
      ).rejects.toThrow('Failed to parse outfit data');
    });

    it('should handle missing API key', async () => {
      delete process.env.EXPO_PUBLIC_GEMINI_API_KEY;

      await expect(
        generateOutfit(mockWeatherData, 'Chicago, IL', 'casual')
      ).rejects.toThrow('Gemini API key not configured');
    });

    it('should handle empty API response', async () => {
      const emptyResponse = {
        data: {
          candidates: [],
        },
      };

      mockAxios.post.mockResolvedValue(emptyResponse);

      await expect(
        generateOutfit(mockWeatherData, 'Boston, MA', 'casual')
      ).rejects.toThrow('No outfit suggestions received');
    });

    it('should clean and process text response correctly', async () => {
      const responseWithMarkdown = {
        data: {
          candidates: [
            {
              content: {
                parts: [
                  {
                    text: '```json\n' + JSON.stringify({
                      items: mockOutfitItems,
                      reasoning: 'Test reasoning',
                    }) + '\n```',
                  },
                ],
              },
            },
          ],
        },
      };

      mockAxios.post.mockResolvedValue(responseWithMarkdown);

      const result = await generateOutfit(
        mockWeatherData,
        'San Francisco, CA',
        'casual'
      );

      expect(result).toBeDefined();
      expect(result.items).toHaveLength(4);
    });

    it('should validate outfit item structure', async () => {
      const invalidItemsResponse = {
        data: {
          candidates: [
            {
              content: {
                parts: [
                  {
                    text: JSON.stringify({
                      items: [
                        {
                          // Missing required fields
                          name: 'Test Item',
                        },
                      ],
                      reasoning: 'Invalid structure',
                    }),
                  },
                ],
              },
            },
          ],
        },
      };

      mockAxios.post.mockResolvedValue(invalidItemsResponse);

      const result = await generateOutfit(
        mockWeatherData,
        'Portland, OR',
        'casual'
      );

      // Service should handle invalid items gracefully
      expect(result).toBeDefined();
    });

    it('should include request timeout configuration', async () => {
      const mockResponse = {
        data: {
          candidates: [
            {
              content: {
                parts: [
                  {
                    text: JSON.stringify({
                      items: mockOutfitItems,
                      reasoning: 'Test',
                    }),
                  },
                ],
              },
            },
          ],
        },
      };

      mockAxios.post.mockResolvedValue(mockResponse);

      await generateOutfit(mockWeatherData, 'Las Vegas, NV', 'casual');

      const config = mockAxios.post.mock.calls[0][2];
      expect(config?.timeout).toBeDefined();
      expect(config?.timeout).toBeGreaterThan(0);
    });
  });
});