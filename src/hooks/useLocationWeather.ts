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
  const [coordinates, setCoordinates] = useState<{ lat: number; lon: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Create display-ready weather object with user's preferred units
  const createWeatherDisplay = useCallback((weatherData: Weather, coordinates?: { lat: number; lon: number }): WeatherDisplay => {
    const tempSymbol = getTemperatureSymbol(settings.temperatureUnit);
    const speedSymbol = getSpeedSymbol(settings.speedUnit);

    return {
      ...weatherData,
      displayTemp: {
        feelsLike: `${convertTemperature(weatherData.feelsLikeTemp, settings.temperatureUnit)}${tempSymbol}`,
        high: `${convertTemperature(weatherData.dailyHighTemp, settings.temperatureUnit)}${tempSymbol}`,
        low: `${convertTemperature(weatherData.dailyLowTemp, settings.temperatureUnit)}${tempSymbol}`,
        current: `${convertTemperature(weatherData.currentTemp, settings.temperatureUnit)}${tempSymbol}`
      },
      displayWind: {
        speed: `${convertSpeed(weatherData.windiness, settings.speedUnit)}`,
        unit: speedSymbol
      },
      temperatureUnit: tempSymbol,
      coordinates
    };
  }, [settings.temperatureUnit, settings.speedUnit]);

  const fetchWeatherByLocationString = useCallback(async (
    locationString: string, 
    coordinates?: { lat: number; lon: number }
  ) => {
    if (!locationString?.trim()) {
      // Empty location string provided
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      
      let finalCoordinates;
      
      if (coordinates) {
        // Use coordinates from Google Places if available
        finalCoordinates = coordinates;
      } else {
        // Fallback to geocoding service
        finalCoordinates = await geocodeService.geocode(locationString);
      }
      
      // Fetch weather data using coordinates
      const weatherData = await weatherService.fetchWeatherByCoordinates(
        finalCoordinates.lat, 
        finalCoordinates.lon
      );
      
      setWeather(weatherData);
      setCoordinates(finalCoordinates);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      // Weather fetch failed, error will be thrown
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearWeather = useCallback(() => {
    setWeather(null);
    setCoordinates(null);
    setError(null);
  }, []);

  // Create weatherDisplay whenever weather changes
  const weatherDisplay = weather ? createWeatherDisplay(weather, coordinates || undefined) : null;

  return {
    weather,
    weatherDisplay,
    isLoading,
    error,
    fetchWeatherByLocationString,
    clearWeather
  };
}