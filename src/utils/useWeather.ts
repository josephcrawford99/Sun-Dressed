import { useState, useEffect } from 'react';

export interface WeatherData {
  temperature: number;
  feels_like: number;
  humidity: number;
  wind_speed: number;
  description: string;
  icon: string;
  clouds: number;
}

interface UseWeatherReturn {
  weatherData: WeatherData | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

// Mock weather data for Phase 1
const mockWeatherData: WeatherData = {
  temperature: 22,
  feels_like: 24,
  humidity: 65,
  wind_speed: 3.5,
  description: 'Partly cloudy',
  icon: '02d',
  clouds: 30
};

export const useWeather = (location: string): UseWeatherReturn => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In Phase 1, we'll just use mock data
      // In later phases, this will connect to a real weather API
      setTimeout(() => {
        setWeatherData(mockWeatherData);
        setIsLoading(false);
      }, 1000);
    } catch (err) {
      console.error('Error fetching weather:', err);
      setError('Failed to fetch weather data');
      setIsLoading(false);
    }
  };

  // Fetch weather when location changes
  useEffect(() => {
    fetchWeather();
  }, [location]);

  return { weatherData, isLoading, error, refetch: fetchWeather };
};