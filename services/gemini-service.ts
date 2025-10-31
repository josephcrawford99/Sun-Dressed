/**
 * Gemini API Service
 * Handles communication with Google Gemini 2.5 Flash API for outfit recommendations
 */

import { Outfit } from '@/types/outfit';
import { parseOutfitJSON } from '@/utils/outfit-parser';

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
 * Maximum number of retry attempts for parsing invalid JSON responses
 */
const MAX_RETRIES = 3;

/**
 * Internal helper to make a raw API call to Gemini
 *
 * @param prompt - The prompt to send to the API
 * @returns Promise resolving to the raw text response
 * @throws Error if API key is missing, request fails, or response is invalid
 */
async function callGeminiAPI(prompt: string): Promise<string> {
  // Get API key from environment
  const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Gemini API key not configured. Please add EXPO_PUBLIC_GEMINI_API_KEY to .env.local');
  }

  // Prepare request
  const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';
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

  // Make API request
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'x-goog-api-key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  // Check for HTTP errors
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error: ${response.status} ${response.statusText}. ${errorText}`);
  }

  // Parse response
  const data: GeminiResponse = await response.json();

  // Extract generated text
  if (!data.candidates || data.candidates.length === 0) {
    throw new Error('No response generated from Gemini API');
  }

  const generatedText = data.candidates[0]?.content?.parts[0]?.text;
  if (!generatedText) {
    throw new Error('Invalid response format from Gemini API');
  }

  return generatedText;
}

/**
 * Generates outfit recommendation using Google Gemini 2.5 Flash API with retry logic
 *
 * Attempts to parse the response as JSON. If parsing fails, retries up to 3 times
 * with an enhanced prompt requesting valid JSON format.
 *
 * @param prompt - The structured prompt to send to the API
 * @returns Promise resolving to OutfitGenerationResult with both structured and raw data
 * @throws Error if API key is missing, request fails, or JSON parsing fails after max retries
 */
export async function generateOutfitRecommendation(prompt: string): Promise<OutfitGenerationResult> {
  let currentPrompt = prompt;
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      // Call the API
      const rawText = await callGeminiAPI(currentPrompt);

      // Try to parse the response
      const recommendation = parseOutfitJSON(rawText);

      // Success! Return both the structured data and raw text
      return {
        recommendation,
        rawText,
      };
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown parsing error');

      // If this isn't the last attempt, modify the prompt and retry
      if (attempt < MAX_RETRIES) {
        currentPrompt = `IMPORTANT: Your previous response was not valid JSON. Please respond ONLY with valid JSON matching the specified format below. Do not include any markdown formatting, code blocks, or extra text.

${prompt}`;
      }
    }
  }

  // All retries failed
  throw new Error(
    `Failed to generate valid outfit recommendation after ${MAX_RETRIES} attempts. Last error: ${lastError?.message}`,
  );
}
