import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TripsQueryService } from '@/services/tripsQueryService';
import { Trip } from '@/types/trip';
import { Weather } from '@/types/weather';

// Query key factories for consistent cache management
export const tripsKeys = {
  all: ['trips'] as const,
  lists: () => [...tripsKeys.all, 'list'] as const,
  list: () => [...tripsKeys.lists()] as const,
  details: () => [...tripsKeys.all, 'detail'] as const,
  detail: (id: string) => [...tripsKeys.details(), id] as const,
};

/**
 * Hook to fetch all trips
 */
export function useTripsQuery() {
  return useQuery({
    queryKey: tripsKeys.list(),
    queryFn: () => TripsQueryService.getTrips(),
    staleTime: Infinity, // Local storage data doesn't go stale automatically
    gcTime: 1000 * 60 * 60 * 24, // Keep in memory for 24 hours
  });
}

/**
 * Mutation hook to add a new trip
 */
export function useAddTripMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (trip: Trip) => TripsQueryService.addTrip(trip),
    onSuccess: (newTrip) => {
      // Update the cache by adding the new trip to the existing list
      queryClient.setQueryData(tripsKeys.list(), (oldTrips: Trip[] = []) => {
        return [...oldTrips, newTrip];
      });
      
      // Invalidate queries to refetch if needed
      queryClient.invalidateQueries({
        queryKey: tripsKeys.all,
      });
    },
    onError: (error) => {
      // Error is handled by TanStack Query's error state
    },
  });
}

/**
 * Mutation hook to update an existing trip
 */
export function useUpdateTripMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (trip: Trip) => TripsQueryService.updateTrip(trip),
    onSuccess: (updatedTrip) => {
      // Update the cache by replacing the updated trip in the list
      queryClient.setQueryData(tripsKeys.list(), (oldTrips: Trip[] = []) => {
        return oldTrips.map(trip => 
          trip.id === updatedTrip.id ? updatedTrip : trip
        );
      });
      
      // Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: tripsKeys.all,
      });
    },
    onError: (error) => {
      // Error is handled by TanStack Query's error state
    },
  });
}

/**
 * Mutation hook to delete a trip
 */
export function useDeleteTripMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tripId: string) => TripsQueryService.deleteTrip(tripId),
    onSuccess: (_, deletedTripId) => {
      // Update the cache by removing the deleted trip from the list
      queryClient.setQueryData(tripsKeys.list(), (oldTrips: Trip[] = []) => {
        return oldTrips.filter(trip => trip.id !== deletedTripId);
      });
      
      // Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: tripsKeys.all,
      });
    },
    onError: (error) => {
      // Error is handled by TanStack Query's error state
    },
  });
}

/**
 * Mutation hook to clear all trips
 */
export function useClearAllTripsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => TripsQueryService.clearAllTrips(),
    onSuccess: () => {
      // Update the cache to empty array
      queryClient.setQueryData(tripsKeys.list(), []);
      
      // Invalidate all trip-related queries
      queryClient.invalidateQueries({
        queryKey: tripsKeys.all,
      });
    },
    onError: (error) => {
      // Error is handled by TanStack Query's error state
    },
  });
}

/**
 * Mutation hook to update a trip's packing list
 */
export function useUpdateTripPackingListMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ tripId, packingList }: { tripId: string; packingList: string[] }) => {
      const trips = await TripsQueryService.getTrips();
      const trip = trips.find(t => t.id === tripId);
      
      if (!trip) {
        throw new Error('Trip not found');
      }
      
      const updatedTrip: Trip = {
        ...trip,
        packingList,
        updatedAt: new Date(),
      };
      
      return TripsQueryService.updateTrip(updatedTrip);
    },
    onSuccess: (updatedTrip) => {
      // Update the cache
      queryClient.setQueryData(tripsKeys.list(), (oldTrips: Trip[] = []) => {
        return oldTrips.map(trip => 
          trip.id === updatedTrip.id ? updatedTrip : trip
        );
      });
    },
    onError: (error) => {
      // Error is handled by TanStack Query's error state
    },
  });
}

/**
 * Mutation hook to update a trip's weather forecast
 */
export function useUpdateTripWeatherForecastMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ tripId, weatherForecast }: { tripId: string; weatherForecast: Weather[] }) => {
      const trips = await TripsQueryService.getTrips();
      const trip = trips.find(t => t.id === tripId);
      
      if (!trip) {
        throw new Error('Trip not found');
      }
      
      const updatedTrip: Trip = {
        ...trip,
        weatherForecast,
        updatedAt: new Date(),
      };
      
      return TripsQueryService.updateTrip(updatedTrip);
    },
    onSuccess: (updatedTrip) => {
      // Update the cache
      queryClient.setQueryData(tripsKeys.list(), (oldTrips: Trip[] = []) => {
        return oldTrips.map(trip => 
          trip.id === updatedTrip.id ? updatedTrip : trip
        );
      });
    },
    onError: (error) => {
      // Error is handled by TanStack Query's error state
    },
  });
}