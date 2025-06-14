import { useState, useCallback } from 'react';
import { Weather } from '@/types/weather';
import { geocodeService } from '@/services/geocodeService';
import { weatherService } from '@/services/weatherService';

interface UseWeatherForecastReturn {
  weatherForecast: Weather[];
  loading: boolean;
  error: string | null;
  fetchWeatherForecast: (location: string, startDate: Date, endDate: Date) => Promise<Weather[]>;
}

export const useWeatherForecast = (): UseWeatherForecastReturn => {
  const [weatherForecast, setWeatherForecast] = useState<Weather[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeatherForecast = useCallback(async (
    location: string, 
    startDate: Date, 
    endDate: Date
  ): Promise<Weather[]> => {
    if (!location?.trim()) {
      throw new Error('Location is required');
    }

    if (!startDate || !endDate) {
      throw new Error('Start date and end date are required');
    }

    if (startDate > endDate) {
      throw new Error('Start date must be before end date');
    }

    setLoading(true);
    setError(null);

    try {
      console.log('🌤️ Fetching weather forecast for trip:', { location, startDate, endDate });

      // Calculate trip duration in days
      const tripDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      
      // Limit to API maximum of 8 days
      const forecastDays = Math.min(tripDays, 8);
      
      console.log('📅 Trip duration:', { tripDays, forecastDays });

      // Step 1: Convert location string to coordinates using geocodeService
      console.log('📍 Geocoding location:', location);
      const coordinates = await geocodeService.geocode(location);
      console.log('✅ Coordinates obtained:', coordinates);

      // Step 2: Fetch weather forecast using weatherService
      console.log('🌍 Fetching weather forecast for coordinates:', { 
        lat: coordinates.lat, 
        lon: coordinates.lon, 
        days: forecastDays 
      });
      
      const forecast = await weatherService.fetchForecastByCoordinates(
        coordinates.lat,
        coordinates.lon,
        forecastDays
      );

      console.log('✅ Weather forecast fetched successfully:', { 
        forecastLength: forecast.length,
        forecast 
      });

      setWeatherForecast(forecast);
      return forecast;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch weather forecast';
      console.error('❌ Weather forecast error:', err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    weatherForecast,
    loading,
    error,
    fetchWeatherForecast
  };
};