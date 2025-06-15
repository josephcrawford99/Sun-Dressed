import { weatherRateLimiter } from '../rateLimiter';

export interface OpenWeatherOneCallResponse {
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

export class WeatherApiClient {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY || '';
    this.baseUrl = process.env.EXPO_PUBLIC_OPENWEATHER_ONECALL_URL || 'https://api.openweathermap.org/data/3.0/onecall';
    
    if (!this.apiKey) {
      throw new Error('OpenWeather API key not configured');
    }
  }

  async fetchWeatherData(lat: number, lon: number): Promise<OpenWeatherOneCallResponse> {
    if (!lat || !lon) {
      throw new Error('Latitude and longitude are required');
    }

    await weatherRateLimiter.checkRateLimit();

    const url = `${this.baseUrl}?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=imperial&exclude=minutely,hourly,alerts`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }
}