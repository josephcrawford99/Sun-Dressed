import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PackingListQueryService } from '@/services/packingListQueryService';
import { Weather } from '@/types/weather';

// Query key factories for consistent cache management
export const packingListKeys = {
  all: ['packingList'] as const,
  list: (tripId: string, startDate?: string, endDate?: string) => {
    if (startDate && endDate) {
      return ['packingList', tripId, startDate, endDate] as const;
    }
    return ['packingList', tripId] as const;
  },
  weather: (tripId: string, startDate?: string, endDate?: string) => {
    if (startDate && endDate) {
      return ['weatherForecast', tripId, startDate, endDate] as const;
    }
    return ['weatherForecast', tripId] as const;
  },
};

/**
 * Hook to fetch packing list data for a specific trip
 */
export function usePackingListQuery(tripId: string | null, startDate?: Date, endDate?: Date) {
  const startDateStr = startDate?.toISOString().split('T')[0];
  const endDateStr = endDate?.toISOString().split('T')[0];
  
  return useQuery({
    queryKey: packingListKeys.list(tripId || '', startDateStr, endDateStr),
    queryFn: () => {
      if (!tripId) {
        return Promise.resolve(null);
      }
      return PackingListQueryService.getPackingList(tripId);
    },
    enabled: !!tripId, // Only run query if tripId exists
    staleTime: Infinity, // Prevent automatic refetching to minimize API costs
    gcTime: 1000 * 60 * 60 * 24 * 7, // Keep in memory for 1 week
    refetchOnMount: false, // Don't refetch when component mounts
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchOnReconnect: false, // Don't refetch on network reconnect
  });
}

/**
 * Hook to fetch weather forecast data for a specific trip
 */
export function useWeatherForecastQuery(tripId: string | null, startDate?: Date, endDate?: Date) {
  const startDateStr = startDate?.toISOString().split('T')[0];
  const endDateStr = endDate?.toISOString().split('T')[0];
  
  return useQuery({
    queryKey: packingListKeys.weather(tripId || '', startDateStr, endDateStr),
    queryFn: () => {
      if (!tripId) {
        return Promise.resolve(null);
      }
      return PackingListQueryService.getWeatherForecast(tripId);
    },
    enabled: !!tripId, // Only run query if tripId exists
    staleTime: Infinity, // Prevent automatic refetching to minimize API costs
    gcTime: 1000 * 60 * 60 * 24 * 7, // Keep in memory for 1 week
    refetchOnMount: false, // Don't refetch when component mounts
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchOnReconnect: false, // Don't refetch on network reconnect
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
      // Update the cache with the new data (invalidate all variations for this trip)
      queryClient.invalidateQueries({
        queryKey: ['packingList', variables.tripId],
        exact: false, // Invalidate all date variations
      });
      
      // Set the new data for future queries
      queryClient.setQueryData(packingListKeys.list(variables.tripId), data);
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
      // Update the cache with the new data (invalidate all variations for this trip)
      queryClient.invalidateQueries({
        queryKey: ['weatherForecast', variables.tripId],
        exact: false, // Invalidate all date variations
      });
      
      // Set the new data for future queries
      queryClient.setQueryData(packingListKeys.weather(variables.tripId), data);
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
      // Remove all variations of the data from cache
      queryClient.removeQueries({
        queryKey: ['packingList', tripId],
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
      // Remove all variations of the data from cache
      queryClient.removeQueries({
        queryKey: ['weatherForecast', tripId],
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
export function usePackingDataQuery(tripId: string | null, startDate?: Date, endDate?: Date) {
  const packingListQuery = usePackingListQuery(tripId, startDate, endDate);
  const weatherForecastQuery = useWeatherForecastQuery(tripId, startDate, endDate);

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