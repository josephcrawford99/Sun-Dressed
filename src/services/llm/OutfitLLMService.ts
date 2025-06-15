import { LLMApiClient } from './LLMApiClient';
import { Outfit } from '../../types/Outfit';
import { Weather } from '../../types/weather';
import { StylePreference } from '../../types/settings';
import { APIOptimizer } from '../utils/APIOptimizer';

export class OutfitLLMService {
  private llmClient: LLMApiClient;
  private apiOptimizer: APIOptimizer;
  private promptCache: Map<string, { outfit: Outfit; timestamp: number }>;
  private readonly CACHE_DURATION = 300000; // 5 minutes

  constructor() {
    this.llmClient = new LLMApiClient();
    this.apiOptimizer = new APIOptimizer();
    this.promptCache = new Map();
  }

  async generateOutfit(
    weather?: Weather,
    activity?: string,
    stylePreference?: StylePreference
  ): Promise<Outfit> {
    const cacheKey = this.generateCacheKey(weather, activity, stylePreference);
    
    // Check prompt cache first
    const cached = this.promptCache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp) < this.CACHE_DURATION) {
      return cached.outfit;
    }
    
    // Use API optimizer to coalesce concurrent identical requests
    return this.apiOptimizer.coalesceRequest(cacheKey, async () => {
      const prompt = this.buildOutfitPrompt(weather, activity, stylePreference);
      const rawResponse = await this.llmClient.makeRequest(prompt);
      const outfit = this.llmClient.parseJsonResponse<Outfit>(rawResponse);
      
      // Cache the result
      this.promptCache.set(cacheKey, { outfit, timestamp: Date.now() });
      
      // Clean old cache entries
      this.cleanPromptCache();
      
      return outfit;
    });
  }

  private buildOutfitPrompt(
    weather?: Weather,
    activity?: string,
    stylePreference?: StylePreference
  ): string {
    const weatherDescription = weather 
      ? `${weather.condition} weather with high of ${weather.dailyHighTemp}°F, low of ${weather.dailyLowTemp}°F, feels like ${weather.feelsLikeTemp}°F, ${weather.highestChanceOfRain}% chance of rain, wind at ${weather.windiness}mph, ${weather.sunniness}% sunny`
      : 'any weather';
    
    const styleInstruction = stylePreference && stylePreference !== 'neutral'
      ? ` Focus on ${stylePreference} style clothing options.`
      : '';
    
    return `Generate a clothing outfit recommendation for ${weatherDescription} and ${activity || 'daily activities'}.${styleInstruction} Return only a JSON object with: top, bottom, outerwear (array), accessories (array), shoes, explanation (brief 1-2 sentence reason for this outfit choice based on weather/activity).`;
  }

  private generateCacheKey(
    weather?: Weather,
    activity?: string,
    stylePreference?: StylePreference
  ): string {
    const weatherKey = weather 
      ? `${Math.round(weather.feelsLikeTemp)}_${weather.condition}_${weather.highestChanceOfRain}_${weather.windiness}`
      : 'no-weather';
    const activityKey = (activity || 'daily-activities').toLowerCase().replace(/\s+/g, '-');
    const styleKey = stylePreference || 'neutral';
    
    return `outfit_${weatherKey}_${activityKey}_${styleKey}`;
  }

  private cleanPromptCache(): void {
    const now = Date.now();
    for (const [key, value] of this.promptCache.entries()) {
      if (now - value.timestamp > this.CACHE_DURATION) {
        this.promptCache.delete(key);
      }
    }
  }
}