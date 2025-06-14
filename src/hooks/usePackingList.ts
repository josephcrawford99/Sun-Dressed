import { Weather } from '@/types/weather';
import { generatePackingListLLM } from '@services/llmService';
import { useCallback, useState } from 'react';
import { useWeatherForecast } from './useWeatherForecast';

export const usePackingList = (updateTripPackingList?: (tripId: string, packingList: string[]) => Promise<void>) => {
  const [packingList, setPackingList] = useState<string[]>([]);
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
      
      const newPackingList = await generatePackingListLLM(location, startDate, endDate, weatherArray);
      setPackingList(newPackingList);
      
      // Save to trip storage if tripId and update function are provided
      if (tripId && updateTripPackingList) {
        await updateTripPackingList(tripId, newPackingList);
        console.log('🧳 Packing list saved to trip storage');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate packing list');
    } finally {
      setLoading(false);
    }
  }, [updateTripPackingList, fetchWeatherForecast]);

  const setStoredPackingList = useCallback((storedList: string[]) => {
    setPackingList(storedList);
  }, []);

  return { packingList, loading, error, generatePackingList, setStoredPackingList };
};