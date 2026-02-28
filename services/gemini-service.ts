/**
 * Gemini API Service
 * Handles communication with Google Gemini API
 * Uses official @google/genai SDK
 */

import { Outfit } from '@/types/outfit';
import { TripPlan } from '@/types/trip';
import { parseOutfitJSON } from '@/utils/outfit-parser';
import { parseTripPlanJSON } from '@/utils/trip-parser';
import { GoogleGenAI } from '@google/genai';

/**
 * Default model name for Gemini API
 */
export const DEFAULT_MODEL = 'gemini-2.5-flash-lite';

/**
 * Configuration options for Gemini API calls
 */
export interface GeminiConfig {
  /** Model to use (default: gemini-2.5-flash) */
  model?: string;
  /** Thinking budget - controls internal reasoning (0 to disable, higher for more thinking) */
  thinkingBudget?: number;
  /** Temperature - controls randomness/creativity (0.0-1.0, lower = more deterministic) */
  temperature?: number;
  /** System instruction to guide model behavior globally */
  systemInstruction?: string;
}

/**
 * Centralized error handler for Gemini API calls
 * Converts SDK errors into user-friendly error messages
 *
 * @param error - The error caught from SDK request
 * @throws Error with user-friendly message
 */
function handleGeminiApiError(error: unknown): never {
  // Check for common error patterns
  if (error instanceof Error) {
    const message = error.message.toLowerCase();

    if (message.includes('api key') || message.includes('authentication') || message.includes('401') || message.includes('403')) {
      throw new Error('API key authentication failed. Please check configuration.');
    }
    if (message.includes('429') || message.includes('rate limit') || message.includes('quota')) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }
    if (message.includes('503') || message.includes('service unavailable')) {
      throw new Error('Service unavailable (503). The Gemini API is temporarily down.');
    }
    if (message.includes('network') || message.includes('enotfound') || message.includes('econnrefused')) {
      throw new Error('Network error: Unable to reach Gemini API. Check your connection.');
    }
  }
  throw error;
}

/**
 * Sends a prompt to the Gemini API and returns the raw text response.
 */
async function callGemini(prompt: string, config?: GeminiConfig): Promise<string> {
  const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Gemini API key not configured. Please add EXPO_PUBLIC_GEMINI_API_KEY to .env.local');
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const modelName = config?.model ?? DEFAULT_MODEL;
    const sdkConfig: any = {
      model: modelName,
      contents: prompt,
    };

    const configOptions: any = {};

    if (config?.thinkingBudget !== undefined) {
      configOptions.thinkingConfig = { thinkingBudget: config.thinkingBudget };
    }
    if (config?.temperature !== undefined) {
      configOptions.temperature = config.temperature;
    }
    if (config?.systemInstruction) {
      configOptions.systemInstruction = config.systemInstruction;
    }
    if (Object.keys(configOptions).length > 0) {
      sdkConfig.config = configOptions;
    }

    const response = await ai.models.generateContent(sdkConfig);
    const rawText = response.text;
    if (!rawText) {
      throw new Error('No response generated from Gemini API');
    }
    return rawText;
  } catch (error) {
    handleGeminiApiError(error);
  }
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
 * Generates outfit recommendation using Google Gemini API
 */
export async function generateOutfitRecommendation(
  prompt: string,
  config?: GeminiConfig,
): Promise<OutfitGenerationResult> {
  const rawText = await callGemini(prompt, config);
  return { recommendation: parseOutfitJSON(rawText), rawText };
}

/**
 * Generates a trip packing plan using Google Gemini API
 */
export async function generateTripPlan(
  prompt: string,
  config?: GeminiConfig,
): Promise<TripPlan> {
  const rawText = await callGemini(prompt, config);
  return parseTripPlanJSON(rawText);
}
