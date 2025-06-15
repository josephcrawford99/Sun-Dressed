import axios, { AxiosInstance } from 'axios';
import { geminiRateLimiter } from '../rateLimiter';

export interface LLMRequestPayload {
  contents: {
    parts: {
      text: string;
    }[];
  }[];
}

export interface LLMResponse {
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
    };
  }[];
}

export class LLMApiClient {
  private axiosInstance: AxiosInstance;
  private apiUrl: string;
  private apiKey: string;

  constructor() {
    this.apiUrl = process.env.EXPO_PUBLIC_GEMINI_API_URL || '';
    this.apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';

    this.axiosInstance = axios.create({
      headers: { 'Content-Type': 'application/json' },
      timeout: 10000, // 10 second timeout
    });
  }

  async makeRequest(prompt: string): Promise<string> {
    await geminiRateLimiter.checkRateLimit();

    const requestPayload: LLMRequestPayload = {
      contents: [{ parts: [{ text: prompt }] }]
    };

    try {
      const response = await this.axiosInstance.post<LLMResponse>(
        `${this.apiUrl}?key=${this.apiKey}`,
        requestPayload
      );

      if (!response.data.candidates || !response.data.candidates[0]) {
        throw new Error('No candidates in API response');
      }

      return response.data.candidates[0].content.parts[0].text;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`LLM API Error: ${error.response?.status || 'Unknown'} - ${error.message}`);
      }
      throw error;
    }
  }

  parseJsonResponse<T>(rawText: string): T {
    // Clean the text before parsing - remove markdown code blocks if present
    const cleanedText = rawText.replace(/```json\s*|\s*```/g, '').trim();
    
    try {
      return JSON.parse(cleanedText);
    } catch (parseError) {
      throw new Error(`Failed to parse LLM JSON response: ${parseError}`);
    }
  }
}