import { Weather, mockWeather } from '@/types/weather';
import { weatherRateLimiter } from './rateLimiter';

interface OpenWeatherResponse {
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    humidity: number;
  };
  weather: Array<{
    main: string;
    description: string;
  }>;
  wind: {
    speed: number;
  };
  uv?: number;
  name: string;
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

export const getWeatherByCoordinates = async (lat: number, lon: number): Promise<Weather> => {
  const apiKey = process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY;
  const weatherUrl = process.env.EXPO_PUBLIC_OPENWEATHER_WEATHER_URL;

  if (!apiKey) {
    console.warn('OpenWeather API key not configured, using mock weather');
    return { ...mockWeather, location: 'Mock Location' };
  }

  if (!weatherUrl) {
    console.warn('OpenWeather weather URL not configured, using mock weather');
    return { ...mockWeather, location: 'Mock Location' };
  }

  try {
    // Apply rate limiting
    await weatherRateLimiter.checkRateLimit();

    const response = await fetch(
      `${weatherUrl}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data: OpenWeatherResponse = await response.json();

    return {
      dailyHighTemp: Math.round(data.main.temp_max),
      dailyLowTemp: Math.round(data.main.temp_min),
      highestChanceOfRain: 0, // Basic implementation - could enhance later
      windiness: Math.round(data.wind.speed),
      sunniness: data.weather[0].main.toLowerCase() === 'clear' ? 100 : 50, // Simple mapping
      feelsLikeTemp: Math.round(data.main.feels_like),
      humidity: data.main.humidity,
      uvIndex: data.uv || 5, // Default value if not available
      condition: mapCondition(data.weather[0].main),
      location: data.name,
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