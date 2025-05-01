import { useState, useEffect, useCallback } from 'react';
import { getCurrentWeather, WeatherData } from '../services/weatherService';
import { DEFAULT_LOCATION } from './constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_KEY = '@weather_cache';
const CACHE_EXPIRY = 10 * 60 * 1000; // 10 minutes in milliseconds
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute in milliseconds
const MAX_CALLS_PER_MINUTE = 50; // Keep it under the 60 calls/minute limit

interface CachedWeather {
  data: WeatherData;
  timestamp: number;
  location: string;
}

interface UseWeatherResult {
  weatherData: WeatherData | undefined;
  isLoading: boolean;
  error: string | undefined;
  refetch: (location?: string) => Promise<void>;
  lastUpdated: Date | undefined;
}

// Keep track of API calls
let apiCallsTimestamps: number[] = [];

const isRateLimited = () => {
  const now = Date.now();
  // Remove timestamps older than 1 minute
  apiCallsTimestamps = apiCallsTimestamps.filter(
    timestamp => now - timestamp < RATE_LIMIT_WINDOW
  );
  return apiCallsTimestamps.length >= MAX_CALLS_PER_MINUTE;
};

export const useWeather = (initialLocation: string = DEFAULT_LOCATION): UseWeatherResult => {
  const [weatherData, setWeatherData] = useState<WeatherData>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [lastUpdated, setLastUpdated] = useState<Date>();

  // Try to get cached weather data
  const getCachedWeather = async (location: string): Promise<CachedWeather | null> => {
    try {
      const cached = await AsyncStorage.getItem(`${CACHE_KEY}_${location}`);
      if (cached) {
        const parsedCache = JSON.parse(cached) as CachedWeather;
        const now = Date.now();
        if (now - parsedCache.timestamp < CACHE_EXPIRY) {
          return parsedCache;
        }
      }
    } catch (err) {
      console.warn('Failed to read from cache:', err);
    }
    return null;
  };

  // Save weather data to cache
  const cacheWeatherData = async (location: string, data: WeatherData) => {
    try {
      const cacheData: CachedWeather = {
        data,
        timestamp: Date.now(),
        location
      };
      await AsyncStorage.setItem(
        `${CACHE_KEY}_${location}`,
        JSON.stringify(cacheData)
      );
    } catch (err) {
      console.warn('Failed to cache weather data:', err);
    }
  };

  const fetchWeather = useCallback(async (location: string) => {
    try {
      setIsLoading(true);
      setError(undefined);

      // Check rate limiting
      if (isRateLimited()) {
        // Try to use cached data if rate limited
        const cached = await getCachedWeather(location);
        if (cached) {
          setWeatherData(cached.data);
          setLastUpdated(new Date(cached.timestamp));
          setError('Using cached data (rate limited)');
          return;
        }
        throw new Error('Rate limit reached. Please try again in a minute.');
      }

      // Try to get fresh data
      apiCallsTimestamps.push(Date.now());
      const data = await getCurrentWeather(location);

      // Cache the new data
      await cacheWeatherData(location, data);

      setWeatherData(data);
      setLastUpdated(new Date());
    } catch (err: any) {
      // If API call fails, try to use cached data
      const cached = await getCachedWeather(location);
      if (cached) {
        setWeatherData(cached.data);
        setLastUpdated(new Date(cached.timestamp));
        setError('Using cached data due to error: ' + err.message);
      } else {
        setError(err.message || 'Failed to fetch weather data');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWeather(initialLocation);
  }, [initialLocation, fetchWeather]);

  const refetch = async (location: string = initialLocation) => {
    await fetchWeather(location);
  };

  return {
    weatherData,
    isLoading,
    error,
    refetch,
    lastUpdated
  };
};
