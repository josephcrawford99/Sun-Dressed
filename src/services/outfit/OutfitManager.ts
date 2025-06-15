import { Outfit } from '@/types/Outfit';
import { Weather } from '@/types/weather';
import { OutfitStorageService } from '@services/outfitStorageService';
import { generateOutfitLLM } from '@services/llmService';
import { SettingsService } from '@services/settingsService';
import { CacheService } from './CacheService';
import { ChangeDetectionEngine } from './ChangeDetectionEngine';
import { DateOffset } from '@/components/CalendarBar';

export interface OutfitContext {
  date: Date;
  weather: Weather | null;
  activity: string;
  location?: string;
  dateOffset: DateOffset;
}

export interface OutfitResult {
  outfit: Outfit | null;
  source: 'memory-cache' | 'storage' | 'api' | 'none';
  stats: {
    hits: number;
    misses: number;
    apiCalls: number;
  };
}

/**
 * Central orchestrator for outfit generation and management.
 * Handles caching, storage, change detection, and API calls.
 */
export class OutfitManager {
  private cacheService: CacheService;
  private changeDetector: ChangeDetectionEngine;
  private stats = { hits: 0, misses: 0, apiCalls: 0 };
  
  constructor() {
    this.cacheService = new CacheService();
    this.changeDetector = new ChangeDetectionEngine();
  }
  
  /**
   * Get outfit for given context with smart caching and change detection
   */
  async getOutfit(context: OutfitContext): Promise<OutfitResult> {
    console.log('🎯 OutfitManager: Getting outfit for context:', {
      date: context.date.toDateString(),
      activity: context.activity,
      location: context.location,
      hasWeather: !!context.weather
    });
    
    // Check if this is a past date
    const isPastDate = this.isPastDate(context.date);
    
    if (isPastDate) {
      return this.handlePastDate(context);
    }
    
    // For current/future dates, check weather availability
    if (!context.weather) {
      console.log('⚠️ No weather data available');
      return { outfit: null, source: 'none', stats: this.stats };
    }
    
    // Try memory cache first
    const memoryCached = await this.cacheService.getFromMemory(context);
    if (memoryCached) {
      console.log('💾 Memory cache hit!');
      this.stats.hits++;
      return { outfit: memoryCached, source: 'memory-cache', stats: this.stats };
    }
    
    // Try storage with change detection
    const storedData = await OutfitStorageService.getOutfitByDate(context.date);
    if (storedData) {
      const shouldRegenerate = this.changeDetector.shouldRegenerate(
        storedData,
        context
      );
      
      if (!shouldRegenerate) {
        console.log('📦 Storage hit with valid context!');
        this.stats.hits++;
        // Add to memory cache for faster future access
        await this.cacheService.addToMemory(context, storedData.outfit);
        return { outfit: storedData.outfit, source: 'storage', stats: this.stats };
      }
      
      console.log('🔄 Context changed, regenerating...');
    }
    
    // Generate new outfit
    return this.generateNewOutfit(context);
  }
  
  /**
   * Force regenerate outfit regardless of cache
   */
  async forceRegenerate(context: OutfitContext): Promise<OutfitResult> {
    console.log('🔄 Force regenerating outfit...');
    
    if (!context.weather) {
      throw new Error('Weather data required for outfit generation');
    }
    
    // Clear caches for this context
    await this.cacheService.invalidate(context);
    
    return this.generateNewOutfit(context);
  }
  
  /**
   * Handle past dates - only load from storage, no generation
   */
  private async handlePastDate(context: OutfitContext): Promise<OutfitResult> {
    console.log('📅 Handling past date:', context.date.toDateString());
    
    const storedData = await OutfitStorageService.getOutfitByDate(context.date);
    if (storedData) {
      this.stats.hits++;
      return { outfit: storedData.outfit, source: 'storage', stats: this.stats };
    }
    
    console.log('📭 No stored outfit for past date');
    this.stats.misses++;
    return { outfit: null, source: 'none', stats: this.stats };
  }
  
  /**
   * Generate new outfit via LLM
   */
  private async generateNewOutfit(context: OutfitContext): Promise<OutfitResult> {
    if (!context.weather) {
      throw new Error('Weather required for outfit generation');
    }
    
    try {
      console.log('🤖 Generating new outfit via LLM...');
      this.stats.misses++;
      this.stats.apiCalls++;
      
      // Get user preferences
      const settings = await SettingsService.loadSettings();
      
      // Generate outfit
      const outfit = await generateOutfitLLM(
        context.weather,
        context.activity,
        settings.stylePreference
      );
      
      // Store for future use
      const weatherWithLocation = { 
        ...context.weather, 
        location: context.location || context.weather.location 
      };
      await OutfitStorageService.saveOutfit(
        outfit,
        weatherWithLocation,
        context.date,
        context.activity
      );
      
      // Add to memory cache
      await this.cacheService.addToMemory(context, outfit);
      
      console.log('✅ New outfit generated and cached');
      return { outfit, source: 'api', stats: this.stats };
      
    } catch (error) {
      console.error('❌ Failed to generate outfit:', error);
      throw error;
    }
  }
  
  /**
   * Check if date is in the past
   */
  private isPastDate(date: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    return targetDate < today;
  }
  
  /**
   * Cleanup resources
   */
  cleanup(): void {
    this.cacheService.cleanup();
  }
  
  /**
   * Prefetch outfit for likely scenarios
   */
  async prefetchTomorrow(context: Omit<OutfitContext, 'date' | 'dateOffset'>): Promise<void> {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const tomorrowContext: OutfitContext = {
      ...context,
      date: tomorrow,
      dateOffset: 1
    };
    
    console.log('🔮 Prefetching tomorrow\'s outfit...');
    
    // Run in background, don't await
    this.getOutfit(tomorrowContext).catch(err => {
      console.error('Failed to prefetch tomorrow\'s outfit:', err);
    });
  }
  
  /**
   * Get current statistics
   */
  getStats(): { hits: number; misses: number; apiCalls: number } {
    return { ...this.stats };
  }
}