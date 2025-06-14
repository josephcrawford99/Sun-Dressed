import { useState, useCallback } from 'react';
import { geocodeService } from '@services/geocodeService';
import { weatherService } from '@services/weatherService';
import { Weather } from '@types/weather';

interface UseLocationWeatherReturn {
  weather: Weather | null;
  isLoading: boolean;
  error: string | null;
  fetchWeatherByLocationString: (locationString: string, coordinates?: { lat: number; lon: number }) => Promise<void>;
  clearWeather: () => void;
}

export function useLocationWeather(): UseLocationWeatherReturn {
  const [weather, setWeather] = useState<Weather | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeatherByLocationString = useCallback(async (
    locationString: string, 
    coordinates?: { lat: number; lon: number }
  ) => {
    if (!locationString?.trim()) {
      console.warn('⚠️ Empty location string provided');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('🌍 Starting weather fetch for:', locationString);
      
      let finalCoordinates;
      
      if (coordinates) {
        // Use coordinates from Google Places if available
        console.log('🎯 Using coordinates from Google Places:', coordinates);
        finalCoordinates = coordinates;
      } else {
        // Fallback to geocoding service
        console.log('🔄 Fallback to geocoding service');
        finalCoordinates = await geocodeService.geocode(locationString);
        console.log('📍 Coordinates from geocoding:', finalCoordinates);
      }
      
      // Fetch weather data using coordinates
      const weatherData = await weatherService.fetchWeatherByCoordinates(
        finalCoordinates.lat, 
        finalCoordinates.lon
      );
      console.log('🌤️ Weather data received:', weatherData);
      
      setWeather(weatherData);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('❌ Weather fetch failed:', errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearWeather = useCallback(() => {
    setWeather(null);
    setError(null);
  }, []);

  return {
    weather,
    isLoading,
    error,
    fetchWeatherByLocationString,
    clearWeather
  };
}