import { Weather, mockWeather } from '@/types/weather';
import { weatherRateLimiter } from './rateLimiter';

interface OneCallResponse {
  current: {
    temp: number;
    feels_like: number;
    humidity: number;
    uvi: number;
    wind_speed: number;
    wind_deg?: number;
    clouds: number;
    weather: Array<{
      id: number;
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
    pop: number; // Probability of precipitation
  }>;
}

const mapCondition = (weatherMain: string): Weather['condition'] => {
  switch (weatherMain.toLowerCase()) {
    case 'clear':
      return 'sunny';
    case 'clouds':
      return 'cloudy';
    case 'rain':
    case 'drizzle':
      return 'rainy';
    case 'thunderstorm':
      return 'stormy';
    case 'snow':
      return 'snowy';
    case 'mist':
    case 'fog':
      return 'foggy';
    default:
      return 'partly-cloudy';
  }
};

export const getWeatherByCoordinates = async (lat: number, lon: number, locationName?: string): Promise<Weather> => {
  console.log('🌍 getWeatherByCoordinates called with:', { lat, lon, locationName });
  
  const apiKey = process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY;
  const oneCallUrl = process.env.EXPO_PUBLIC_OPENWEATHER_ONECALL_URL;

  console.log('🔑 Environment check:', { 
    hasApiKey: !!apiKey, 
    apiKeyPrefix: apiKey ? apiKey.substring(0, 8) + '...' : 'MISSING',
    oneCallUrl: oneCallUrl || 'MISSING'
  });

  if (!apiKey) {
    console.warn('OpenWeather API key not configured, using mock weather');
    return { ...mockWeather, location: 'Mock Location' };
  }

  if (!oneCallUrl) {
    console.warn('OpenWeather One Call URL not configured, using mock weather');
    return { ...mockWeather, location: 'Mock Location' };
  }

  try {
    // Apply rate limiting
    await weatherRateLimiter.checkRateLimit();

    const response = await fetch(
      `${oneCallUrl}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data: OneCallResponse = await response.json();
    const current = data.current;
    const today = data.daily[0];

    // Calculate sunniness based on cloud coverage
    const sunniness = Math.max(0, 100 - current.clouds);
    
    // Get probability of precipitation from daily data
    const rainChance = Math.round((today?.pop || 0) * 100);

    return {
      dailyHighTemp: Math.round(today?.temp.max || current.temp),
      dailyLowTemp: Math.round(today?.temp.min || current.temp),
      highestChanceOfRain: rainChance,
      windiness: Math.round(current.wind_speed),
      sunniness: Math.round(sunniness),
      feelsLikeTemp: Math.round(current.feels_like),
      humidity: current.humidity,
      uvIndex: Math.round(current.uvi),
      condition: mapCondition(current.weather[0].main),
      location: locationName || 'Current Location',
      icon: current.weather[0].icon,
    };
  } catch (error) {
    console.error('Weather fetch error:', error);
    console.warn('Falling back to mock weather data');
    return { ...mockWeather, location: 'Error - Using Mock Data' };
  }
};

// Default weather for Blue Jean, Missouri
export const getDefaultWeather = (): Weather => {
  return { ...mockWeather, location: 'Blue Jean, Missouri' };
};