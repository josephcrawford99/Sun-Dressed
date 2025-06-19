import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { OutfitManager, OutfitContext, OutfitResult } from '@/services/outfit/OutfitManager';
import { Weather } from '@/types/weather';
import { Outfit } from '@/types/Outfit';
import { 
  getOutfitQueryKey, 
  getTimeUntilEndOfDay, 
  isPastDate,
  OUTFIT_CACHE_CONFIG 
} from '@/utils/cacheUtils';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Global outfit manager instance
let outfitManager: OutfitManager | null = null;

const getOutfitManager = (): OutfitManager => {
  if (!outfitManager) {
    outfitManager = new OutfitManager();
  }
  return outfitManager;
};

/**
 * Generate outfit using OutfitManager
 */
const generateOutfitForDate = async (
  date: Date,
  weather: Weather | null,
  activity: string,
  location: string
): Promise<OutfitResult> => {
  const manager = getOutfitManager();
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const targetDateOnly = new Date(date);
  targetDateOnly.setHours(0, 0, 0, 0);
  const daysDiff = Math.floor((targetDateOnly.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  const context: OutfitContext = {
    date,
    weather,
    activity,
    location,
    dateOffset: Math.max(-1, Math.min(1, daysDiff)) as -1 | 0 | 1
  };
  
  return manager.getOutfit(context);
};

/**
 * Check for "worn outfit" for past dates
 */
const getWornOutfitForDate = async (date: Date): Promise<Outfit | null> => {
  try {
    const dateString = date.toISOString().split('T')[0];
    const wornOutfitData = await AsyncStorage.getItem(`worn-outfit-${dateString}`);
    
    if (wornOutfitData) {
      const { outfit } = JSON.parse(wornOutfitData);
      return outfit;
    }
  } catch (error) {
    console.error('Error getting worn outfit:', error);
  }
  
  return null;
};

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
  
  return useQuery({
    queryKey,
    queryFn: async (): Promise<Outfit | null> => {
      // For past dates, try to get worn outfit first
      if (isDateInPast) {
        const wornOutfit = await getWornOutfitForDate(date);
        if (wornOutfit) {
          return wornOutfit;
        }
      }
      
      // Generate using OutfitManager (handles all caching internally)
      const result = await generateOutfitForDate(date, weather, activity, location);
      return result.outfit;
    },
    staleTime: isDateInPast 
      ? Infinity // Past outfits never go stale
      : getTimeUntilEndOfDay(date), // Today's outfit fresh until midnight
    enabled: !!(location && (weather || isDateInPast)), // Only run when we have required data
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
      
      // Store as "worn outfit" in AsyncStorage
      const wornOutfitData = {
        outfit,
        location,
        timestamp: Date.now()
      };
      
      await AsyncStorage.setItem(
        `worn-outfit-${dateString}`,
        JSON.stringify(wornOutfitData)
      );
      
      // Invalidate outfit queries for this date to ensure fresh data shows worn outfit
      queryClient.invalidateQueries({
        queryKey: ['outfit', dateString],
        exact: false
      });
    },
    onError: (error) => {
      console.error('Error logging worn outfit:', error);
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
      const manager = getOutfitManager();
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const targetDateOnly = new Date(date);
      targetDateOnly.setHours(0, 0, 0, 0);
      const daysDiff = Math.floor((targetDateOnly.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      const context: OutfitContext = {
        date,
        weather,
        activity,
        location,
        dateOffset: Math.max(-1, Math.min(1, daysDiff)) as -1 | 0 | 1
      };
      
      // Force regeneration
      const result = await manager.forceRegenerate(context);
      return result.outfit;
    },
    onSuccess: (newOutfit, variables) => {
      // Update cache with new outfit
      const queryKey = getOutfitQueryKey(variables.date, variables.location, variables.activity);
      queryClient.setQueryData(queryKey, newOutfit);
    },
    onError: (error) => {
      console.error('Error regenerating outfit:', error);
    }
  });
};