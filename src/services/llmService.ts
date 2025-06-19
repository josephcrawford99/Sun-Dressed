import axios from 'axios';
import { Outfit } from '@/types/Outfit';
import { Weather } from '@/types/weather';
import { StylePreference } from '@/types/settings';
import { geminiRateLimiter } from './rateLimiter';
import { APIOptimizer } from './utils/APIOptimizer';
import { ALL_CLOTHING_ITEMS } from '@/constants/clothingItems';
import { ClothingValidationService } from './clothingValidationService';

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
    return await generateOutfitWithRetry(weather, activity, stylePreference);
  });
};

const generateOutfitWithRetry = async (weather?: Weather, activity?: string, stylePreference?: StylePreference, retryCount = 0, previousError?: string): Promise<Outfit> => {
  const maxRetries = 2;
  
  try {
    return await generateOutfitAttempt(weather, activity, stylePreference, previousError);
  } catch (error) {
    if (error instanceof Error && error.message.startsWith('RETRY_NEEDED:') && retryCount < maxRetries) {
      const validationError = error.message.replace('RETRY_NEEDED: ', '');
      return await generateOutfitWithRetry(weather, activity, stylePreference, retryCount + 1, validationError);
    }
    throw error;
  }
};

const generateOutfitAttempt = async (weather?: Weather, activity?: string, stylePreference?: StylePreference, previousError?: string): Promise<Outfit> => {
    await geminiRateLimiter.checkRateLimit();
  
  const weatherDescription = weather 
    ? `${weather.condition} weather with high of ${weather.dailyHighTemp}°F, low of ${weather.dailyLowTemp}°F, feels like ${weather.feelsLikeTemp}°F, ${weather.highestChanceOfRain}% chance of rain, wind at ${weather.windiness}mph, ${weather.sunniness}% sunny`
    : 'any weather';
  
  const styleInstruction = stylePreference && stylePreference !== 'neutral'
    ? ` Focus on ${stylePreference} style clothing options.`
    : '';

  const clothingItemsList = ALL_CLOTHING_ITEMS.join(', ');
  
  const errorInstruction = previousError 
    ? `\n\nIMPORTANT: Your previous response had validation errors: ${previousError}\nPlease fix these errors and try again.\n`
    : '';
  
  const prompt = `Generate a clothing outfit recommendation for ${weatherDescription} and ${activity || 'daily activities'}.${styleInstruction}${errorInstruction}

IMPORTANT: For clothing items, you must choose ONLY from this list: ${clothingItemsList}

Return only a JSON object with this exact format:
{
  "top": {"iconKey": "t-shirt", "description": "fitted black cotton t-shirt"},
  "bottom": {"iconKey": "jeans", "description": "dark blue denim jeans"},
  "outerwear": [{"iconKey": "jacket", "description": "light windbreaker jacket"}],
  "accessories": [{"iconKey": "sunglasses", "description": "black aviator sunglasses"}],
  "shoes": {"iconKey": "sneakers", "description": "white leather sneakers"},
  "explanation": "brief 1-2 sentence reason for this outfit choice"
}

- iconKey must be exactly from the provided list
- description should be a detailed description of the specific item
- outerwear and accessories are arrays (can be empty [])
- top and shoes are required`;
  
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
      
      // Validate the outfit response
      const validationResult = ClothingValidationService.validateOutfit(parsedOutfit);
      
      if (!validationResult.isValid) {
        // Retry with validation error message
        throw new Error(`VALIDATION_ERROR: ${validationResult.errorMessage}`);
      }
      
      // Cache the result - generate cache key since this is inside the attempt function
      const cacheKey = generateCacheKey(weather, activity, stylePreference);
      promptCache.set(cacheKey, { outfit: parsedOutfit, timestamp: Date.now() });
      
      // Clean old cache entries
      cleanPromptCache();
      
      return parsedOutfit;
    } catch (parseError) {
      // Check if this is a validation error that should trigger retry
      if (parseError instanceof Error && parseError.message.startsWith('VALIDATION_ERROR:')) {
        const errorMessage = parseError.message.replace('VALIDATION_ERROR: ', '');
        throw new Error(`RETRY_NEEDED: ${errorMessage}`);
      }
      
      // JSON parsing failed
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