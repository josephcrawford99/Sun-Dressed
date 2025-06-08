import AsyncStorage from '@react-native-async-storage/async-storage';
import { Trip } from '../types/trip';

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
      const tripsJson = await AsyncStorage.getItem(TRIPS_STORAGE_KEY);
      if (!tripsJson) {
        return [];
      }
      const trips = JSON.parse(tripsJson);
      // Convert date strings back to Date objects
      return trips.map((trip: any) => ({
        ...trip,
        startDate: new Date(trip.startDate),
        endDate: new Date(trip.endDate),
        createdAt: new Date(trip.createdAt),
        updatedAt: new Date(trip.updatedAt),
      }));
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
      const existingTrips = await this.getTrips();
      const newTrips = [...existingTrips, trip];
      await AsyncStorage.setItem(TRIPS_STORAGE_KEY, JSON.stringify(newTrips));
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