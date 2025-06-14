import { weatherRateLimiter } from './rateLimiter';
import { Weather } from '@/types/weather';

interface OpenWeatherOneCallResponse {
  current: {
    temp: number;
    feels_like: number;
    humidity: number;
    uvi: number;
    wind_speed: number;
    weather: Array<{
      main: string;
      description: string;
      icon: string;
    }>;
  };
  daily: Array<{
    temp: {
      min: number;
      max: number;
    };
    pop: number; // Probability of precipitation (0-1)
    clouds: number; // Cloudiness percentage
  }>;
}

class WeatherService {
  private cache = new Map<string, { weather: Weather; timestamp: number }>();
  private readonly CACHE_DURATION = 10 * 60 * 1000; // 10 minutes
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY || '';
    this.baseUrl = process.env.EXPO_PUBLIC_OPENWEATHER_ONECALL_URL || 'https://api.openweathermap.org/data/3.0/onecall';
    
    if (!this.apiKey) {
      console.warn('⚠️ OpenWeather API key not found in environment variables');
    }
  }

  async fetchWeatherByCoordinates(lat: number, lon: number): Promise<Weather> {
    if (!lat || !lon) {
      throw new Error('Latitude and longitude are required');
    }

    const cacheKey = `${lat.toFixed(2)},${lon.toFixed(2)}`;
    
    // Check cache first
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      console.log('🌤️ Weather cache hit for coordinates:', { lat, lon });
      return cached.weather;
    }

    if (!this.apiKey) {
      throw new Error('OpenWeather API key not configured');
    }

    // Apply rate limiting
    await weatherRateLimiter.checkRateLimit();

    try {
      console.log('🌍 Fetching weather for coordinates:', { lat, lon });
      
      const url = `${this.baseUrl}?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=imperial&exclude=minutely,hourly,alerts`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status} ${response.statusText}`);
      }

      const data: OpenWeatherOneCallResponse = await response.json();
      
      const weather = this.transformToWeatherInterface(data);

      // Cache the result
      this.cache.set(cacheKey, {
        weather,
        timestamp: Date.now()
      });
      
      console.log('✅ Weather fetched successfully:', weather);
      return weather;

    } catch (error) {
      console.error('❌ Weather fetch error:', error);
      throw error;
    }
  }

  private transformToWeatherInterface(data: OpenWeatherOneCallResponse): Weather {
    const current = data.current;
    const today = data.daily[0];
    
    // Convert main weather condition to our enum
    const mainCondition = current.weather[0]?.main?.toLowerCase() || 'unknown';
    let condition: Weather['condition'];
    
    switch (mainCondition) {
      case 'clear':
        condition = 'sunny';
        break;
      case 'clouds':
        condition = today.clouds > 70 ? 'cloudy' : 'partly-cloudy';
        break;
      case 'rain':
      case 'drizzle':
        condition = 'rainy';
        break;
      case 'thunderstorm':
        condition = 'stormy';
        break;
      case 'snow':
        condition = 'snowy';
        break;
      case 'mist':
      case 'fog':
      case 'haze':
        condition = 'foggy';
        break;
      default:
        condition = 'partly-cloudy';
    }

    // Calculate sunniness based on cloudiness (inverse)
    const sunniness = Math.max(0, 100 - today.clouds);

    return {
      dailyHighTemp: Math.round(today.temp.max),
      dailyLowTemp: Math.round(today.temp.min),
      highestChanceOfRain: Math.round(today.pop * 100),
      windiness: Math.round(current.wind_speed),
      sunniness,
      feelsLikeTemp: Math.round(current.feels_like),
      humidity: current.humidity,
      uvIndex: Math.round(current.uvi),
      condition,
      icon: current.weather[0]?.icon
    };
  }

  clearCache(): void {
    this.cache.clear();
    console.log('🗑️ Weather cache cleared');
  }

  getCacheSize(): number {
    return this.cache.size;
  }
}

export const weatherService = new WeatherService();