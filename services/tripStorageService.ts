import AsyncStorage from '@react-native-async-storage/async-storage';
import { Trip } from '../../types/trip';

const TRIPS_STORAGE_KEY = 'user_trips';

/**
 * Service for managing trip data persistence using AsyncStorage
 */
export class TripStorageService {
  /**
   * Retrieve all trips from AsyncStorage
   */
  static async getTrips(): Promise<Trip[]> {
    try {
      console.log('TripStorageService: Getting trips from AsyncStorage...');
      const tripsJson = await AsyncStorage.getItem(TRIPS_STORAGE_KEY);
      console.log('TripStorageService: Raw JSON from storage:', tripsJson);
      
      if (!tripsJson) {
        console.log('TripStorageService: No trips found in storage, returning empty array');
        return [];
      }
      
      const trips = JSON.parse(tripsJson);
      console.log('TripStorageService: Parsed trips:', trips);
      
      // Convert date strings back to Date objects
      const processedTrips = trips.map((trip: any) => ({
        ...trip,
        startDate: new Date(trip.startDate),
        endDate: new Date(trip.endDate),
        createdAt: new Date(trip.createdAt),
        updatedAt: new Date(trip.updatedAt),
      }));
      
      console.log('TripStorageService: Processed trips with Date objects:', processedTrips);
      return processedTrips;
    } catch (error) {
      console.error('Error getting trips from storage:', error);
      return [];
    }
  }

  /**
   * Save a new trip to AsyncStorage
   */
  static async saveTrip(trip: Trip): Promise<void> {
    try {
      console.log('TripStorageService: Saving trip:', trip);
      const existingTrips = await this.getTrips();
      console.log('TripStorageService: Existing trips:', existingTrips);
      
      const newTrips = [...existingTrips, trip];
      console.log('TripStorageService: New trips array:', newTrips);
      
      const jsonToSave = JSON.stringify(newTrips);
      console.log('TripStorageService: JSON to save:', jsonToSave);
      
      await AsyncStorage.setItem(TRIPS_STORAGE_KEY, jsonToSave);
      console.log('TripStorageService: Trip saved successfully to AsyncStorage');
    } catch (error) {
      console.error('Error saving trip to storage:', error);
      throw error;
    }
  }

  /**
   * Update an existing trip in AsyncStorage
   */
  static async updateTrip(updatedTrip: Trip): Promise<void> {
    try {
      const existingTrips = await this.getTrips();
      const updatedTrips = existingTrips.map(trip =>
        trip.id === updatedTrip.id ? updatedTrip : trip
      );
      await AsyncStorage.setItem(TRIPS_STORAGE_KEY, JSON.stringify(updatedTrips));
    } catch (error) {
      console.error('Error updating trip in storage:', error);
      throw error;
    }
  }

  /**
   * Delete a trip from AsyncStorage
   */
  static async deleteTrip(tripId: string): Promise<void> {
    try {
      const existingTrips = await this.getTrips();
      const filteredTrips = existingTrips.filter(trip => trip.id !== tripId);
      await AsyncStorage.setItem(TRIPS_STORAGE_KEY, JSON.stringify(filteredTrips));
    } catch (error) {
      console.error('Error deleting trip from storage:', error);
      throw error;
    }
  }

  /**
   * Clear all trips from AsyncStorage
   */
  static async clearAllTrips(): Promise<void> {
    try {
      await AsyncStorage.removeItem(TRIPS_STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing trips from storage:', error);
      throw error;
    }
  }
}