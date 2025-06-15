import AsyncStorage from '@react-native-async-storage/async-storage';
import { Trip } from '@/types/trip';

const TRIPS_STORAGE_KEY = 'user_trips';

export interface TripsData {
  trips: Trip[];
  lastUpdated: Date;
}

/**
 * TanStack Query service for trips AsyncStorage operations
 * Handles all trip persistence with proper date handling
 */
export class TripsQueryService {
  /**
   * Get all trips from AsyncStorage
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
      // Return empty array on error - let the UI handle error states
      return [];
    }
  }

  /**
   * Save a new trip to AsyncStorage
   */
  static async addTrip(trip: Trip): Promise<Trip> {
    try {
      const existingTrips = await this.getTrips();
      const newTrips = [...existingTrips, trip];
      await AsyncStorage.setItem(TRIPS_STORAGE_KEY, JSON.stringify(newTrips));
      return trip;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update an existing trip in AsyncStorage
   */
  static async updateTrip(updatedTrip: Trip): Promise<Trip> {
    try {
      const existingTrips = await this.getTrips();
      const updatedTrips = existingTrips.map(trip =>
        trip.id === updatedTrip.id ? updatedTrip : trip
      );
      await AsyncStorage.setItem(TRIPS_STORAGE_KEY, JSON.stringify(updatedTrips));
      return updatedTrip;
    } catch (error) {
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
      throw error;
    }
  }
}