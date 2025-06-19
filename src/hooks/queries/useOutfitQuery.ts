import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Weather } from '@/types/weather';
import { Outfit } from '@/types/Outfit';
import { 
  getOutfitQueryKey, 
  getTimeUntilEndOfDay, 
  isPastDate,
  OUTFIT_CACHE_CONFIG 
} from '@/utils/cacheUtils';
import { generateOutfitLLM } from '@/services/llmService';
import { SettingsService } from '@/services/settingsService';

/**
 * Main outfit query hook with smart caching
 */
export const useOutfitQuery = (
  date: Date,
  location: string,
  activity: string,
  weather: Weather | null
) => {
  const queryKey = getOutfitQueryKey(date, location, activity);
  const isDateInPast = isPastDate(date);
  const queryClient = useQueryClient();
  
  return useQuery({
    queryKey,
    queryFn: async (): Promise<Outfit | null> => {
      // For past dates, check if we have a worn outfit stored
      if (isDateInPast) {
        const dateString = date.toISOString().split('T')[0];
        const wornOutfit = queryClient.getQueryData(['worn-outfit', dateString]) as Outfit | undefined;
        if (wornOutfit) {
          return wornOutfit;
        }
        // No worn outfit for past date, return null
        return null;
      }
      
      // For current/future dates, check if we already have a cached outfit
      // TanStack Query will automatically check its cache first, but we can also
      // check if we have the data without triggering network requests
      const existingOutfit = queryClient.getQueryData(queryKey) as Outfit | undefined;
      if (existingOutfit) {
        return existingOutfit;
      }
      
      // No cached outfit exists, need to generate new one
      // But we need weather data to generate
      if (!weather) {
        // Return null and query will re-run when weather becomes available
        return null;
      }
      
      // Generate new outfit using LLM
      const settings = await SettingsService.loadSettings();
      const outfit = await generateOutfitLLM(
        weather,
        activity,
        settings.stylePreference
      );
      
      return outfit;
    },
    staleTime: isDateInPast 
      ? Infinity // Past outfits never go stale
      : getTimeUntilEndOfDay(date), // Today's outfit fresh until midnight
    enabled: !!location, // Always enabled when we have location - check cache first, weather when needed
    ...OUTFIT_CACHE_CONFIG,
  });
};

/**
 * Hook for tracking daily "worn" outfits
 */
export const useDailyOutfitLogger = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      date, 
      outfit, 
      location 
    }: { 
      date: Date; 
      outfit: Outfit; 
      location: string; 
    }) => {
      const dateString = date.toISOString().split('T')[0];
      
      // Store as worn outfit in TanStack Query cache
      queryClient.setQueryData(['worn-outfit', dateString], outfit);
      
      // Invalidate outfit queries for this date to ensure fresh data shows worn outfit
      queryClient.invalidateQueries({
        queryKey: ['outfit', dateString],
        exact: false
      });
      
      return { date, outfit, location };
    },
    onError: (error) => {
      // Error logging worn outfit - handled by TanStack Query
    }
  });
};

/**
 * Hook for manually regenerating outfits (force refresh)
 */
export const useOutfitRegeneration = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({
      date,
      location,
      activity,
      weather
    }: {
      date: Date;
      location: string;
      activity: string;
      weather: Weather;
    }) => {
      // Generate new outfit using LLM directly
      const settings = await SettingsService.loadSettings();
      const outfit = await generateOutfitLLM(
        weather,
        activity,
        settings.stylePreference
      );
      
      return outfit;
    },
    onSuccess: (newOutfit, variables) => {
      // Update cache with new outfit
      const queryKey = getOutfitQueryKey(variables.date, variables.location, variables.activity);
      queryClient.setQueryData(queryKey, newOutfit);
      
      // Also invalidate the query to ensure UI updates
      queryClient.invalidateQueries({
        queryKey,
        exact: true
      });
    },
    onError: (error) => {
      // Error regenerating outfit - handled by TanStack Query
    }
  });
};