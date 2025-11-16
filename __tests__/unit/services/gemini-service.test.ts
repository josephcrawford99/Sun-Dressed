/**
 * Unit tests for Gemini API Service
 */

import axios from 'axios';
import {
  generateOutfitRecommendation,
  type OutfitGenerationResult,
} from '@/services/gemini-service';
import { parseOutfitJSON } from '@/utils/outfit-parser';
import type { Outfit } from '@/types/outfit';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock parseOutfitJSON
jest.mock('@/utils/outfit-parser');
const mockedParseOutfitJSON = parseOutfitJSON as jest.MockedFunction<typeof parseOutfitJSON>;

describe('gemini-service', () => {
  beforeEach(() => {
    // Clear mocks before each test
    jest.clearAllMocks();
  });

  describe('generateOutfitRecommendation', () => {
    const mockPrompt = 'Generate a casual outfit for 72°F sunny weather';

    const mockOutfit: Outfit = {
      items: [
        {
          name: 'Light Cotton T-Shirt',
          description: 'A breathable cotton t-shirt in a light color',
          blurb: 'Perfect for warm weather, keeps you cool and comfortable',
        },
        {
          name: 'Denim Shorts',
          description: 'Classic blue denim shorts',
          blurb: 'Casual and comfortable for outdoor activities',
        },
      ],
      overallDescription: 'A casual and comfortable outfit perfect for sunny 72°F weather',
      warmCoatRecommended: false,
      rainGearRecommended: false,
    };

    const mockRawText = JSON.stringify(mockOutfit);

    const mockGeminiResponse = {
      data: {
        candidates: [
          {
            content: {
              parts: [
                {
                  text: mockRawText,
                },
              ],
            },
          },
        ],
      },
    };

    describe('API Key Validation', () => {
      it('should throw error when API key is missing', async () => {
        // Arrange
        const originalValue = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
        delete process.env.EXPO_PUBLIC_GEMINI_API_KEY;

        try {
          // Act & Assert
          await expect(generateOutfitRecommendation(mockPrompt)).rejects.toThrow(
            'Gemini API key not configured. Please add EXPO_PUBLIC_GEMINI_API_KEY to .env.local'
          );
        } finally {
          // Restore
          process.env.EXPO_PUBLIC_GEMINI_API_KEY = originalValue;
        }
      });

      it('should throw error when API key is empty string', async () => {
        // Arrange
        const originalValue = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
        process.env.EXPO_PUBLIC_GEMINI_API_KEY = '';

        try {
          // Act & Assert
          await expect(generateOutfitRecommendation(mockPrompt)).rejects.toThrow(
            'Gemini API key not configured. Please add EXPO_PUBLIC_GEMINI_API_KEY to .env.local'
          );
        } finally {
          // Restore
          process.env.EXPO_PUBLIC_GEMINI_API_KEY = originalValue;
        }
      });
    });

    describe('Successful API Calls', () => {
      const originalValue = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

      beforeEach(() => {
        process.env.EXPO_PUBLIC_GEMINI_API_KEY = 'test-gemini-api-key-12345';
        mockedAxios.post.mockResolvedValue(mockGeminiResponse);
        mockedParseOutfitJSON.mockReturnValue(mockOutfit);
      });

      afterEach(() => {
        process.env.EXPO_PUBLIC_GEMINI_API_KEY = originalValue;
      });

      it('should generate outfit recommendation successfully', async () => {
        // Act
        const result: OutfitGenerationResult = await generateOutfitRecommendation(mockPrompt);

        // Assert
        expect(result.recommendation).toEqual(mockOutfit);
        expect(result.rawText).toBe(mockRawText);
        expect(mockedAxios.post).toHaveBeenCalledTimes(1);
      });

      it('should call Gemini API with correct endpoint', async () => {
        // Act
        await generateOutfitRecommendation(mockPrompt);

        // Assert
        expect(mockedAxios.post).toHaveBeenCalledWith(
          'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
          expect.any(Object),
          expect.any(Object)
        );
      });

      it('should send correct request body structure', async () => {
        // Act
        await generateOutfitRecommendation(mockPrompt);

        // Assert
        const requestBody = mockedAxios.post.mock.calls[0][1];
        expect(requestBody).toEqual({
          contents: [
            {
              parts: [
                {
                  text: mockPrompt,
                },
              ],
            },
          ],
        });
      });

      it('should send correct headers with API key', async () => {
        // Act
        await generateOutfitRecommendation(mockPrompt);

        // Assert
        const config = mockedAxios.post.mock.calls[0][2];
        expect(config.headers).toEqual({
          'x-goog-api-key': 'test-gemini-api-key-12345',
          'Content-Type': 'application/json',
        });
      });

      it('should call parseOutfitJSON with raw text', async () => {
        // Act
        await generateOutfitRecommendation(mockPrompt);

        // Assert
        expect(mockedParseOutfitJSON).toHaveBeenCalledTimes(1);
        expect(mockedParseOutfitJSON).toHaveBeenCalledWith(mockRawText);
      });

      it('should handle different prompts correctly', async () => {
        // Arrange
        const prompts = [
          'Generate formal outfit for 45°F rainy weather',
          'Create athletic wear for 85°F sunny conditions',
          'Suggest business casual for 68°F cloudy day',
        ];

        // Act & Assert
        for (const prompt of prompts) {
          await generateOutfitRecommendation(prompt);
          const requestBody = mockedAxios.post.mock.calls[mockedAxios.post.mock.calls.length - 1][1];
          expect(requestBody.contents[0].parts[0].text).toBe(prompt);
        }
      });

      it('should return OutfitGenerationResult with correct structure', async () => {
        // Act
        const result = await generateOutfitRecommendation(mockPrompt);

        // Assert
        expect(result).toHaveProperty('recommendation');
        expect(result).toHaveProperty('rawText');
        expect(typeof result.rawText).toBe('string');
        expect(result.recommendation).toHaveProperty('items');
        expect(result.recommendation).toHaveProperty('overallDescription');
        expect(result.recommendation).toHaveProperty('warmCoatRecommended');
        expect(result.recommendation).toHaveProperty('rainGearRecommended');
      });
    });

    describe('Response Validation', () => {
      const originalValue = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

      beforeEach(() => {
        process.env.EXPO_PUBLIC_GEMINI_API_KEY = 'test-gemini-api-key-12345';
      });

      afterEach(() => {
        process.env.EXPO_PUBLIC_GEMINI_API_KEY = originalValue;
      });

      it('should throw error when response has no candidates', async () => {
        // Arrange
        mockedAxios.post.mockResolvedValue({
          data: {
            candidates: [],
          },
        });

        // Act & Assert
        await expect(generateOutfitRecommendation(mockPrompt)).rejects.toThrow(
          'No response generated from Gemini API'
        );
      });

      it('should throw error when candidates array is missing', async () => {
        // Arrange
        mockedAxios.post.mockResolvedValue({
          data: {},
        });

        // Act & Assert
        await expect(generateOutfitRecommendation(mockPrompt)).rejects.toThrow(
          'No response generated from Gemini API'
        );
      });

      it('should throw error when candidates is null', async () => {
        // Arrange
        mockedAxios.post.mockResolvedValue({
          data: {
            candidates: null,
          },
        });

        // Act & Assert
        await expect(generateOutfitRecommendation(mockPrompt)).rejects.toThrow(
          'No response generated from Gemini API'
        );
      });

      it('should throw error when rawText is missing from response', async () => {
        // Arrange
        mockedAxios.post.mockResolvedValue({
          data: {
            candidates: [
              {
                content: {
                  parts: [{}],
                },
              },
            ],
          },
        });

        // Act & Assert
        await expect(generateOutfitRecommendation(mockPrompt)).rejects.toThrow(
          'Invalid response format from Gemini API'
        );
      });

      it('should throw error when parts array is empty', async () => {
        // Arrange
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
        await expect(generateOutfitRecommendation(mockPrompt)).rejects.toThrow(
          'Invalid response format from Gemini API'
        );
      });

      it('should throw error when content is missing', async () => {
        // Arrange
        mockedAxios.post.mockResolvedValue({
          data: {
            candidates: [{}],
          },
        });

        // Act & Assert
        await expect(generateOutfitRecommendation(mockPrompt)).rejects.toThrow(
          'Invalid response format from Gemini API'
        );
      });

      it('should throw error when parts is missing', async () => {
        // Arrange
        mockedAxios.post.mockResolvedValue({
          data: {
            candidates: [
              {
                content: {},
              },
            ],
          },
        });

        // Act & Assert
        // When parts is undefined, accessing parts[0] will throw TypeError
        await expect(generateOutfitRecommendation(mockPrompt)).rejects.toThrow();
      });

      it('should throw error when text is null', async () => {
        // Arrange
        mockedAxios.post.mockResolvedValue({
          data: {
            candidates: [
              {
                content: {
                  parts: [
                    {
                      text: null,
                    },
                  ],
                },
              },
            ],
          },
        });

        // Act & Assert
        await expect(generateOutfitRecommendation(mockPrompt)).rejects.toThrow(
          'Invalid response format from Gemini API'
        );
      });

      it('should throw error when text is undefined', async () => {
        // Arrange
        mockedAxios.post.mockResolvedValue({
          data: {
            candidates: [
              {
                content: {
                  parts: [
                    {
                      text: undefined,
                    },
                  ],
                },
              },
            ],
          },
        });

        // Act & Assert
        await expect(generateOutfitRecommendation(mockPrompt)).rejects.toThrow(
          'Invalid response format from Gemini API'
        );
      });
    });

    describe('Error Handling', () => {
      const originalValue = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

      beforeEach(() => {
        process.env.EXPO_PUBLIC_GEMINI_API_KEY = 'test-gemini-api-key-12345';
      });

      afterEach(() => {
        process.env.EXPO_PUBLIC_GEMINI_API_KEY = originalValue;
      });

      it('should throw error when network request fails', async () => {
        // Arrange
        const networkError = new Error('Network Error');
        mockedAxios.post.mockRejectedValue(networkError);

        // Act & Assert
        await expect(generateOutfitRecommendation(mockPrompt)).rejects.toThrow('Network Error');
      });

      it('should throw error when API returns 401 Unauthorized', async () => {
        // Arrange
        const apiError = Object.assign(new Error('Request failed with status code 401'), {
          response: {
            status: 401,
            data: { error: { message: 'API key not valid' } },
          },
        });
        mockedAxios.post.mockRejectedValue(apiError);

        // Act & Assert
        await expect(generateOutfitRecommendation(mockPrompt)).rejects.toThrow();
      });

      it('should throw error when API returns 403 Forbidden', async () => {
        // Arrange
        const apiError = Object.assign(new Error('Request failed with status code 403'), {
          response: {
            status: 403,
            data: { error: { message: 'API key forbidden' } },
          },
        });
        mockedAxios.post.mockRejectedValue(apiError);

        // Act & Assert
        await expect(generateOutfitRecommendation(mockPrompt)).rejects.toThrow();
      });

      it('should throw error when API returns 429 Too Many Requests', async () => {
        // Arrange
        const apiError = Object.assign(new Error('Request failed with status code 429'), {
          response: {
            status: 429,
            data: { error: { message: 'Rate limit exceeded' } },
          },
        });
        mockedAxios.post.mockRejectedValue(apiError);

        // Act & Assert
        await expect(generateOutfitRecommendation(mockPrompt)).rejects.toThrow();
      });

      it('should throw error when API returns 500 Internal Server Error', async () => {
        // Arrange
        const apiError = Object.assign(new Error('Request failed with status code 500'), {
          response: {
            status: 500,
            data: { error: { message: 'Internal server error' } },
          },
        });
        mockedAxios.post.mockRejectedValue(apiError);

        // Act & Assert
        await expect(generateOutfitRecommendation(mockPrompt)).rejects.toThrow();
      });

      it('should throw error when request times out', async () => {
        // Arrange
        const timeoutError = new Error('timeout of 30000ms exceeded');
        timeoutError.name = 'ECONNABORTED';
        mockedAxios.post.mockRejectedValue(timeoutError);

        // Act & Assert
        await expect(generateOutfitRecommendation(mockPrompt)).rejects.toThrow('timeout of 30000ms exceeded');
      });

      it('should throw error when parseOutfitJSON fails', async () => {
        // Arrange
        mockedAxios.post.mockResolvedValue(mockGeminiResponse);
        const parseError = new Error('Failed to parse JSON: Unexpected token');
        mockedParseOutfitJSON.mockImplementation(() => {
          throw parseError;
        });

        // Act & Assert
        await expect(generateOutfitRecommendation(mockPrompt)).rejects.toThrow('Failed to parse JSON: Unexpected token');
      });

      it('should throw error when parseOutfitJSON throws validation error', async () => {
        // Arrange
        mockedAxios.post.mockResolvedValue(mockGeminiResponse);
        const validationError = new Error('Missing or invalid "items" array in response');
        mockedParseOutfitJSON.mockImplementation(() => {
          throw validationError;
        });

        // Act & Assert
        await expect(generateOutfitRecommendation(mockPrompt)).rejects.toThrow(
          'Missing or invalid "items" array in response'
        );
      });
    });

    describe('Edge Cases', () => {
      const originalValue = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

      beforeEach(() => {
        process.env.EXPO_PUBLIC_GEMINI_API_KEY = 'test-gemini-api-key-12345';
        mockedAxios.post.mockResolvedValue(mockGeminiResponse);
        mockedParseOutfitJSON.mockReturnValue(mockOutfit);
      });

      afterEach(() => {
        process.env.EXPO_PUBLIC_GEMINI_API_KEY = originalValue;
      });

      it('should handle empty prompt string', async () => {
        // Act
        await generateOutfitRecommendation('');

        // Assert
        expect(mockedAxios.post).toHaveBeenCalled();
        const requestBody = mockedAxios.post.mock.calls[0][1];
        expect(requestBody.contents[0].parts[0].text).toBe('');
      });

      it('should handle very long prompt', async () => {
        // Arrange
        const longPrompt = 'Generate outfit for weather '.repeat(100);

        // Act
        await generateOutfitRecommendation(longPrompt);

        // Assert
        const requestBody = mockedAxios.post.mock.calls[0][1];
        expect(requestBody.contents[0].parts[0].text).toBe(longPrompt);
      });

      it('should handle prompt with special characters', async () => {
        // Arrange
        const specialPrompt = 'Generate outfit for 72°F with 50% humidity & "sunny" conditions';

        // Act
        await generateOutfitRecommendation(specialPrompt);

        // Assert
        const requestBody = mockedAxios.post.mock.calls[0][1];
        expect(requestBody.contents[0].parts[0].text).toBe(specialPrompt);
      });

      it('should handle prompt with newlines', async () => {
        // Arrange
        const multilinePrompt = `Generate outfit for:
Temperature: 72°F
Conditions: Sunny
Style: Casual`;

        // Act
        await generateOutfitRecommendation(multilinePrompt);

        // Assert
        const requestBody = mockedAxios.post.mock.calls[0][1];
        expect(requestBody.contents[0].parts[0].text).toBe(multilinePrompt);
      });

      it('should handle response with markdown code blocks', async () => {
        // Arrange
        const markdownResponse = {
          data: {
            candidates: [
              {
                content: {
                  parts: [
                    {
                      text: '```json\n' + mockRawText + '\n```',
                    },
                  ],
                },
              },
            ],
          },
        };
        mockedAxios.post.mockResolvedValue(markdownResponse);

        // Act
        const result = await generateOutfitRecommendation(mockPrompt);

        // Assert
        expect(result.rawText).toBe('```json\n' + mockRawText + '\n```');
        expect(mockedParseOutfitJSON).toHaveBeenCalledWith('```json\n' + mockRawText + '\n```');
      });

      it('should handle outfit with no items', async () => {
        // Arrange
        const emptyOutfit: Outfit = {
          items: [],
          overallDescription: 'No outfit needed',
          warmCoatRecommended: false,
          rainGearRecommended: false,
        };
        mockedParseOutfitJSON.mockReturnValue(emptyOutfit);

        // Act
        const result = await generateOutfitRecommendation(mockPrompt);

        // Assert
        expect(result.recommendation.items).toEqual([]);
      });

      it('should handle outfit with many items', async () => {
        // Arrange
        const manyItemsOutfit: Outfit = {
          items: Array(10).fill({
            name: 'Item',
            description: 'Description',
            blurb: 'Blurb',
          }),
          overallDescription: 'Complex layered outfit',
          warmCoatRecommended: true,
          rainGearRecommended: true,
        };
        mockedParseOutfitJSON.mockReturnValue(manyItemsOutfit);

        // Act
        const result = await generateOutfitRecommendation(mockPrompt);

        // Assert
        expect(result.recommendation.items.length).toBe(10);
      });

      it('should handle outfit with warm coat recommended', async () => {
        // Arrange
        const winterOutfit: Outfit = {
          ...mockOutfit,
          warmCoatRecommended: true,
        };
        mockedParseOutfitJSON.mockReturnValue(winterOutfit);

        // Act
        const result = await generateOutfitRecommendation(mockPrompt);

        // Assert
        expect(result.recommendation.warmCoatRecommended).toBe(true);
      });

      it('should handle outfit with rain gear recommended', async () => {
        // Arrange
        const rainyOutfit: Outfit = {
          ...mockOutfit,
          rainGearRecommended: true,
        };
        mockedParseOutfitJSON.mockReturnValue(rainyOutfit);

        // Act
        const result = await generateOutfitRecommendation(mockPrompt);

        // Assert
        expect(result.recommendation.rainGearRecommended).toBe(true);
      });
    });

    describe('API Integration', () => {
      const originalValue = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

      beforeEach(() => {
        process.env.EXPO_PUBLIC_GEMINI_API_KEY = 'test-gemini-api-key-12345';
        mockedAxios.post.mockResolvedValue(mockGeminiResponse);
        mockedParseOutfitJSON.mockReturnValue(mockOutfit);
      });

      afterEach(() => {
        process.env.EXPO_PUBLIC_GEMINI_API_KEY = originalValue;
      });

      it('should use Gemini 2.5 Flash model', async () => {
        // Act
        await generateOutfitRecommendation(mockPrompt);

        // Assert
        const url = mockedAxios.post.mock.calls[0][0];
        expect(url).toContain('gemini-2.5-flash');
      });

      it('should use v1beta API version', async () => {
        // Act
        await generateOutfitRecommendation(mockPrompt);

        // Assert
        const url = mockedAxios.post.mock.calls[0][0];
        expect(url).toContain('/v1beta/');
      });

      it('should use generateContent endpoint', async () => {
        // Act
        await generateOutfitRecommendation(mockPrompt);

        // Assert
        const url = mockedAxios.post.mock.calls[0][0];
        expect(url).toContain(':generateContent');
      });

      it('should not call API when API key is missing', async () => {
        // Arrange
        delete process.env.EXPO_PUBLIC_GEMINI_API_KEY;

        // Act & Assert
        await expect(generateOutfitRecommendation(mockPrompt)).rejects.toThrow();
        expect(mockedAxios.post).not.toHaveBeenCalled();
      });
    });
  });
});
