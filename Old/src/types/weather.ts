/**
 * Weather data types for the Sun Dressed app
 */

export interface WeatherData {
  temperature: number;
  feels_like: number;
  humidity: number;
  wind_speed: number;
  description: string;
  icon: string;
  time_of_day?: TimeOfDay;
  sunset?: number; // Unix timestamp
}

export interface DailyForecast {
  date: string;
  morning: WeatherData;
  afternoon: WeatherData;
  evening: WeatherData;
}

export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

export type WeatherErrorCode =
  | 'NETWORK_ERROR'
  | 'INVALID_API_KEY'
  | 'LOCATION_NOT_FOUND'
  | 'RATE_LIMIT'
  | 'UNKNOWN_ERROR';

export type WeatherCondition = 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'night';

export class WeatherError extends Error {
  code: WeatherErrorCode;

  constructor(message: string, code: WeatherErrorCode) {
    super(message);
    this.code = code;
    this.name = 'WeatherError';
  }
}

// Cache data structure
export interface CachedWeatherData {
  data: WeatherData;
  timestamp: number;
}

export interface CachedForecastData {
  data: DailyForecast[];
  timestamp: number;
}

// OpenWeatherMap API response types
export interface OpenWeatherCurrentResponse {
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
    deg: number;
  };
  clouds: {
    all: number;
  };
  dt: number;
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

export interface OpenWeatherForecastResponse {
  cod: string;
  message: number;
  cnt: number;
  list: Array<{
    dt: number;
    main: {
      temp: number;
      feels_like: number;
      temp_min: number;
      temp_max: number;
      pressure: number;
      sea_level: number;
      grnd_level: number;
      humidity: number;
      temp_kf: number;
    };
    weather: Array<{
      id: number;
      main: string;
      description: string;
      icon: string;
    }>;
    clouds: {
      all: number;
    };
    wind: {
      speed: number;
      deg: number;
      gust: number;
    };
    visibility: number;
    pop: number;
    rain?: {
      '3h': number;
    };
    snow?: {
      '3h': number;
    };
    sys: {
      pod: string;
    };
    dt_txt: string;
  }>;
  city: {
    id: number;
    name: string;
    coord: {
      lat: number;
      lon: number;
    };
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}
