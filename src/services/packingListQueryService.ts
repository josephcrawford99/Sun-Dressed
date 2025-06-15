import AsyncStorage from '@react-native-async-storage/async-storage';
import { Weather } from '@/types/weather';

// Storage keys for packing list data
const PACKING_LIST_PREFIX = 'packing_list_';
const WEATHER_FORECAST_PREFIX = 'weather_forecast_';

// Data structures for TanStack Query
export interface PackingListData {
  tripId: string;
  packingList: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface WeatherForecastData {
  tripId: string;
  weatherForecast: Weather[];
  location: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Service for managing packing list and weather forecast data using AsyncStorage
 * Designed specifically for TanStack Query integration
 */
export class PackingListQueryService {
  /**
   * Get packing list data for a specific trip
   */
  static async getPackingList(tripId: string): Promise<PackingListData | null> {
    try {
      const key = `${PACKING_LIST_PREFIX}${tripId}`;
      const data = await AsyncStorage.getItem(key);
      
      if (!data) {
        return null;
      }

      const parsed = JSON.parse(data);
      return {
        ...parsed,
        createdAt: new Date(parsed.createdAt),
        updatedAt: new Date(parsed.updatedAt),
      };
    } catch (error) {
      return null;
    }
  }

  /**
   * Save packing list data for a specific trip
   */
  static async savePackingList(tripId: string, packingList: string[]): Promise<PackingListData> {
    try {
      const key = `${PACKING_LIST_PREFIX}${tripId}`;
      const now = new Date();
      
      const data: PackingListData = {
        tripId,
        packingList,
        createdAt: now,
        updatedAt: now,
      };

      await AsyncStorage.setItem(key, JSON.stringify(data));
      return data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update packing list data for a specific trip
   */
  static async updatePackingList(tripId: string, packingList: string[]): Promise<PackingListData> {
    try {
      const existing = await this.getPackingList(tripId);
      const key = `${PACKING_LIST_PREFIX}${tripId}`;
      
      const data: PackingListData = {
        tripId,
        packingList,
        createdAt: existing?.createdAt || new Date(),
        updatedAt: new Date(),
      };

      await AsyncStorage.setItem(key, JSON.stringify(data));
      return data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete packing list data for a specific trip
   */
  static async deletePackingList(tripId: string): Promise<void> {
    try {
      const key = `${PACKING_LIST_PREFIX}${tripId}`;
      await AsyncStorage.removeItem(key);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get weather forecast data for a specific trip
   */
  static async getWeatherForecast(tripId: string): Promise<WeatherForecastData | null> {
    try {
      const key = `${WEATHER_FORECAST_PREFIX}${tripId}`;
      const data = await AsyncStorage.getItem(key);
      
      if (!data) {
        return null;
      }

      const parsed = JSON.parse(data);
      return {
        ...parsed,
        createdAt: new Date(parsed.createdAt),
        updatedAt: new Date(parsed.updatedAt),
      };
    } catch (error) {
      return null;
    }
  }

  /**
   * Save weather forecast data for a specific trip
   */
  static async saveWeatherForecast(
    tripId: string, 
    weatherForecast: Weather[], 
    location: string
  ): Promise<WeatherForecastData> {
    try {
      const key = `${WEATHER_FORECAST_PREFIX}${tripId}`;
      const now = new Date();
      
      const data: WeatherForecastData = {
        tripId,
        weatherForecast,
        location,
        createdAt: now,
        updatedAt: now,
      };

      await AsyncStorage.setItem(key, JSON.stringify(data));
      return data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update weather forecast data for a specific trip
   */
  static async updateWeatherForecast(
    tripId: string, 
    weatherForecast: Weather[], 
    location: string
  ): Promise<WeatherForecastData> {
    try {
      const existing = await this.getWeatherForecast(tripId);
      const key = `${WEATHER_FORECAST_PREFIX}${tripId}`;
      
      const data: WeatherForecastData = {
        tripId,
        weatherForecast,
        location,
        createdAt: existing?.createdAt || new Date(),
        updatedAt: new Date(),
      };

      await AsyncStorage.setItem(key, JSON.stringify(data));
      return data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete weather forecast data for a specific trip
   */
  static async deleteWeatherForecast(tripId: string): Promise<void> {
    try {
      const key = `${WEATHER_FORECAST_PREFIX}${tripId}`;
      await AsyncStorage.removeItem(key);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Clear all packing list and weather forecast data
   * Useful for testing or user data reset
   */
  static async clearAllPackingData(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const packingKeys = keys.filter(key => 
        key.startsWith(PACKING_LIST_PREFIX) || 
        key.startsWith(WEATHER_FORECAST_PREFIX)
      );
      
      if (packingKeys.length > 0) {
        await AsyncStorage.multiRemove(packingKeys);
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get all packing list trip IDs
   * Useful for cache invalidation or data synchronization
   */
  static async getAllPackingListTripIds(): Promise<string[]> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const packingKeys = keys.filter(key => key.startsWith(PACKING_LIST_PREFIX));
      return packingKeys.map(key => key.replace(PACKING_LIST_PREFIX, ''));
    } catch (error) {
      return [];
    }
  }
}