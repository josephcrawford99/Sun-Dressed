import { useState, useCallback } from 'react';
import { geocodeService } from '@services/geocodeService';
import { weatherService } from '@services/weatherService';
import { Weather, WeatherDisplay } from '@/types/weather';
import { useSettings } from '@/contexts/SettingsContext';
import { convertTemperature, convertSpeed, getTemperatureSymbol, getSpeedSymbol } from '@/utils/unitConversions';

interface UseLocationWeatherReturn {
  weather: Weather | null;
  weatherDisplay: WeatherDisplay | null;
  isLoading: boolean;
  error: string | null;
  fetchWeatherByLocationString: (locationString: string, coordinates?: { lat: number; lon: number }) => Promise<void>;
  clearWeather: () => void;
}

export function useLocationWeather(): UseLocationWeatherReturn {
  const { settings } = useSettings();
  const [weather, setWeather] = useState<Weather | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Create display-ready weather object with user's preferred units
  const createWeatherDisplay = useCallback((weatherData: Weather): WeatherDisplay => {
    const tempSymbol = getTemperatureSymbol(settings.temperatureUnit);
    const speedSymbol = getSpeedSymbol(settings.speedUnit);

    return {
      ...weatherData,
      displayTemp: {
        feelsLike: `${convertTemperature(weatherData.feelsLikeTemp, settings.temperatureUnit)}${tempSymbol}`,
        high: `${convertTemperature(weatherData.dailyHighTemp, settings.temperatureUnit)}${tempSymbol}`,
        low: `${convertTemperature(weatherData.dailyLowTemp, settings.temperatureUnit)}${tempSymbol}`,
        current: `${convertTemperature(weatherData.feelsLikeTemp, settings.temperatureUnit)}${tempSymbol}`
      },
      displayWind: {
        speed: `${convertSpeed(weatherData.windiness, settings.speedUnit)}`,
        unit: speedSymbol
      },
      temperatureUnit: tempSymbol
    };
  }, [settings.temperatureUnit, settings.speedUnit]);

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

  // Create weatherDisplay whenever weather changes
  const weatherDisplay = weather ? createWeatherDisplay(weather) : null;

  return {
    weather,
    weatherDisplay,
    isLoading,
    error,
    fetchWeatherByLocationString,
    clearWeather
  };
}