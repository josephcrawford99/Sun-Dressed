import { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { validateLocation } from '@/services/locationService';
import { getWeatherByCoordinates, getDefaultWeather } from '@/services/weatherService';

const STORAGE_KEY = 'last_location';
const DEFAULT_LOCATION = 'Blue Jean, MO';

export const useLocationWeather = () => {
  const [location, setLocation] = useState(DEFAULT_LOCATION);
  const [weather, setWeather] = useState(getDefaultWeather());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [debouncedLocation] = useDebounce(location, 500);

  // Load saved location on mount
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then(saved => {
      if (saved) setLocation(saved);
    });
  }, []);

  // Fetch weather when debounced location changes
  useEffect(() => {
    if (!debouncedLocation.trim()) {
      setWeather(getDefaultWeather());
      setError(null);
      return;
    }

    const fetchWeather = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // First validate with Google Places (forgiving search)
        const validation = await validateLocation(debouncedLocation);
        if (!validation.isValid || !validation.coordinates) {
          throw new Error(validation.error || 'Location not found');
        }

        // Then try to get weather data from OpenWeather
        const weatherData = await getWeatherByCoordinates(
          validation.coordinates.lat,
          validation.coordinates.lon
        );

        // Check if we actually got real weather data
        if (weatherData.location === 'Mock Location' || weatherData.location === 'Error - Using Mock Data') {
          throw new Error('No weather data available for this location');
        }

        setWeather({
          ...weatherData,
          location: validation.formattedName || debouncedLocation,
        });

        // Save valid location
        AsyncStorage.setItem(STORAGE_KEY, debouncedLocation);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch weather';
        setError(errorMessage);
        setWeather(prev => ({ ...getDefaultWeather(), location: prev.location }));
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeather();
  }, [debouncedLocation]);

  return {
    location,
    weather,
    isLoading,
    hasError: !!error,
    errorMessage: error,
    isLocationValid: !error && weather.location !== 'Mock Location',
    currentTemp: weather.feelsLikeTemp,
    setLocation,
  };
};