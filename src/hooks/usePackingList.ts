import { Weather } from '@/types/weather';
import { useSettings } from '@/contexts/SettingsContext';
import { generatePackingListLLM } from '@services/llmService';
import { useCallback, useState } from 'react';
import { useWeatherForecast } from './useWeatherForecast';
import { 
  usePackingDataQuery, 
  usePackingListMutation, 
  useWeatherForecastMutation 
} from './queries/usePackingListQuery';

// TypeScript interface for the hook return type
interface UsePackingListReturn {
  packingList: string[];
  weatherForecast: Weather[];
  loading: boolean;
  error: string | null;
  generatePackingList: (location: string, startDate: Date, endDate: Date, currentTripId?: string) => Promise<void>;
  refetch: () => void;
}

export const usePackingList = (
  tripId?: string,
  startDate?: Date,
  endDate?: Date
): UsePackingListReturn => {
  const { settings } = useSettings();
  
  // Use dependent query pattern - only query if we have valid trip data
  const packingDataQuery = usePackingDataQuery(
    tripId || null, 
    startDate, 
    endDate
  );
  const packingListMutation = usePackingListMutation();
  const weatherForecastMutation = useWeatherForecastMutation();
  
  // Local state for generation process
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const { fetchWeatherForecast } = useWeatherForecast();
  
  // Combine TanStack Query loading states with generation state
  const loading = packingDataQuery.isLoading || isGenerating;
  const error = generationError || (packingDataQuery.error as Error)?.message || null;
  
  // Get data from TanStack Query
  const packingList = packingDataQuery.packingList;
  const weatherForecast = packingDataQuery.weatherForecast;

  const generatePackingList = useCallback(async (location: string, startDate: Date, endDate: Date, currentTripId?: string) => {
    setIsGenerating(true);
    setGenerationError(null);
    
    try {
      let weatherArray: Weather[] = [];
      
      try {
        // Fetch real weather forecast data
        weatherArray = await fetchWeatherForecast(location, startDate, endDate);
      } catch {
        // Failed to fetch weather forecast, proceeding without weather data
        // Continue without weather data - the LLM can still generate a basic packing list
        weatherArray = [];
      }
      
      // Hook automatically includes user's style preference
      const newPackingList = await generatePackingListLLM(location, startDate, endDate, weatherArray, settings.stylePreference);
      
      // Use the passed tripId or the hook's tripId
      const targetTripId = currentTripId || tripId;
      
      if (targetTripId) {
        // Save using TanStack Query mutations for better state management
        await packingListMutation.mutateAsync({
          tripId: targetTripId,
          packingList: newPackingList,
          startDate,
          endDate,
        });
        
        if (weatherArray.length > 0) {
          await weatherForecastMutation.mutateAsync({
            tripId: targetTripId,
            weatherForecast: weatherArray,
            location,
            startDate,
            endDate,
          });
        }
        
        // Trip storage is now handled entirely by TanStack Query
      }
    } catch (err) {
      setGenerationError(err instanceof Error ? err.message : 'Failed to generate packing list');
    } finally {
      setIsGenerating(false);
    }
  }, [tripId, fetchWeatherForecast, settings.stylePreference, packingListMutation, weatherForecastMutation]);


  // Explicitly return all properties to match the interface
  const result: UsePackingListReturn = {
    packingList, 
    weatherForecast,
    loading, 
    error, 
    generatePackingList, 
    refetch: packingDataQuery.refetch
  };

  return result;
};