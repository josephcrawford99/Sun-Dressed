import { fetchWeatherData, WeatherData, TempFormat } from '@/services/openweathermap-service';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import * as Location from 'expo-location';
import { useStore } from '@/store/store';

const WEATHER_STALE_TIME = 5 * 60 * 1000

/**
 * Fetches weather data based on device location
 * Handles location permission and coordinates internally
 *
 * @param units - Temperature units to use ('metric' or 'imperial')
 */
async function fetchWeather(units: TempFormat): Promise<WeatherData> {
  // Get location permission
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('Location permission denied');
  }

  // Get current location
  const location = await Location.getCurrentPositionAsync({});
  const { latitude, longitude } = location.coords;

  // Fetch weather data with specified units
  const result = await fetchWeatherData(latitude, longitude, units);
  return result.data;
}

/**
 * Hook to fetch weather data using TanStack Query
 *
 * Automatically fetches weather on mount and caches the result.
 * Any component using this hook will share the same cached data.
 * When temperature format changes, the query will refetch with new units.
 *
 * @returns TanStack Query result with weather data, loading state, and error
 */
export function useWeather(): UseQueryResult<WeatherData, Error> {
  const tempFormat = useStore((state) => state.tempFormat);

  return useQuery<WeatherData, Error>({
    queryKey: ['weather', tempFormat],
    queryFn: () => fetchWeather(tempFormat),
    staleTime: WEATHER_STALE_TIME,
    retry: 1,
  });
}
