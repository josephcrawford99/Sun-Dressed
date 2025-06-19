import { useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { geocodeService } from '@services/geocodeService';
import { weatherService } from '@services/weatherService';
import { Weather, WeatherDisplay } from '@/types/weather';
import { useSettings } from '@/contexts/SettingsContext';
import { convertTemperature, convertSpeed, getTemperatureSymbol, getSpeedSymbol } from '@/utils/unitConversions';
import { DateOffset } from '@components/CalendarBar';

interface UseLocationWeatherReturn {
  weather: Weather | null;
  weatherDisplay: WeatherDisplay | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useLocationWeather(
  location: string,
  dateOffset: DateOffset = 0,
  coordinates?: { lat: number; lon: number }
): UseLocationWeatherReturn {
  const { settings } = useSettings();

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

  // TanStack Query for reactive weather fetching
  const {
    data: weather,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['weather', location, dateOffset],
    queryFn: async (): Promise<Weather> => {
      if (!location?.trim()) {
        throw new Error('Location is required');
      }

      let finalCoordinates;
      
      if (coordinates) {
        finalCoordinates = coordinates;
      } else {
        finalCoordinates = await geocodeService.geocode(location);
      }
      
      let weatherData: Weather;
      
      if (dateOffset === 0) {
        // Today - use current weather
        weatherData = await weatherService.fetchWeatherByCoordinates(
          finalCoordinates.lat, 
          finalCoordinates.lon
        );
      } else if (dateOffset === 1) {
        // Tomorrow - fetch 2-day forecast and take tomorrow's weather
        const forecast = await weatherService.fetchForecastByCoordinates(
          finalCoordinates.lat,
          finalCoordinates.lon,
          2
        );
        weatherData = forecast[1]; // Index 1 is tomorrow
      } else {
        // Yesterday (dateOffset === -1) - use current weather as fallback
        weatherData = await weatherService.fetchWeatherByCoordinates(
          finalCoordinates.lat, 
          finalCoordinates.lon
        );
      }
      
      return weatherData;
    },
    enabled: !!location?.trim(),
    staleTime: dateOffset === 0 ? 5 * 60 * 1000 : 6 * 60 * 60 * 1000, // Today: 5min, others: 6 hours
    gcTime: 60 * 60 * 1000, // 1 hour
    retry: 2
  });

  // Create weatherDisplay whenever weather changes
  const weatherDisplay = useMemo(() => {
    return weather && coordinates ? createWeatherDisplay(weather, coordinates) : weather ? createWeatherDisplay(weather) : null;
  }, [weather, coordinates, createWeatherDisplay]);

  return {
    weather: weather || null,
    weatherDisplay,
    isLoading,
    error: error?.message || null,
    refetch
  };
}