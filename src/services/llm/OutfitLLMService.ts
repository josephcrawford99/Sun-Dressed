import { LLMApiClient } from './LLMApiClient';
import { Outfit } from '../../types/Outfit';
import { Weather } from '../../types/weather';
import { StylePreference } from '../../types/settings';
import { APIOptimizer } from '../utils/APIOptimizer';
import { DailyFeedbackQueryService } from '../dailyFeedbackQueryService';

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
    const feedbackMetrics = await DailyFeedbackQueryService.getFeedbackMetrics();
    const cacheKey = this.generateCacheKey(weather, activity, stylePreference, feedbackMetrics);
    
    // Check prompt cache first
    const cached = this.promptCache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp) < this.CACHE_DURATION) {
      return cached.outfit;
    }
    
    // Use API optimizer to coalesce concurrent identical requests
    return this.apiOptimizer.coalesceRequest(cacheKey, async () => {
      const prompt = await this.buildOutfitPrompt(weather, activity, stylePreference, feedbackMetrics);
      const rawResponse = await this.llmClient.makeRequest(prompt);
      const outfit = this.llmClient.parseJsonResponse<Outfit>(rawResponse);
      
      // Cache the result
      this.promptCache.set(cacheKey, { outfit, timestamp: Date.now() });
      
      // Clean old cache entries
      this.cleanPromptCache();
      
      return outfit;
    });
  }

  private async buildOutfitPrompt(
    weather?: Weather,
    activity?: string,
    stylePreference?: StylePreference,
    feedbackMetrics?: Awaited<ReturnType<typeof DailyFeedbackQueryService.getFeedbackMetrics>>
  ): Promise<string> {
    const weatherDescription = weather 
      ? `${weather.condition} weather with high of ${weather.dailyHighTemp}°F, low of ${weather.dailyLowTemp}°F, feels like ${weather.feelsLikeTemp}°F, ${weather.highestChanceOfRain}% chance of rain, wind at ${weather.windiness}mph, ${weather.sunniness}% sunny`
      : 'any weather';
    
    const styleInstruction = stylePreference && stylePreference !== 'neutral'
      ? ` Focus on ${stylePreference} style clothing options.`
      : '';
    
    const feedbackContext = await this.buildFeedbackContext(feedbackMetrics);
    
    return `Generate a clothing outfit recommendation for ${weatherDescription} and ${activity || 'daily activities'}.${styleInstruction}${feedbackContext} Return only a JSON object with: top, bottom, outerwear (array), accessories (array), shoes, explanation (brief 1-2 sentence reason for this outfit choice based on weather/activity).`;
  }

  private generateCacheKey(
    weather?: Weather,
    activity?: string,
    stylePreference?: StylePreference,
    feedbackMetrics?: Awaited<ReturnType<typeof DailyFeedbackQueryService.getFeedbackMetrics>>
  ): string {
    const weatherKey = weather 
      ? `${Math.round(weather.feelsLikeTemp)}_${weather.condition}_${weather.highestChanceOfRain}_${weather.windiness}`
      : 'no-weather';
    const activityKey = (activity || 'daily-activities').toLowerCase().replace(/\s+/g, '-');
    const styleKey = stylePreference || 'neutral';
    const feedbackKey = feedbackMetrics 
      ? `${feedbackMetrics.averageRating}_${feedbackMetrics.recentTrend}_${feedbackMetrics.totalRatings}`
      : 'no-feedback';
    
    return `outfit_${weatherKey}_${activityKey}_${styleKey}_${feedbackKey}`;
  }

  /**
   * Build feedback context string for LLM prompts
   */
  private async buildFeedbackContext(
    feedbackMetrics?: Awaited<ReturnType<typeof DailyFeedbackQueryService.getFeedbackMetrics>>
  ): Promise<string> {
    if (!feedbackMetrics || feedbackMetrics.totalRatings === 0) {
      return '';
    }

    let context = ` Based on user feedback history (${feedbackMetrics.totalRatings} ratings, avg: ${feedbackMetrics.averageRating}/10)`;
    
    // Add trend information
    if (feedbackMetrics.recentTrend === 'improving') {
      context += ', recent outfits have been improving';
    } else if (feedbackMetrics.recentTrend === 'declining') {
      context += ', recent outfits need improvement';
    }
    
    // Add guidance based on ratings
    if (feedbackMetrics.averageRating < 5) {
      context += ', focus on more comfortable and weather-appropriate choices';
    } else if (feedbackMetrics.averageRating >= 8) {
      context += ', continue with similar successful outfit patterns';
    }
    
    // Add specific recent feedback if available
    try {
      const recentHistory = await DailyFeedbackQueryService.getFeedbackHistory(3);
      if (recentHistory.length > 0) {
        const lowRatedRecent = recentHistory.filter(h => typeof h.feedback.rating === 'number' && h.feedback.rating <= 4);
        if (lowRatedRecent.length > 0) {
          context += ', avoid similar items to recent low-rated outfits';
        }
      }
    } catch (error) {
      // Silently fail if we can't get recent history
    }
    
    context += '.';
    return context;
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