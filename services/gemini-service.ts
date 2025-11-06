/**
 * Gemini API Service
 * Handles communication with Google Gemini 2.5 Flash API for outfit recommendations
 */

import { Outfit } from '@/types/outfit';
import { parseOutfitJSON } from '@/utils/outfit-parser';
import axios from 'axios';
/**
 * Gemini API response structure
 */
interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

/**
 * Result from generating an outfit, includes both structured and raw data
 */
export interface OutfitGenerationResult {
  /** Parsed and structured outfit */
  recommendation: Outfit;
  /** Raw text response from the API for debugging */
  rawText: string;
}

/**
 * Generates outfit recommendation using Google Gemini 2.5 Flash API
 *
 * @param prompt - The structured prompt to send to the API
 * @returns Promise resolving to OutfitGenerationResult with both structured and raw data
 * @throws Error if API key is missing, request fails, or JSON parsing fails
 */
export async function generateOutfitRecommendation(prompt: string): Promise<OutfitGenerationResult> {
  // Get API key from environment
  const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Gemini API key not configured. Please add EXPO_PUBLIC_GEMINI_API_KEY to .env.local');
  }

  // Prepare request body
  const requestBody = {
    contents: [
      {
        parts: [
          {
            text: prompt,
          },
        ],
      },
    ],
  };

  // Make API request using axios
  const response = await axios.post<GeminiResponse>(
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
    requestBody,
    {
      headers: {
        'x-goog-api-key': apiKey,
        'Content-Type': 'application/json',
      },
    }
  );

  // Extract generated text
  const data = response.data;
  if (!data.candidates || data.candidates.length === 0) {
    throw new Error('No response generated from Gemini API');
  }

  const rawText = data.candidates[0]?.content?.parts[0]?.text;
  if (!rawText) {
    throw new Error('Invalid response format from Gemini API');
  }

  // Parse the JSON response
  const recommendation = parseOutfitJSON(rawText);

  return {
    recommendation,
    rawText,
  };
}
