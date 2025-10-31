import { fetchWeatherData, WeatherData } from '@/services/openweathermap-service';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import * as Location from 'expo-location';

const WEATHER_STALE_TIME = 5 * 60 * 1000
/**
 * Fetches weather data based on device location
 * Handles location permission and coordinates internally
 */
async function fetchWeather(): Promise<WeatherData> {
  // Get location permission
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('Location permission denied');
  }

  // Get current location
  const location = await Location.getCurrentPositionAsync({});
  const { latitude, longitude } = location.coords;

  // Fetch weather data
  const result = await fetchWeatherData(latitude, longitude);
  return result.data;
}

/**
 * Hook to fetch weather data using TanStack Query
 *
 * Automatically fetches weather on mount and caches the result.
 * Any component using this hook will share the same cached data.
 *
 * @returns TanStack Query result with weather data, loading state, and error
 */
export function useWeather(): UseQueryResult<WeatherData, Error> {
  return useQuery<WeatherData, Error>({
    queryKey: ['weather'],
    queryFn: fetchWeather,
    staleTime: WEATHER_STALE_TIME,
    retry: 1,
  });
}
