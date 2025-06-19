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
      // Step 1: Convert location string to coordinates using geocodeService
      const coordinates = await geocodeService.geocode(location);

      // Step 2: Fetch weather forecast for actual trip dates using the new smart method
      const forecast = await weatherService.fetchForecastForTripDates(
        coordinates.lat,
        coordinates.lon,
        startDate,
        endDate
      );

      setWeatherForecast(forecast);
      return forecast;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch weather forecast';
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