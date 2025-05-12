import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Web polyfill for AsyncStorage
if (Platform.OS === 'web') {
  // Simple localStorage fallback for web
  class LocalStoragePolyfill {
    getItem = async (key: string): Promise<string | null> => {
      return localStorage.getItem(key);
    };

    setItem = async (key: string, value: string): Promise<void> => {
      localStorage.setItem(key, value);
    };

    removeItem = async (key: string): Promise<void> => {
      localStorage.removeItem(key);
    };
  }

  // Override AsyncStorage with localStorage implementation if not available
  if (!AsyncStorage) {
    (global as any).AsyncStorage = new LocalStoragePolyfill();
  }
}

// Storage keys
const STORAGE_KEYS = {
  LOCATION: 'climate_closet_location',
  PREFERENCES: 'climate_closet_preferences',
  HOME_ADDRESS: 'climate_closet_home_address',
  FREQUENT_LOCATIONS: 'climate_closet_frequent_locations',
};

// Location constants
const LOCATION_KEY = 'user_location';
const FREQUENT_LOCATIONS_KEY = 'frequent_locations';

/**
 * Save user's location
 */
export const saveLocation = async (location: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(LOCATION_KEY, location);
    await addFrequentLocation(location);
  } catch (error) {
    console.error('Error saving location:', error);
  }
};

/**
 * Get user's saved location
 */
export const getLocation = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(LOCATION_KEY);
  } catch (error) {
    console.error('Error getting location:', error);
    return null;
  }
};

// Define user preferences interface
export interface UserPreferences {
  temperatureUnit: 'celsius' | 'fahrenheit';
  notificationsEnabled: boolean;
  notificationTime?: string; // Format: "HH:MM"
}

// Default preferences
export const DEFAULT_PREFERENCES: UserPreferences = {
  temperatureUnit: 'celsius',
  notificationsEnabled: false
};

/**
 * Save user preferences
 */
export const savePreferences = async (preferences: UserPreferences): Promise<void> => {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEYS.PREFERENCES,
      JSON.stringify(preferences)
    );
  } catch (error) {
    console.error('Error saving preferences:', error);
    throw new Error('Failed to save preferences');
  }
};

/**
 * Get user preferences
 */
export const getPreferences = async (): Promise<UserPreferences> => {
  try {
    const preferencesJson = await AsyncStorage.getItem(STORAGE_KEYS.PREFERENCES);

    if (preferencesJson) {
      return JSON.parse(preferencesJson) as UserPreferences;
    }

    return DEFAULT_PREFERENCES;
  } catch (error) {
    console.error('Error getting preferences:', error);
    return DEFAULT_PREFERENCES;
  }
};

// Home address
export const setHomeAddress = async (address: string): Promise<void> => {
  await AsyncStorage.setItem(STORAGE_KEYS.HOME_ADDRESS, address);
};

export const getHomeAddress = async (): Promise<string | null> => {
  return AsyncStorage.getItem(STORAGE_KEYS.HOME_ADDRESS);
};

// Functions to manage frequent locations
export const addFrequentLocation = async (location: string): Promise<void> => {
  try {
    const existingLocations = await getFrequentLocations();

    // Don't add duplicates
    if (!existingLocations.includes(location)) {
      const updatedLocations = [location, ...existingLocations].slice(0, 5); // Keep only 5 most recent
      await AsyncStorage.setItem(FREQUENT_LOCATIONS_KEY, JSON.stringify(updatedLocations));
    }
  } catch (error) {
    console.error('Error adding frequent location:', error);
  }
};

export const getFrequentLocations = async (): Promise<string[]> => {
  try {
    const data = await AsyncStorage.getItem(FREQUENT_LOCATIONS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting frequent locations:', error);
    return [];
  }
};

// Function to clear all user data (for development purposes)
export const clearAllData = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(LOCATION_KEY);
    await AsyncStorage.removeItem(FREQUENT_LOCATIONS_KEY);
    // Add any other keys that need to be cleared
  } catch (error) {
    console.error('Error clearing all data:', error);
  }
};
