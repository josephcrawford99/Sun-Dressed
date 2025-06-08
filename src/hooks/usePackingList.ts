import { Weather, mockWeather } from '@/types/weather';
import { generatePackingListLLM } from '@services/llmService';
import { useCallback, useState } from 'react';

export const usePackingList = (updateTripPackingList?: (tripId: string, packingList: string[]) => Promise<void>) => {
  const [packingList, setPackingList] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generatePackingList = useCallback(async (location: string, startDate: Date, endDate: Date, tripId?: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Calculate trip days for mock weather array
      const tripDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      
      // Create mock weather array for each day of the trip
      const mockWeatherArray: Weather[] = Array(tripDays).fill(mockWeather);
      
      console.log('🧳 Generating packing list for:', { location, startDate, endDate, tripDays });
      
      const newPackingList = await generatePackingListLLM(location, startDate, endDate, mockWeatherArray);
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
  }, [updateTripPackingList]);

  const setStoredPackingList = useCallback((storedList: string[]) => {
    setPackingList(storedList);
  }, []);

  return { packingList, loading, error, generatePackingList, setStoredPackingList };
};