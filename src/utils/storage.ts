import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
const STORAGE_KEYS = {
  LOCATION: 'climate_closet_location',
  PREFERENCES: 'climate_closet_preferences',
  HOME_ADDRESS: 'climate_closet_home_address',
  FREQUENT_LOCATIONS: 'climate_closet_frequent_locations',
};

/**
 * Save user's location
 */
export const saveLocation = async (location: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.LOCATION, location);
  } catch (error) {
    console.error('Error saving location:', error);
    throw new Error('Failed to save location');
  }
};

/**
 * Get user's saved location
 */
export const getLocation = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.LOCATION);
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

// Frequent locations
export const getFrequentLocations = async (): Promise<string[]> => {
  const json = await AsyncStorage.getItem(STORAGE_KEYS.FREQUENT_LOCATIONS);
  return json ? JSON.parse(json) : [];
};

export const addFrequentLocation = async (location: string): Promise<void> => {
  const current = await getFrequentLocations();
  if (!current.includes(location)) {
    const updated = [location, ...current].slice(0, 10); // keep max 10
    await AsyncStorage.setItem(STORAGE_KEYS.FREQUENT_LOCATIONS, JSON.stringify(updated));
  }
};
