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

interface OpenWeatherDaySummaryResponse {
  lat: number;
  lon: number;
  tz: string;
  date: string;
  units: string;
  cloud_cover: {
    afternoon: number;
  };
  humidity: {
    afternoon: number;
  };
  precipitation: {
    total: number;
  };
  pressure: {
    afternoon: number;
  };
  temperature: {
    min: number;
    max: number;
    afternoon: number;
    night: number;
    evening: number;
    morning: number;
  };
  wind: {
    max: {
      speed: number;
      direction: number;
    };
  };
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
      return Array.isArray(cached.weather) ? cached.weather[0] : cached.weather;
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

  async fetchForecastForTripDates(lat: number, lon: number, startDate: Date, endDate: Date): Promise<Weather[]> {
    if (!lat || !lon) {
      throw new Error('Latitude and longitude are required');
    }

    if (!startDate || !endDate) {
      throw new Error('Start date and end date are required');
    }

    if (startDate > endDate) {
      throw new Error('Start date must be before end date');
    }

    // Use date-only comparison to avoid timezone and time-of-day issues
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tripStart = new Date(startDate);
    tripStart.setHours(0, 0, 0, 0);
    
    const tripEnd = new Date(endDate);
    tripEnd.setHours(0, 0, 0, 0);
    
    // Calculate days from today using date-only comparison
    const daysFromToday = Math.floor((tripStart.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    const tripDurationDays = Math.floor((tripEnd.getTime() - tripStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    // Check if we can use the standard One Call API (within 8 days)
    if (daysFromToday <= 7 && daysFromToday >= 0) {
      return this.fetchForecastUsingOneCall(lat, lon, daysFromToday, tripDurationDays, tripStart, tripEnd);
    } else {
      // Use Day Summary API for future dates
      return this.fetchForecastUsingDaySummary(lat, lon, startDate, endDate);
    }
  }

  private async fetchForecastUsingOneCall(lat: number, lon: number, daysFromToday: number, tripDurationDays: number, tripStart: Date, tripEnd: Date): Promise<Weather[]> {
    const cacheKey = `onecall-${lat.toFixed(2)},${lon.toFixed(2)}-${daysFromToday}`;
    
    // Check cache first
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      const cachedArray = Array.isArray(cached.weather) ? cached.weather : [cached.weather];
      // Extract the exact days for the trip - OpenWeatherMap index 0 = today
      const startIndex = Math.max(0, daysFromToday);
      const endIndex = Math.min(cachedArray.length, startIndex + tripDurationDays);
      return cachedArray.slice(startIndex, endIndex);
    }

    if (!this.apiKey) {
      throw new Error('OpenWeather API key not configured');
    }

    // Apply rate limiting
    await weatherRateLimiter.checkRateLimit();

    try {
      // Use exclude parameter to reduce cost - we only need daily forecasts for trips
      const url = `${this.baseUrl}?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=imperial&exclude=minutely,hourly,alerts`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status} ${response.statusText}`);
      }

      const data: OpenWeatherOneCallResponse = await response.json();
      
      // Transform to array and extract the relevant days for the trip
      const allForecasts = this.transformToWeatherForecastArray(data, 8);
      
      // Extract the exact days for the trip - OpenWeatherMap index 0 = today
      const startIndex = Math.max(0, daysFromToday);
      const endIndex = Math.min(allForecasts.length, startIndex + tripDurationDays);
      const tripForecasts = allForecasts.slice(startIndex, endIndex);

      // Cache the result
      this.cache.set(cacheKey, {
        weather: allForecasts,
        timestamp: Date.now()
      });
      
      return tripForecasts;

    } catch (error) {
      throw error;
    }
  }

  private async fetchForecastUsingDaySummary(lat: number, lon: number, startDate: Date, endDate: Date): Promise<Weather[]> {
    const forecasts: Weather[] = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const dateString = currentDate.toISOString().split('T')[0]; // YYYY-MM-DD format
      const cacheKey = `daysummary-${lat.toFixed(2)},${lon.toFixed(2)}-${dateString}`;
      
      // Check cache first
      const cached = this.cache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
        forecasts.push(Array.isArray(cached.weather) ? cached.weather[0] : cached.weather);
      } else {
        if (!this.apiKey) {
          throw new Error('OpenWeather API key not configured');
        }

        // Apply rate limiting
        await weatherRateLimiter.checkRateLimit();

        try {
          const url = `${this.baseUrl}/day_summary?lat=${lat}&lon=${lon}&date=${dateString}&appid=${this.apiKey}&units=imperial`;
          
          const response = await fetch(url);
          
          if (!response.ok) {
            throw new Error(`Weather API error: ${response.status} ${response.statusText}`);
          }

          const data: OpenWeatherDaySummaryResponse = await response.json();
          const weather = this.transformDaySummaryToWeather(data);

          // Cache the result
          this.cache.set(cacheKey, {
            weather,
            timestamp: Date.now()
          });
          
          forecasts.push(weather);

        } catch {
          // If we can't get weather for this specific date, create a placeholder
          forecasts.push(this.createPlaceholderWeather());
        }
      }

      // Move to next day
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return forecasts;
  }

  private transformDaySummaryToWeather(data: OpenWeatherDaySummaryResponse): Weather {
    // Estimate condition based on precipitation and cloud cover
    let condition: Weather['condition'] = 'partly-cloudy';
    
    if (data.precipitation.total > 5) {
      condition = 'rainy';
    } else if (data.cloud_cover.afternoon > 80) {
      condition = 'cloudy';
    } else if (data.cloud_cover.afternoon < 20) {
      condition = 'sunny';
    }

    // Calculate sunniness based on cloud cover (inverse)
    const sunniness = Math.max(0, 100 - data.cloud_cover.afternoon);

    return {
      dailyHighTemp: Math.round(data.temperature.max),
      dailyLowTemp: Math.round(data.temperature.min),
      highestChanceOfRain: Math.round((data.precipitation.total / 10) * 100), // Rough estimate
      windiness: Math.round(data.wind.max.speed),
      sunniness,
      feelsLikeTemp: Math.round(data.temperature.afternoon),
      humidity: data.humidity.afternoon,
      uvIndex: 0, // Not available in day summary - show as unavailable
      condition,
      icon: this.getIconForCondition(condition)
    };
  }

  private createPlaceholderWeather(): Weather {
    return {
      dailyHighTemp: 0,
      dailyLowTemp: 0,
      highestChanceOfRain: 0,
      windiness: 0,
      sunniness: 0,
      feelsLikeTemp: 0,
      humidity: 0,
      uvIndex: 0,
      condition: 'partly-cloudy',
      icon: '02d'
    };
  }

  private getIconForCondition(condition: Weather['condition']): string {
    switch (condition) {
      case 'sunny': return '01d';
      case 'partly-cloudy': return '02d';
      case 'cloudy': return '03d';
      case 'rainy': return '10d';
      case 'stormy': return '11d';
      case 'snowy': return '13d';
      case 'foggy': return '50d';
      default: return '02d';
    }
  }

  getCacheSize(): number {
    return this.cache.size;
  }
}

export const weatherService = new WeatherService();