import { Weather } from '@/types/weather';
import { WeatherApiClient } from './WeatherApiClient';
import { WeatherTransformer } from './WeatherTransformer';
import { WeatherCacheService } from './WeatherCacheService';

export class WeatherService {
  private apiClient: WeatherApiClient;
  private transformer: WeatherTransformer;
  private cacheService: WeatherCacheService;

  constructor() {
    this.apiClient = new WeatherApiClient();
    this.transformer = new WeatherTransformer();
    this.cacheService = new WeatherCacheService();
  }

  async fetchWeatherByCoordinates(lat: number, lon: number): Promise<Weather> {
    const cacheKey = this.cacheService.generateCacheKey(lat, lon, 'current');
    
    // Check cache first
    const cached = this.cacheService.getCached(cacheKey);
    if (cached && !Array.isArray(cached)) {
      return cached;
    }

    try {
      const data = await this.apiClient.fetchWeatherData(lat, lon);
      const weather = this.transformer.transformCurrentWeather(data);
      
      // Cache the result
      this.cacheService.set(cacheKey, weather);
      
      return weather;
    } catch (error) {
      throw new Error(`Failed to fetch weather: ${error}`);
    }
  }

  async fetchForecastByCoordinates(lat: number, lon: number, days: number): Promise<Weather[]> {
    if (days < 1 || days > 8) {
      throw new Error('Days must be between 1 and 8 (API limitation)');
    }

    const cacheKey = this.cacheService.generateCacheKey(lat, lon, 'forecast', days);
    
    // Check cache first
    const cached = this.cacheService.getCached(cacheKey);
    if (cached && Array.isArray(cached)) {
      return cached;
    }

    try {
      const data = await this.apiClient.fetchWeatherData(lat, lon);
      const forecasts = this.transformer.transformForecast(data, days);
      
      // Cache the result
      this.cacheService.set(cacheKey, forecasts);
      
      return forecasts;
    } catch (error) {
      throw new Error(`Failed to fetch forecast: ${error}`);
    }
  }

  clearCache(): void {
    this.cacheService.clear();
  }

  getCacheSize(): number {
    return this.cacheService.getSize();
  }
}