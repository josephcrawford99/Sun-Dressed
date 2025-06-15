import { Weather } from '@/types/weather';

interface CacheEntry {
  weather: Weather | Weather[];
  timestamp: number;
}

export class WeatherCacheService {
  private cache = new Map<string, CacheEntry>();
  private readonly CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

  getCached(key: string): Weather | Weather[] | null {
    const cached = this.cache.get(key);
    
    if (!cached) {
      return null;
    }
    
    if (Date.now() - cached.timestamp > this.CACHE_DURATION) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.weather;
  }

  set(key: string, weather: Weather | Weather[]): void {
    this.cache.set(key, {
      weather,
      timestamp: Date.now()
    });
  }

  clear(): void {
    this.cache.clear();
  }

  getSize(): number {
    return this.cache.size;
  }

  generateCacheKey(lat: number, lon: number, type: 'current' | 'forecast', days?: number): string {
    const baseKey = `${lat.toFixed(2)},${lon.toFixed(2)}`;
    
    if (type === 'forecast' && days !== undefined) {
      return `forecast-${baseKey}-${days}d`;
    }
    
    return baseKey;
  }
}