import { useState, useEffect, useCallback } from 'react';
import { Trip } from '@/types/trip';
import { TripStorageService } from '@/services/tripStorageService';

/**
 * Custom hook for managing trip state and operations
 */
export const useTrips = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);



  /**
   * Load all trips from AsyncStorage
   */
  const loadTrips = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('useTrips: Loading trips from storage...');
      const storedTrips = await TripStorageService.getTrips();
      console.log('useTrips: Loaded trips:', storedTrips);
      setTrips(storedTrips);
    } catch (err) {
      setError('Failed to load trips');
      console.error('Error loading trips:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Add a new trip
   */
  const addTrip = async (trip: Trip) => {
    try {
      setError(null);
      console.log('useTrips: Adding trip:', trip);
      await TripStorageService.saveTrip(trip);
      console.log('useTrips: Trip saved to storage successfully');
      setTrips(prevTrips => {
        const newTrips = [...prevTrips, trip];
        console.log('useTrips: Updated trips state:', newTrips);
        return newTrips;
      });
    } catch (err) {
      setError('Failed to save trip');
      console.error('Error saving trip:', err);
      throw err;
    }
  };
  /**
   * Load trips from storage on mount
   */
  useEffect(() => {
    loadTrips();
  }, [loadTrips]);
  /**
   * Update an existing trip
   */
  const updateTrip = async (updatedTrip: Trip) => {
    try {
      setError(null);
      await TripStorageService.updateTrip(updatedTrip);
      setTrips(prevTrips =>
        prevTrips.map(trip =>
          trip.id === updatedTrip.id ? updatedTrip : trip
        )
      );
    } catch (err) {
      setError('Failed to update trip');
      console.error('Error updating trip:', err);
      throw err;
    }
  };

  /**
   * Delete a trip
   */
  const deleteTrip = async (tripId: string) => {
    try {
      setError(null);
      await TripStorageService.deleteTrip(tripId);
      setTrips(prevTrips => prevTrips.filter(trip => trip.id !== tripId));
    } catch (err) {
      setError('Failed to delete trip');
      console.error('Error deleting trip:', err);
      throw err;
    }
  };

  /**
   * Clear all trips
   */
  const clearAllTrips = async () => {
    try {
      setError(null);
      await TripStorageService.clearAllTrips();
      setTrips([]);
    } catch (err) {
      setError('Failed to clear trips');
      console.error('Error clearing trips:', err);
      throw err;
    }
  };

  return {
    trips,
    loading,
    error,
    addTrip,
    updateTrip,
    deleteTrip,
    clearAllTrips,
    refreshTrips: loadTrips,
  };
};