import { geocodingRateLimiter } from './rateLimiter';

interface GeocodeResult {
  lat: number;
  lon: number;
  country?: string;
  state?: string;
}

interface OpenWeatherGeocodeResponse {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

class GeocodeService {
  private cache = new Map<string, GeocodeResult>();
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY || '';
    this.baseUrl = process.env.EXPO_PUBLIC_OPENWEATHER_GEOCODING_URL || 'https://api.openweathermap.org/geo/1.0/direct';
    
    if (!this.apiKey) {
      console.warn('⚠️ OpenWeather API key not found in environment variables');
    }
  }

  async geocode(locationString: string): Promise<GeocodeResult> {
    if (!locationString?.trim()) {
      throw new Error('Location string is required');
    }

    const cacheKey = locationString.toLowerCase().trim();
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      console.log('📍 Geocode cache hit for:', locationString);
      return this.cache.get(cacheKey)!;
    }

    if (!this.apiKey) {
      throw new Error('OpenWeather API key not configured');
    }

    // Apply rate limiting
    await geocodingRateLimiter.checkRateLimit();

    try {
      console.log('🌍 Geocoding location:', locationString);
      
      const url = `${this.baseUrl}?q=${encodeURIComponent(locationString)}&limit=1&appid=${this.apiKey}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Geocoding API error: ${response.status} ${response.statusText}`);
      }

      const data: OpenWeatherGeocodeResponse[] = await response.json();
      
      if (!data || data.length === 0) {
        throw new Error(`No coordinates found for location: ${locationString}`);
      }

      const result: GeocodeResult = {
        lat: data[0].lat,
        lon: data[0].lon,
        country: data[0].country,
        state: data[0].state,
      };

      // Cache the result
      this.cache.set(cacheKey, result);
      
      console.log('✅ Geocoded successfully:', { locationString, result });
      return result;

    } catch (error) {
      console.error('❌ Geocoding error:', error);
      throw error;
    }
  }

  clearCache(): void {
    this.cache.clear();
    console.log('🗑️ Geocoding cache cleared');
  }

  getCacheSize(): number {
    return this.cache.size;
  }
}

export const geocodeService = new GeocodeService();
export type { GeocodeResult };