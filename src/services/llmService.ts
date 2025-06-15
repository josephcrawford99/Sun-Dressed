import axios from 'axios';
import { Outfit } from '../types/Outfit';
import { Weather } from '../types/weather';
import { StylePreference } from '../types/settings';
import { geminiRateLimiter } from './rateLimiter';
import { APIOptimizer } from './utils/APIOptimizer';

// Initialize API optimizer
const apiOptimizer = new APIOptimizer();

// Simple in-memory cache for recent prompts
const promptCache = new Map<string, { outfit: Outfit; timestamp: number }>();
const CACHE_DURATION = 300000; // 5 minutes

export const generateOutfitLLM = async (weather?: Weather, activity?: string, stylePreference?: StylePreference): Promise<Outfit> => {
  
  // Generate cache key from inputs
  const cacheKey = generateCacheKey(weather, activity, stylePreference);
  
  // Check prompt cache first
  const cached = promptCache.get(cacheKey);
  if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
    return cached.outfit;
  }
  
  // Use API optimizer to coalesce concurrent identical requests
  return apiOptimizer.coalesceRequest(cacheKey, async () => {
    await geminiRateLimiter.checkRateLimit();
  
  const weatherDescription = weather 
    ? `${weather.condition} weather with high of ${weather.dailyHighTemp}°F, low of ${weather.dailyLowTemp}°F, feels like ${weather.feelsLikeTemp}°F, ${weather.highestChanceOfRain}% chance of rain, wind at ${weather.windiness}mph, ${weather.sunniness}% sunny`
    : 'any weather';
  
  const styleInstruction = stylePreference && stylePreference !== 'neutral'
    ? ` Focus on ${stylePreference} style clothing options.`
    : '';
  
  const prompt = `Generate a clothing outfit recommendation for ${weatherDescription} and ${activity || 'daily activities'}.${styleInstruction} Return only a JSON object with: top, bottom, outerwear (array), accessories (array), shoes, explanation (brief 1-2 sentence reason for this outfit choice based on weather/activity).`;
  
  const requestPayload = {
    contents: [{ parts: [{ text: prompt }] }]
  };

  try {
    const response = await axios.post(
      `${process.env.EXPO_PUBLIC_GEMINI_API_URL}?key=${process.env.EXPO_PUBLIC_GEMINI_API_KEY}`,
      requestPayload,
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000 // 10 second timeout
      }
    );
    
    if (!response.data.candidates || !response.data.candidates[0]) {
      throw new Error('No candidates in API response');
    }
    
    const rawText = response.data.candidates[0].content.parts[0].text;
    
    // Clean the text before parsing - remove markdown code blocks if present
    const cleanedText = rawText.replace(/```json\s*|\s*```/g, '').trim();
    
    try {
      const parsedOutfit = JSON.parse(cleanedText);
      
      // Cache the result
      promptCache.set(cacheKey, { outfit: parsedOutfit, timestamp: Date.now() });
      
      // Clean old cache entries
      cleanPromptCache();
      
      return parsedOutfit;
    } catch (parseError) {
      // JSON parsing failed
      // Failed to parse text
      throw new Error(`Failed to parse outfit JSON: ${parseError}`);
    }
  } catch (error) {
    // Error in outfit generation
    if (axios.isAxiosError(error) && error.response) {
      // Error response data available
      // Error response status available
    }
    throw error;
  }
  });
};

/**
 * Generate consistent cache key from inputs
 */
function generateCacheKey(weather?: Weather, activity?: string, stylePreference?: StylePreference): string {
  const weatherKey = weather 
    ? `${Math.round(weather.feelsLikeTemp)}_${weather.condition}_${weather.highestChanceOfRain}_${weather.windiness}`
    : 'no-weather';
  const activityKey = (activity || 'daily-activities').toLowerCase().replace(/\s+/g, '-');
  const styleKey = stylePreference || 'neutral';
  
  return `outfit_${weatherKey}_${activityKey}_${styleKey}`;
}

/**
 * Clean old entries from prompt cache
 */
function cleanPromptCache(): void {
  const now = Date.now();
  for (const [key, value] of promptCache.entries()) {
    if (now - value.timestamp > CACHE_DURATION) {
      promptCache.delete(key);
    }
  }
}

export const generatePackingListLLM = async (
  location: string, 
  startDate: Date, 
  endDate: Date, 
  weatherData?: Weather[],
  stylePreference?: StylePreference
): Promise<string[]> => {
  await geminiRateLimiter.checkRateLimit();
  
  const tripDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const weatherDescription = weatherData && weatherData.length > 0
    ? `Weather forecast: ${weatherData.map(w => `${w.condition}, high ${w.dailyHighTemp}°F, low ${w.dailyLowTemp}°F`).join('; ')}`
    : 'no specific weather data available';
  
  const styleInstruction = stylePreference && stylePreference !== 'neutral'
    ? ` Focus on ${stylePreference} style clothing options.`
    : '';
  
  const prompt = `Generate a packing list for a ${tripDays}-day trip to ${location} from ${startDate.toDateString()} to ${endDate.toDateString()}. ${weatherDescription}.${styleInstruction} Return only a JSON array of clothing items needed, like ["item1", "item2", "item3"].`;
  
  const requestPayload = {
    contents: [{ parts: [{ text: prompt }] }]
  };

  try {
    const response = await axios.post(
      `${process.env.EXPO_PUBLIC_GEMINI_API_URL}?key=${process.env.EXPO_PUBLIC_GEMINI_API_KEY}`,
      requestPayload,
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000
      }
    );
    
    if (!response.data.candidates || !response.data.candidates[0]) {
      throw new Error('No candidates in API response');
    }
    
    const rawText = response.data.candidates[0].content.parts[0].text;
    
    const cleanedText = rawText.replace(/```json\s*|\s*```/g, '').trim();
    
    try {
      const parsedList = JSON.parse(cleanedText);
      return Array.isArray(parsedList) ? parsedList : [];
    } catch (parseError) {
      // JSON parsing failed
      throw new Error(`Failed to parse packing list JSON: ${parseError}`);
    }
  } catch (error) {
    // Error in packing list generation
    throw error;
  }
};