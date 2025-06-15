import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PackingListQueryService } from '@/services/packingListQueryService';
import { Weather } from '@/types/weather';

// Query key factories for consistent cache management
export const packingListKeys = {
  all: ['packingList'] as const,
  list: (tripId: string) => ['packingList', tripId] as const,
  weather: (tripId: string) => ['weatherForecast', tripId] as const,
};

/**
 * Hook to fetch packing list data for a specific trip
 */
export function usePackingListQuery(tripId: string | null) {
  return useQuery({
    queryKey: packingListKeys.list(tripId || ''),
    queryFn: () => {
      if (!tripId) {
        return Promise.resolve(null);
      }
      return PackingListQueryService.getPackingList(tripId);
    },
    enabled: !!tripId, // Only run query if tripId exists
    staleTime: Infinity, // Local storage data doesn't go stale automatically
    gcTime: 1000 * 60 * 60 * 24, // Keep in memory for 24 hours
  });
}

/**
 * Hook to fetch weather forecast data for a specific trip
 */
export function useWeatherForecastQuery(tripId: string | null) {
  return useQuery({
    queryKey: packingListKeys.weather(tripId || ''),
    queryFn: () => {
      if (!tripId) {
        return Promise.resolve(null);
      }
      return PackingListQueryService.getWeatherForecast(tripId);
    },
    enabled: !!tripId, // Only run query if tripId exists
    staleTime: 1000 * 60 * 5, // Weather data can be stale after 5 minutes
    gcTime: 1000 * 60 * 60 * 24, // Keep in memory for 24 hours
  });
}

/**
 * Mutation hook to save or update packing list data
 */
export function usePackingListMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ tripId, packingList }: { tripId: string; packingList: string[] }) => {
      // Check if packing list already exists to determine save vs update
      const existing = await PackingListQueryService.getPackingList(tripId);
      
      if (existing) {
        return PackingListQueryService.updatePackingList(tripId, packingList);
      } else {
        return PackingListQueryService.savePackingList(tripId, packingList);
      }
    },
    onSuccess: (data, variables) => {
      // Update the cache with the new data
      queryClient.setQueryData(packingListKeys.list(variables.tripId), data);
      
      // Optionally invalidate related queries to refetch
      queryClient.invalidateQueries({
        queryKey: packingListKeys.all,
      });
      
    },
    onError: (error, variables) => {
      // Error is handled by TanStack Query's error state
      // UI components can access error through mutation.error
    },
  });
}

/**
 * Mutation hook to save or update weather forecast data
 */
export function useWeatherForecastMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      tripId, 
      weatherForecast, 
      location 
    }: { 
      tripId: string; 
      weatherForecast: Weather[]; 
      location: string; 
    }) => {
      // Check if weather forecast already exists to determine save vs update
      const existing = await PackingListQueryService.getWeatherForecast(tripId);
      
      if (existing) {
        return PackingListQueryService.updateWeatherForecast(tripId, weatherForecast, location);
      } else {
        return PackingListQueryService.saveWeatherForecast(tripId, weatherForecast, location);
      }
    },
    onSuccess: (data, variables) => {
      // Update the cache with the new data
      queryClient.setQueryData(packingListKeys.weather(variables.tripId), data);
      
      // Optionally invalidate related queries
      queryClient.invalidateQueries({
        queryKey: ['weatherForecast'],
      });
      
    },
    onError: (error, variables) => {
      // Error is handled by TanStack Query's error state
    },
  });
}

/**
 * Mutation hook to delete packing list data
 */
export function useDeletePackingListMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tripId: string) => {
      return PackingListQueryService.deletePackingList(tripId);
    },
    onSuccess: (_, tripId) => {
      // Remove the data from cache
      queryClient.removeQueries({
        queryKey: packingListKeys.list(tripId),
      });
      
    },
    onError: (error) => {
      // Error is handled by TanStack Query's error state
    },
  });
}

/**
 * Mutation hook to delete weather forecast data
 */
export function useDeleteWeatherForecastMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tripId: string) => {
      return PackingListQueryService.deleteWeatherForecast(tripId);
    },
    onSuccess: (_, tripId) => {
      // Remove the data from cache
      queryClient.removeQueries({
        queryKey: packingListKeys.weather(tripId),
      });
      
    },
    onError: (error) => {
      // Error is handled by TanStack Query's error state
    },
  });
}

/**
 * Hook to get combined packing list and weather data
 * Useful for components that need both datasets
 */
export function usePackingDataQuery(tripId: string | null) {
  const packingListQuery = usePackingListQuery(tripId);
  const weatherForecastQuery = useWeatherForecastQuery(tripId);

  return {
    packingList: packingListQuery.data?.packingList || [],
    weatherForecast: weatherForecastQuery.data?.weatherForecast || [],
    isLoading: packingListQuery.isLoading || weatherForecastQuery.isLoading,
    error: packingListQuery.error || weatherForecastQuery.error,
    isPackingListLoading: packingListQuery.isLoading,
    isWeatherLoading: weatherForecastQuery.isLoading,
    refetch: () => {
      packingListQuery.refetch();
      weatherForecastQuery.refetch();
    },
  };
}