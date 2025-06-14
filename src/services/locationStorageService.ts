import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * LocationStorageService - Handles persistence of user's last selected location STRING
 * 
 * IMPORTANT: This service is for storing location search strings (e.g., "New York, NY, USA")
 * that the user has selected in the LocationAutocomplete component. This is NOT for 
 * device GPS coordinates or device location services.
 * 
 * Purpose:
 * - Store the last location string the user searched for/selected
 * - Restore that location as the default when the app restarts
 * - Eliminate the need to always default to "New York, NY, USA" after first use
 */

const LAST_LOCATION_KEY = '@sun_dressed_last_location';

export class LocationStorageService {
  /**
   * Saves the user's last selected location string to AsyncStorage
   * @param locationString - The formatted location string (e.g., "San Francisco, CA, USA")
   */
  static async saveLastLocation(locationString: string): Promise<void> {
    try {
      await AsyncStorage.setItem(LAST_LOCATION_KEY, locationString);
    } catch (error) {
      console.error('Failed to save last location:', error);
      throw error;
    }
  }

  /**
   * Retrieves the user's last selected location string from AsyncStorage.
   * If no location exists, automatically saves and returns "New York, NY, USA"
   * @returns Promise<string> - The last location string (never null)
   */
  static async getLastLocation(): Promise<string> {
    const DEFAULT_LOCATION = "New York, NY, USA";
    
    try {
      const lastLocation = await AsyncStorage.getItem(LAST_LOCATION_KEY);
      
      if (lastLocation) {
        return lastLocation;
      } else {
        // No saved location - save and return default
        await this.saveLastLocation(DEFAULT_LOCATION);
        return DEFAULT_LOCATION;
      }
    } catch (error) {
      console.error('Failed to retrieve last location:', error);
      // On error, try to save default and return it
      try {
        await this.saveLastLocation(DEFAULT_LOCATION);
      } catch (saveError) {
        console.error('Failed to save default location:', saveError);
      }
      return DEFAULT_LOCATION;
    }
  }

  /**
   * Clears the stored last location (useful for testing or reset functionality)
   */
  static async clearLastLocation(): Promise<void> {
    try {
      await AsyncStorage.removeItem(LAST_LOCATION_KEY);
    } catch (error) {
      console.error('Failed to clear last location:', error);
      throw error;
    }
  }
}