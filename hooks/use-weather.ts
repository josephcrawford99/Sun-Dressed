import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

/**
 * OpenWeatherMap OneCall 3.0 API response type
 * This is a simplified type - add more fields as needed
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
    weather: Array<{
      id: number;
      main: string;
      description: string;
      icon: string;
    }>;
  };
  // Add hourly, daily, etc. as needed
  [key: string]: any; // Allow for additional fields from API
}

export interface UseWeatherResult {
  weather: WeatherData | null;
  loading: boolean;
  error: string | null;
}

/**
 * Hook to fetch weather data using OpenWeatherMap OneCall 3.0 API
 * Fetches data only once when component mounts
 */
export const useWeather = (): UseWeatherResult => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        // Get location permission
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setError('Location permission denied');
          setLoading(false);
          return;
        }

        // Get current location
        const location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;

        // Get API key from environment
        const apiKey = process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY;
        if (!apiKey) {
          setError('API key not configured. Please add EXPO_PUBLIC_OPENWEATHER_API_KEY to .env.local');
          setLoading(false);
          return;
        }

        // Fetch weather from OneCall 3.0 API
        const response = await fetch(
          `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
        );

        if (!response.ok) {
          throw new Error(`Weather API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        setWeather(data);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to get weather');
        setLoading(false);
      }
    })();
  }, []); // Empty dependency array - runs only once on mount

  return { weather, loading, error };
};
