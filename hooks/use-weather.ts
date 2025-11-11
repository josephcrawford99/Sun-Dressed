import {
  fetch30WeatherData,
  fetch25WeatherData,
  mergeWeatherData,
  TempFormat,
  WeatherData,
  Weather30Result,
  Weather25Result,
} from '@/services/openweathermap-service';
import { useStore } from '@/store/store';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import * as Location from 'expo-location';
import { useMemo } from 'react';

const WEATHER_30_STALE_TIME = 12 * 60 * 60 * 1000; // 12 hours
const WEATHER_25_STALE_TIME = 5 * 60 * 1000; // 5 minutes

/**
 * Fetches weather data from 3.0 API based on device location
 * Handles location permission and coordinates internally
 * Returns full result with both transformed data and raw API response
 *
 * @param units - Temperature units to use ('metric' or 'imperial')
 */
async function fetch30Weather(units: TempFormat): Promise<Weather30Result> {
  // Get location permission
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('Location permission is required to get weather data. Please enable location access in your device settings.');
  }

  // Get current location
  const location = await Location.getCurrentPositionAsync({});
  const { latitude, longitude } = location.coords;

  // Fetch weather data from 3.0 API (includes both raw and transformed)
  return fetch30WeatherData(latitude, longitude, units);
}

/**
 * Fetches weather data from 2.5 API based on device location
 * Handles location permission and coordinates internally
 * Returns full result with both transformed data and raw API responses
 *
 * @param units - Temperature units to use ('metric' or 'imperial')
 */
async function fetch25Weather(units: TempFormat): Promise<Weather25Result> {
  // Get location permission
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('Location permission is required to get weather data. Please enable location access in your device settings.');
  }

  // Get current location
  const location = await Location.getCurrentPositionAsync({});
  const { latitude, longitude } = location.coords;

  // Fetch weather data from 2.5 API (includes both raw and transformed)
  return fetch25WeatherData(latitude, longitude, units);
}

/**
 * Hook to fetch weather data using TanStack Query with dual API strategy
 *
 * Runs two simultaneous queries:
 * - 3.0 API: Updates every 12 hours, provides comprehensive data including UV index
 * - 2.5 API: Updates every 5 minutes, provides frequent current condition updates
 *
 * The queries store full results (including raw API responses) in cache for debugging,
 * but this hook only exposes the merged WeatherData interface.
 *
 * Merge strategy:
 * - Uses 2.5 for current conditions (fresher)
 * - Uses 3.0 for UV index and daily forecast (more comprehensive)
 * - Falls back to whichever is available if one fails
 *
 * @returns TanStack Query result with merged weather data, loading state, and error
 */
export function useWeather(): UseQueryResult<WeatherData, Error> {
  const tempFormat = useStore((state) => state.tempFormat);

  // Query 3.0 API with 12-hour stale time
  // Stores full Weather30Result in cache (includes raw API response for debugging)
  const query30 = useQuery<Weather30Result, Error>({
    queryKey: ['weather-3.0', tempFormat],
    queryFn: () => fetch30Weather(tempFormat),
    staleTime: WEATHER_30_STALE_TIME,
    retry: 1,
  });

  // Query 2.5 API with 5-minute stale time
  // Stores full Weather25Result in cache (includes raw API responses for debugging)
  const query25 = useQuery<Weather25Result, Error>({
    queryKey: ['weather-2.5', tempFormat],
    queryFn: () => fetch25Weather(tempFormat),
    staleTime: WEATHER_25_STALE_TIME,
    retry: 1,
  });

  // Extract just the WeatherData from each result and merge
  const mergedData = useMemo(
    () => mergeWeatherData(query30.data?.data, query25.data?.data),
    [query30.data, query25.data]
  );

  // Determine overall loading state (loading if either is loading and we have no data)
  const isLoading = (query30.isLoading || query25.isLoading) && !mergedData;

  // Determine overall error state:
  // - Show error if both failed
  // - OR if either failed and we have no data to fall back on
  const error =
    query30.error && query25.error
      ? query30.error
      : !mergedData && (query30.error || query25.error)
      ? (query30.error || query25.error)
      : null;

  // Return latest dataUpdatedAt from either query
  const dataUpdatedAt = Math.max(
    query30.dataUpdatedAt || 0,
    query25.dataUpdatedAt || 0
  );

  // Construct a compatible query result
  // We use query30 as the base but override data/error/loading/timestamp
  const result: UseQueryResult<WeatherData, Error> = {
    ...query30,
    data: mergedData,
    isLoading,
    error,
    dataUpdatedAt,
    // Override refetch to return WeatherData instead of Weather30Result
    refetch: async () => {
      const result = await query30.refetch();
      return {
        ...result,
        data: result.data?.data,
      } as any;
    },
  } as any;

  return result;
}
