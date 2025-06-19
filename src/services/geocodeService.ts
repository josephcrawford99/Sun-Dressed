import { geocodingRateLimiter } from './rateLimiter';
import { extractLocationParts, type AddressComponent } from '@utils/locationUtils';

interface GeocodeResult {
  lat: number;
  lon: number;
  country?: string;
  state?: string;
}

interface GoogleGeocodeResponse {
  results: GoogleGeocodeResult[];
  status: string;
  error_message?: string;
}

interface GoogleGeocodeResult {
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  address_components: {
    long_name: string;
    short_name: string;
    types: string[];
  }[];
}

class GeocodeService {
  private cache = new Map<string, GeocodeResult>();
  private reverseCache = new Map<string, string>();
  private apiKey: string;
  private baseUrl: string;
  private reverseUrl: string;

  constructor() {
    this.apiKey = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY || '';
    this.baseUrl = process.env.EXPO_PUBLIC_GOOGLE_GEOCODING_URL || 'https://maps.googleapis.com/maps/api/geocode/json';
    this.reverseUrl = process.env.EXPO_PUBLIC_GOOGLE_REVERSE_GEOCODING_URL || 'https://maps.googleapis.com/maps/api/geocode/json';
    
    if (!this.apiKey) {
      // API key will be checked when methods are called
    }
  }

  async geocode(locationString: string): Promise<GeocodeResult> {
    if (!locationString?.trim()) {
      throw new Error('Location string is required');
    }

    const cacheKey = locationString.toLowerCase().trim();
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    if (!this.apiKey) {
      throw new Error('Google Places API key not configured');
    }

    // Apply rate limiting
    await geocodingRateLimiter.checkRateLimit();

    try {
      
      const url = `${this.baseUrl}?address=${encodeURIComponent(locationString)}&key=${this.apiKey}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Geocoding API error: ${response.status} ${response.statusText}`);
      }

      const data: GoogleGeocodeResponse = await response.json();
      
      if (data.status !== 'OK') {
        throw new Error(data.error_message || `Geocoding failed with status: ${data.status}`);
      }
      
      if (!data.results || data.results.length === 0) {
        throw new Error(`No coordinates found for location: ${locationString}`);
      }

      const firstResult = data.results[0];
      const result: GeocodeResult = {
        lat: firstResult.geometry.location.lat,
        lon: firstResult.geometry.location.lng,
        country: this.extractAddressComponent(firstResult, 'country'),
        state: this.extractAddressComponent(firstResult, 'administrative_area_level_1'),
      };

      // Cache the result
      this.cache.set(cacheKey, result);
      
      return result;

    } catch (error) {
      throw error;
    }
  }

  async reverseGeocode(latitude: number, longitude: number): Promise<string> {
    if (!latitude || !longitude) {
      throw new Error('Valid latitude and longitude are required');
    }

    const cacheKey = `${latitude.toFixed(6)},${longitude.toFixed(6)}`;
    
    // Check cache first
    if (this.reverseCache.has(cacheKey)) {
      return this.reverseCache.get(cacheKey)!;
    }

    if (!this.apiKey) {
      throw new Error('Google Places API key not configured');
    }

    // Apply rate limiting
    await geocodingRateLimiter.checkRateLimit();

    try {
      
      const url = `${this.reverseUrl}?latlng=${latitude},${longitude}&result_type=locality&key=${this.apiKey}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Reverse geocoding API error: ${response.status} ${response.statusText}`);
      }

      const data: GoogleGeocodeResponse = await response.json();
      
      if (data.status !== 'OK') {
        throw new Error(data.error_message || `Reverse geocoding failed with status: ${data.status}`);
      }
      
      if (!data.results || data.results.length === 0) {
        throw new Error(`No address found for coordinates: ${latitude}, ${longitude}`);
      }

      // Extract standardized location format from address components
      const addressComponents = data.results[0].address_components as AddressComponent[];
      const formattedLocation = extractLocationParts(addressComponents);
      
      // Fallback to formatted_address if extraction fails
      const finalAddress = formattedLocation || data.results[0].formatted_address;

      // Cache the result
      this.reverseCache.set(cacheKey, finalAddress);
      
      return finalAddress;

    } catch (error) {
      throw error;
    }
  }

  clearCache(): void {
    this.cache.clear();
    this.reverseCache.clear();
  }

  getCacheSize(): number {
    return this.cache.size + this.reverseCache.size;
  }

  private extractAddressComponent(result: GoogleGeocodeResult, type: string): string | undefined {
    const component = result.address_components.find(comp => comp.types.includes(type));
    return component?.short_name;
  }
}

export const geocodeService = new GeocodeService();
export type { GeocodeResult };