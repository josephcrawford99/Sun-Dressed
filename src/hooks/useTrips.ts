import { useCallback } from 'react';
import { Trip } from '@/types/trip';
import { Weather } from '@/types/weather';
import { 
  useTripsQuery, 
  useAddTripMutation, 
  useUpdateTripMutation, 
  useDeleteTripMutation, 
  useClearAllTripsMutation,
  useUpdateTripPackingListMutation,
  useUpdateTripWeatherForecastMutation
} from '@/hooks/queries/useTripsQuery';

/**
 * Custom hook for managing trip state and operations
 * Powered by TanStack Query for caching and state management
 */
export const useTrips = () => {
  // Use TanStack Query hooks
  const { data: trips = [], isLoading: loading, error: queryError, refetch } = useTripsQuery();
  const addTripMutation = useAddTripMutation();
  const updateTripMutation = useUpdateTripMutation();
  const deleteTripMutation = useDeleteTripMutation();
  const clearAllTripsMutation = useClearAllTripsMutation();
  const updateTripPackingListMutation = useUpdateTripPackingListMutation();
  const updateTripWeatherForecastMutation = useUpdateTripWeatherForecastMutation();

  // Convert query error to string
  const error = queryError ? `${queryError}` : null;

  /**
   * Add a new trip
   */
  const addTrip = useCallback(async (trip: Trip) => {
    try {
      await addTripMutation.mutateAsync(trip);
    } catch (err) {
      throw err;
    }
  }, [addTripMutation]);

  /**
   * Update an existing trip
   */
  const updateTrip = useCallback(async (updatedTrip: Trip) => {
    try {
      await updateTripMutation.mutateAsync(updatedTrip);
    } catch (err) {
      throw err;
    }
  }, [updateTripMutation]);

  /**
   * Delete a trip
   */
  const deleteTrip = useCallback(async (tripId: string) => {
    try {
      await deleteTripMutation.mutateAsync(tripId);
    } catch (err) {
      throw err;
    }
  }, [deleteTripMutation]);

  /**
   * Get a specific trip by ID
   */
  const getTrip = useCallback((tripId: string): Trip | null => {
    const trip = trips.find(t => t.id === tripId);
    return trip || null;
  }, [trips]);

  /**
   * Update a trip's packing list
   */
  const updateTripPackingList = useCallback(async (tripId: string, packingList: string[]) => {
    try {
      await updateTripPackingListMutation.mutateAsync({ tripId, packingList });
    } catch (err) {
      throw err;
    }
  }, [updateTripPackingListMutation]);

  /**
   * Update a trip's weather forecast
   */
  const updateTripWeatherForecast = useCallback(async (tripId: string, weatherForecast: Weather[]) => {
    try {
      await updateTripWeatherForecastMutation.mutateAsync({ tripId, weatherForecast });
    } catch (err) {
      throw err;
    }
  }, [updateTripWeatherForecastMutation]);

  /**
   * Clear all trips
   */
  const clearAllTrips = useCallback(async () => {
    try {
      await clearAllTripsMutation.mutateAsync();
    } catch (err) {
      throw err;
    }
  }, [clearAllTripsMutation]);

  /**
   * Refresh trips (refetch)
   */
  const refreshTrips = useCallback(async () => {
    await refetch();
  }, [refetch]);

  return {
    trips,
    loading,
    error,
    addTrip,
    updateTrip,
    deleteTrip,
    getTrip,
    updateTripPackingList,
    updateTripWeatherForecast,
    clearAllTrips,
    refreshTrips,
  };
};