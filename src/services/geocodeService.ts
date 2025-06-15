import { geocodingRateLimiter } from './rateLimiter';

// US State name to abbreviation mapping
const STATE_ABBREVIATIONS: Record<string, string> = {
  'Alabama': 'AL', 'Alaska': 'AK', 'Arizona': 'AZ', 'Arkansas': 'AR', 'California': 'CA',
  'Colorado': 'CO', 'Connecticut': 'CT', 'Delaware': 'DE', 'Florida': 'FL', 'Georgia': 'GA',
  'Hawaii': 'HI', 'Idaho': 'ID', 'Illinois': 'IL', 'Indiana': 'IN', 'Iowa': 'IA',
  'Kansas': 'KS', 'Kentucky': 'KY', 'Louisiana': 'LA', 'Maine': 'ME', 'Maryland': 'MD',
  'Massachusetts': 'MA', 'Michigan': 'MI', 'Minnesota': 'MN', 'Mississippi': 'MS', 'Missouri': 'MO',
  'Montana': 'MT', 'Nebraska': 'NE', 'Nevada': 'NV', 'New Hampshire': 'NH', 'New Jersey': 'NJ',
  'New Mexico': 'NM', 'New York': 'NY', 'North Carolina': 'NC', 'North Dakota': 'ND', 'Ohio': 'OH',
  'Oklahoma': 'OK', 'Oregon': 'OR', 'Pennsylvania': 'PA', 'Rhode Island': 'RI', 'South Carolina': 'SC',
  'South Dakota': 'SD', 'Tennessee': 'TN', 'Texas': 'TX', 'Utah': 'UT', 'Vermont': 'VT',
  'Virginia': 'VA', 'Washington': 'WA', 'West Virginia': 'WV', 'Wisconsin': 'WI', 'Wyoming': 'WY',
  'District of Columbia': 'DC', 'Puerto Rico': 'PR', 'American Samoa': 'AS', 'Guam': 'GU',
  'Northern Mariana Islands': 'MP', 'U.S. Virgin Islands': 'VI'
};

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

interface OpenWeatherReverseGeocodeResponse {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

class GeocodeService {
  private cache = new Map<string, GeocodeResult>();
  private reverseCache = new Map<string, string>();
  private apiKey: string;
  private baseUrl: string;
  private reverseUrl: string;

  constructor() {
    this.apiKey = process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY || '';
    this.baseUrl = process.env.EXPO_PUBLIC_OPENWEATHER_GEOCODING_URL || 'https://api.openweathermap.org/geo/1.0/direct';
    this.reverseUrl = 'https://api.openweathermap.org/geo/1.0/reverse';
    
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
      throw new Error('OpenWeather API key not configured');
    }

    // Apply rate limiting
    await geocodingRateLimiter.checkRateLimit();

    try {
      
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
      throw new Error('OpenWeather API key not configured');
    }

    // Apply rate limiting
    await geocodingRateLimiter.checkRateLimit();

    try {
      
      const url = `${this.reverseUrl}?lat=${latitude}&lon=${longitude}&limit=1&appid=${this.apiKey}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Reverse geocoding API error: ${response.status} ${response.statusText}`);
      }

      const data: OpenWeatherReverseGeocodeResponse[] = await response.json();
      
      if (!data || data.length === 0) {
        throw new Error(`No address found for coordinates: ${latitude}, ${longitude}`);
      }

      // Format the address similar to what user might expect
      const location = data[0];
      let formattedAddress = location.name;
      if (location.state) {
        // Use state abbreviation if available, otherwise use full name
        const stateAbbr = STATE_ABBREVIATIONS[location.state] || location.state;
        formattedAddress += `, ${stateAbbr}`;
      }
      if (location.country) {
        formattedAddress += `, ${location.country}`;
      }

      // Cache the result
      this.reverseCache.set(cacheKey, formattedAddress);
      
      return formattedAddress;

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
}

export const geocodeService = new GeocodeService();
export type { GeocodeResult };