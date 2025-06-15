import { weatherRateLimiter } from './rateLimiter';
import { Weather } from '@/types/weather';

interface OpenWeatherOneCallResponse {
  current: {
    temp: number;
    feels_like: number;
    humidity: number;
    uvi: number;
    wind_speed: number;
    weather: {
      main: string;
      description: string;
      icon: string;
    }[];
  };
  daily: {
    temp: {
      min: number;
      max: number;
      day: number;
    };
    feels_like: {
      day: number;
    };
    pop: number; // Probability of precipitation (0-1)
    clouds: number; // Cloudiness percentage
    humidity: number;
    uvi: number;
    wind_speed: number;
    weather: {
      main: string;
      description: string;
      icon: string;
    }[];
  }[];
}

class WeatherService {
  private cache = new Map<string, { weather: Weather | Weather[]; timestamp: number }>();
  private readonly CACHE_DURATION = 10 * 60 * 1000; // 10 minutes
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY || '';
    this.baseUrl = process.env.EXPO_PUBLIC_OPENWEATHER_ONECALL_URL || 'https://api.openweathermap.org/data/3.0/onecall';
    
    if (!this.apiKey) {
      // OpenWeather API key not found
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
      return cached.weather;
    }

    if (!this.apiKey) {
      throw new Error('OpenWeather API key not configured');
    }

    // Apply rate limiting
    await weatherRateLimiter.checkRateLimit();

    try {
      
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
      
      return weather;

    } catch (error) {
      // Weather fetch error
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
  }

  async fetchForecastByCoordinates(lat: number, lon: number, days: number): Promise<Weather[]> {
    if (!lat || !lon) {
      throw new Error('Latitude and longitude are required');
    }
    
    if (days < 1 || days > 8) {
      throw new Error('Days must be between 1 and 8 (API limitation)');
    }

    const cacheKey = `forecast-${lat.toFixed(2)},${lon.toFixed(2)}-${days}d`;
    
    // Check cache first
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return Array.isArray(cached.weather) ? cached.weather : [cached.weather];
    }

    if (!this.apiKey) {
      throw new Error('OpenWeather API key not configured');
    }

    // Apply rate limiting
    await weatherRateLimiter.checkRateLimit();

    try {
      
      const url = `${this.baseUrl}?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=imperial&exclude=minutely,hourly,alerts`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status} ${response.statusText}`);
      }

      const data: OpenWeatherOneCallResponse = await response.json();
      
      const forecasts = this.transformToWeatherForecastArray(data, days);

      // Cache the result
      this.cache.set(cacheKey, {
        weather: forecasts,
        timestamp: Date.now()
      });
      
      return forecasts;

    } catch (error) {
      // Weather forecast fetch error
      throw error;
    }
  }

  private transformToWeatherForecastArray(data: OpenWeatherOneCallResponse, days: number): Weather[] {
    const forecasts: Weather[] = [];
    
    // Take only the requested number of days (up to what's available)
    const dailyForecasts = data.daily.slice(0, days);
    
    dailyForecasts.forEach((dailyData, index) => {
      // Use current weather for first day, daily data for subsequent days
      const current = index === 0 ? data.current : null;
      
      // Convert main weather condition to our enum
      const weatherCondition = dailyData.weather?.[0] || current?.weather?.[0];
      const mainCondition = weatherCondition?.main?.toLowerCase() || 'unknown';
      let condition: Weather['condition'];
      
      switch (mainCondition) {
        case 'clear':
          condition = 'sunny';
          break;
        case 'clouds':
          condition = dailyData.clouds > 70 ? 'cloudy' : 'partly-cloudy';
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
      const sunniness = Math.max(0, 100 - (dailyData.clouds || 0));

      forecasts.push({
        dailyHighTemp: Math.round(dailyData.temp.max),
        dailyLowTemp: Math.round(dailyData.temp.min),
        highestChanceOfRain: Math.round(dailyData.pop * 100),
        windiness: Math.round(dailyData.wind_speed || current?.wind_speed || 0),
        sunniness,
        feelsLikeTemp: Math.round(dailyData.feels_like.day || current?.feels_like || dailyData.temp.day),
        humidity: dailyData.humidity || current?.humidity || 0,
        uvIndex: Math.round(dailyData.uvi || current?.uvi || 0),
        condition,
        icon: weatherCondition?.icon
      });
    });
    
    return forecasts;
  }

  getCacheSize(): number {
    return this.cache.size;
  }
}

export const weatherService = new WeatherService();