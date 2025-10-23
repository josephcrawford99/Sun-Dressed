/**
 * Gemini API Service
 * Handles communication with Google Gemini 2.5 Flash API for outfit recommendations
 */

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
 * Generates outfit recommendation using Google Gemini 2.5 Flash API
 *
 * @param prompt - The structured prompt to send to the API
 * @returns Promise resolving to the generated outfit recommendation text
 * @throws Error if API key is missing, request fails, or response is invalid
 */
export async function generateOutfitRecommendation(prompt: string): Promise<string> {
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

  try {
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
  } catch (error) {
    // Re-throw with more context
    if (error instanceof Error) {
      throw new Error(`Failed to generate outfit recommendation: ${error.message}`);
    }
    throw new Error('Failed to generate outfit recommendation: Unknown error');
  }
}
