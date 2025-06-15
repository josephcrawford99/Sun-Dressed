import { Weather } from '@/types/weather';
import { useSettings } from '@/contexts/SettingsContext';
import { generatePackingListLLM } from '@services/llmService';
import { useCallback, useState } from 'react';
import { useWeatherForecast } from './useWeatherForecast';

export const usePackingList = (
  updateTripPackingList?: (tripId: string, packingList: string[]) => Promise<void>,
  updateTripWeatherForecast?: (tripId: string, weatherForecast: Weather[]) => Promise<void>
) => {
  const { settings } = useSettings();
  const [packingList, setPackingList] = useState<string[]>([]);
  const [weatherForecast, setWeatherForecast] = useState<Weather[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { fetchWeatherForecast } = useWeatherForecast();

  const generatePackingList = useCallback(async (location: string, startDate: Date, endDate: Date, tripId?: string) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🧳 Generating packing list for:', { location, startDate, endDate });
      
      let weatherArray: Weather[] = [];
      
      try {
        // Fetch real weather forecast data
        console.log('🌤️ Fetching weather forecast for packing list...');
        weatherArray = await fetchWeatherForecast(location, startDate, endDate);
        console.log('✅ Weather forecast obtained for packing list:', weatherArray.length, 'days');
      } catch (weatherError) {
        console.warn('⚠️ Failed to fetch weather forecast, proceeding without weather data:', weatherError);
        // Continue without weather data - the LLM can still generate a basic packing list
        weatherArray = [];
      }
      
      // Hook automatically includes user's style preference
      const newPackingList = await generatePackingListLLM(location, startDate, endDate, weatherArray, settings.stylePreference);
      setPackingList(newPackingList);
      setWeatherForecast(weatherArray);
      
      // Save to trip storage if tripId and update functions are provided
      if (tripId) {
        if (updateTripPackingList) {
          await updateTripPackingList(tripId, newPackingList);
          console.log('🧳 Packing list saved to trip storage');
        }
        if (updateTripWeatherForecast && weatherArray.length > 0) {
          await updateTripWeatherForecast(tripId, weatherArray);
          console.log('🌤️ Weather forecast saved to trip storage');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate packing list');
    } finally {
      setLoading(false);
    }
  }, [updateTripPackingList, updateTripWeatherForecast, fetchWeatherForecast, settings.stylePreference]);

  const setStoredPackingList = useCallback((storedList: string[]) => {
    setPackingList(storedList);
  }, []);

  const setStoredWeatherForecast = useCallback((storedForecast: Weather[]) => {
    setWeatherForecast(storedForecast);
  }, []);

  return { 
    packingList, 
    weatherForecast,
    loading, 
    error, 
    generatePackingList, 
    setStoredPackingList,
    setStoredWeatherForecast
  };
};