import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
      // Return null for new queries - they will be populated via mutations
      return Promise.resolve(null);
    },
    // Enable query when we have tripId AND both dates (dependent query pattern)
    enabled: !!tripId && !!startDate && !!endDate,
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
      // Return null for new queries - they will be populated via mutations
      return Promise.resolve(null);
    },
    // Enable query when we have tripId AND both dates (dependent query pattern)
    enabled: !!tripId && !!startDate && !!endDate,
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
    mutationFn: async ({ 
      tripId, 
      packingList, 
      startDate, 
      endDate 
    }: { 
      tripId: string; 
      packingList: string[]; 
      startDate: Date; 
      endDate: Date; 
    }) => {
      // Return the packing list data directly
      return { packingList };
    },
    onSuccess: (data, variables) => {
      const startDateStr = variables.startDate.toISOString().split('T')[0];
      const endDateStr = variables.endDate.toISOString().split('T')[0];
      
      // Set the data directly in TanStack Query cache
      queryClient.setQueryData(
        packingListKeys.list(variables.tripId, startDateStr, endDateStr), 
        data
      );
    },
    onError: () => {
      // Error is handled by TanStack Query's error state
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
      location,
      startDate,
      endDate
    }: { 
      tripId: string; 
      weatherForecast: Weather[]; 
      location: string;
      startDate: Date;
      endDate: Date;
    }) => {
      // Return the weather forecast data directly
      return { weatherForecast, location };
    },
    onSuccess: (data, variables) => {
      const startDateStr = variables.startDate.toISOString().split('T')[0];
      const endDateStr = variables.endDate.toISOString().split('T')[0];
      
      // Set the data directly in TanStack Query cache
      queryClient.setQueryData(
        packingListKeys.weather(variables.tripId, startDateStr, endDateStr), 
        data
      );
    },
    onError: () => {
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
      // No async operation needed - just return success
      return Promise.resolve();
    },
    onSuccess: (_, tripId) => {
      // Remove all variations of the data from cache
      queryClient.removeQueries({
        queryKey: ['packingList', tripId],
      });
    },
    onError: () => {
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
      // No async operation needed - just return success
      return Promise.resolve();
    },
    onSuccess: (_, tripId) => {
      // Remove all variations of the data from cache
      queryClient.removeQueries({
        queryKey: ['weatherForecast', tripId],
      });
    },
    onError: () => {
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