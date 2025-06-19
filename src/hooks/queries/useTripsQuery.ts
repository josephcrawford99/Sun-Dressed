import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TripsQueryService } from '@/services/tripsQueryService';
import { Trip } from '@/types/trip';
import { Weather } from '@/types/weather';

// Helper function to check if trip dates have changed
const hasDateChanged = (oldTrip: Trip | undefined, newTrip: Trip): boolean => {
  if (!oldTrip) return false;
  
  const oldStart = new Date(oldTrip.startDate).getTime();
  const oldEnd = new Date(oldTrip.endDate).getTime();
  const newStart = new Date(newTrip.startDate).getTime();
  const newEnd = new Date(newTrip.endDate).getTime();
  
  return oldStart !== newStart || oldEnd !== newEnd;
};

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
      // Get the old trip data to compare dates
      const oldTrips = queryClient.getQueryData<Trip[]>(tripsKeys.list()) || [];
      const oldTrip = oldTrips.find(t => t.id === updatedTrip.id);
      
      // Check if dates have changed
      const datesChanged = hasDateChanged(oldTrip, updatedTrip);
      
      // Update the cache by replacing the updated trip in the list
      queryClient.setQueryData(tripsKeys.list(), (oldTrips: Trip[] = []) => {
        return oldTrips.map(trip => 
          trip.id === updatedTrip.id ? updatedTrip : trip
        );
      });
      
      // Only clear packing/weather cache if dates changed
      if (datesChanged) {
        // Completely remove all packing list data for this trip (all date variations)
        queryClient.removeQueries({
          queryKey: ['packingList', updatedTrip.id],
          exact: false,
        });
        
        // Completely remove all weather forecast data for this trip (all date variations)
        queryClient.removeQueries({
          queryKey: ['weatherForecast', updatedTrip.id],
          exact: false,
        });
      }
      
      // Always invalidate trip queries for UI updates
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