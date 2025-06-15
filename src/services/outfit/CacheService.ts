import { Outfit } from '@/types/Outfit';
import { OutfitContext } from './OutfitManager';

interface CacheEntry {
  outfit: Outfit;
  context: OutfitContext;
  timestamp: Date;
  expiresAt: Date;
}

/**
 * In-memory cache service for outfit data with LRU eviction
 */
export class CacheService {
  private cache: Map<string, CacheEntry> = new Map();
  private readonly maxSize = 50; // Maximum cache entries
  private readonly cacheDuration = 3600000; // 1 hour in milliseconds
  
  /**
   * Get outfit from memory cache if valid
   */
  async getFromMemory(context: OutfitContext): Promise<Outfit | null> {
    const key = this.generateCacheKey(context);
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }
    
    // Check if cache entry is expired
    if (new Date() > entry.expiresAt) {
      console.log('🕒 Cache entry expired, removing...');
      this.cache.delete(key);
      return null;
    }
    
    // Move to end (LRU implementation)
    this.cache.delete(key);
    this.cache.set(key, entry);
    
    console.log('💾 Memory cache hit for key:', key);
    return entry.outfit;
  }
  
  /**
   * Add outfit to memory cache
   */
  async addToMemory(context: OutfitContext, outfit: Outfit): Promise<void> {
    const key = this.generateCacheKey(context);
    
    // Implement LRU eviction if cache is full
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
        console.log('🗑️ Evicted oldest cache entry:', firstKey);
      }
    }
    
    const entry: CacheEntry = {
      outfit,
      context,
      timestamp: new Date(),
      expiresAt: new Date(Date.now() + this.cacheDuration)
    };
    
    this.cache.set(key, entry);
    console.log('💾 Added to memory cache:', key);
  }
  
  /**
   * Invalidate cache entries for a specific context
   */
  async invalidate(context: OutfitContext): Promise<void> {
    const key = this.generateCacheKey(context);
    const deleted = this.cache.delete(key);
    if (deleted) {
      console.log('🗑️ Invalidated cache entry:', key);
    }
  }
  
  /**
   * Clear all cache entries
   */
  clearAll(): void {
    const size = this.cache.size;
    this.cache.clear();
    console.log(`🧹 Cleared ${size} cache entries`);
  }
  
  /**
   * Remove expired entries
   */
  cleanup(): void {
    const now = new Date();
    let removed = 0;
    
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
        removed++;
      }
    }
    
    if (removed > 0) {
      console.log(`🧹 Cleaned up ${removed} expired cache entries`);
    }
  }
  
  /**
   * Generate consistent cache key from context
   */
  private generateCacheKey(context: OutfitContext): string {
    const dateStr = context.date.toISOString().split('T')[0];
    const weatherKey = context.weather 
      ? `${Math.round(context.weather.feelsLikeTemp)}_${context.weather.condition}`
      : 'no-weather';
    const activityKey = context.activity.toLowerCase().replace(/\s+/g, '-');
    const locationKey = (context.location || 'unknown').toLowerCase().replace(/\s+/g, '-');
    
    return `outfit_${dateStr}_${weatherKey}_${activityKey}_${locationKey}`;
  }
  
  /**
   * Get cache statistics
   */
  getStats(): { size: number; maxSize: number } {
    return {
      size: this.cache.size,
      maxSize: this.maxSize
    };
  }
}