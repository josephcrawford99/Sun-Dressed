import { geocodeLocationString } from '@/services/locationService';
import { getDefaultWeather, getWeatherByCoordinates } from '@/services/weatherService';
import { Weather } from '@/types/weather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useState } from 'react';

const STORAGE_KEY = 'last_location';
const DEFAULT_LOCATION = 'New York, NY, USA';

export const useWeather = () => {
  const [location, setLocation] = useState(DEFAULT_LOCATION);
  const [weather, setWeather] = useState<Weather>(getDefaultWeather());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch weather using coordinates directly (from Google Places)
  const fetchWeatherByCoordinates = useCallback(async (lat: number, lon: number, locationName: string) => {
    console.log('🌤️ fetchWeatherByCoordinates called:', { lat, lon, locationName });
    
    setIsLoading(true);
    setError(null);
    setLocation(locationName);

    try {
      const weatherData = await getWeatherByCoordinates(lat, lon, locationName);
      
      console.log('🌤️ Weather data received:', weatherData);
      
      // Check if we actually got real weather data
      if (weatherData.location === 'Mock Location' || weatherData.location === 'Error - Using Mock Data') {
        throw new Error('No weather data available for this location');
      }

      setWeather({
        ...weatherData,
        location: locationName, // Use the display name from Google Places
      });

      // Save valid location for persistence
      AsyncStorage.setItem(STORAGE_KEY, locationName);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch weather';
      console.error('🌤️ Weather fetch error:', errorMessage);
      setError(errorMessage);
      setWeather(prev => ({ ...getDefaultWeather(), location: prev.location }));
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch weather using location string (geocodes then fetches weather)
  const fetchWeatherByLocationString = useCallback(async (locationString: string) => {
    console.log('🌤️ fetchWeatherByLocationString called:', { locationString });
    
    setIsLoading(true);
    setError(null);
    setLocation(locationString);

    try {
      // First geocode the location string to get coordinates
      const geocodeResult = await geocodeLocationString(locationString);
      
      if (!geocodeResult.isValid || !geocodeResult.coordinates) {
        throw new Error(geocodeResult.error || 'Failed to find location coordinates');
      }
      
      console.log('🗺️ Geocoding successful:', geocodeResult);
      
      // Then fetch weather using the coordinates
      const weatherData = await getWeatherByCoordinates(
        geocodeResult.coordinates.lat, 
        geocodeResult.coordinates.lon, 
        geocodeResult.formattedName || locationString
      );
      
      console.log('🌤️ Weather data received:', weatherData);
      
      // Check if we actually got real weather data
      if (weatherData.location === 'Mock Location' || weatherData.location === 'Error - Using Mock Data') {
        throw new Error('No weather data available for this location');
      }

      setWeather({
        ...weatherData,
        location: geocodeResult.formattedName || locationString,
      });

      // Save valid location for persistence
      AsyncStorage.setItem(STORAGE_KEY, geocodeResult.formattedName || locationString);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch weather';
      console.error('🌤️ Weather fetch error:', errorMessage, locationString);
      setError(errorMessage);
      setWeather(prev => ({ ...getDefaultWeather(), location: prev.location }));
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load saved location on mount (optional - for future use)
  const loadSavedLocation = useCallback(async () => {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved) {
        setLocation(saved);
      }
    } catch (error) {
      console.error('Failed to load saved location:', error);
    }
  }, []);

  return {
    location,
    weather,
    isLoading,
    hasError: !!error,
    errorMessage: error,
    isLocationValid: !error && weather.location !== 'Mock Location',
    currentTemp: weather.feelsLikeTemp,
    fetchWeatherByCoordinates,
    fetchWeatherByLocationString,
    loadSavedLocation,
  };
};