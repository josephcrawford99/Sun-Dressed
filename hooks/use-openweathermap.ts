import * as Location from 'expo-location';

/**
 * OpenWeatherMap OneCall 3.0 API response type
 */
export interface WeatherData {
  lat: number;
  lon: number;
  timezone: string;
  current?: {
    dt: number;
    temp: number;
    feels_like: number;
    pressure: number;
    humidity: number;
    dew_point: number;
    uvi: number;
    weather: Array<{
      id: number;
      main: string;
      description: string;
      icon: string;
    }>;
  };
  [key: string]: any;
}

/**
 * Fetches weather data from OpenWeatherMap OneCall 3.0 API
 * Handles location permission and fetching automatically
 *
 * @returns Promise with weather data
 * @throws Error if location permission denied, API key missing, or fetch fails
 */
export async function fetchWeatherData(): Promise<WeatherData> {
  // Get location permission
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('Location permission denied');
  }

  // Get current location
  const location = await Location.getCurrentPositionAsync({});
  const { latitude, longitude } = location.coords;

  // Get API key from environment
  const apiKey = process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY;
  if (!apiKey) {
    throw new Error('API key not configured. Please add EXPO_PUBLIC_OPENWEATHER_API_KEY to .env.local');
  }

  // Fetch weather from OneCall 3.0 API
  const response = await fetch(
    `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
  );

  if (!response.ok) {
    throw new Error(`Weather API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}
