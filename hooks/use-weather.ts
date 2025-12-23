import { fetchWeatherData, TempFormat } from '@/services/openweathermap-service';
import { useStore } from '@/store/store';
import { WeatherData } from '@/types/weather';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import * as Location from 'expo-location';

/**
 * Weather data stale time (1 hour)
 * The 5-day/3-hour forecast API updates less frequently than current weather,
 * so a 1-hour stale time balances freshness with API efficiency.
 */
const WEATHER_STALE_TIME = 60 * 60 * 1000;

/**
 * Fetches weather data based on device location
 * Handles location permission and coordinates internally
 *
 * @param units - Temperature units to use ('metric' or 'imperial')
 * @returns WeatherData
 */
async function fetchWeatherWithLocation(units: TempFormat): Promise<WeatherData> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('Location permission is required to get weather data. Please enable location access in your device settings.');
  }

  const location = await Location.getCurrentPositionAsync({});
  const { latitude, longitude } = location.coords;

  return fetchWeatherData(latitude, longitude, units);
}

/**
 * Hook to fetch weather data using TanStack Query
 *
 * Uses the OpenWeatherMap 5-day/3-hour forecast API with cnt=8
 * to get 24 hours of forecast data. The first chunk is used for
 * current conditions, and min/max are calculated from all chunks.
 *
 * @returns TanStack Query result with WeatherData, loading state, and error
 */
export function useWeather(): UseQueryResult<WeatherData, Error> {
  const tempFormat = useStore((state) => state.tempFormat);

  return useQuery<WeatherData, Error>({
    queryKey: ['weather', tempFormat],
    queryFn: () => fetchWeatherWithLocation(tempFormat),
    staleTime: WEATHER_STALE_TIME,
    retry: 1,
  });
}
