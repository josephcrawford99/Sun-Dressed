import AsyncStorage from '@react-native-async-storage/async-storage';
import { Outfit } from '../types/Outfit';
import { Weather } from '../types/weather';

const OUTFITS_WITH_WEATHER_STORAGE_KEY = 'user_outfits_with_weather';

/**
 * Interface for storing outfits with weather context for comparison
 */
export interface StoredOutfitWithWeather {
  outfit: Outfit;
  weather: {
    feelsLikeTemp: number;
    highestChanceOfRain: number;
    windiness: number;
    condition: string;
    location: string;
  };
  activity: string;
  createdAt: Date;
}

/**
 * Service for managing outfit data persistence using AsyncStorage.
 * Stores outfits with weather context for smart restoration.
 */
export class OutfitStorageService {
  /**
   * Get date key in ISO format (YYYY-MM-DD)
   */
  private static getDateKey(date: Date = new Date()): string {
    return date.toISOString().split('T')[0];
  }

  /**
   * Retrieve all stored outfits with weather context from AsyncStorage
   */
  private static async getAllStoredWeatherOutfits(): Promise<{ [dateKey: string]: StoredOutfitWithWeather }> {
    try {
      const outfitsJson = await AsyncStorage.getItem(OUTFITS_WITH_WEATHER_STORAGE_KEY);
      if (!outfitsJson) {
        return {};
      }
      // Ensure all createdAt fields are Date objects
      const outfits = JSON.parse(outfitsJson);
      Object.keys(outfits).forEach(key => {
        if (outfits[key].createdAt) {
          outfits[key].createdAt = new Date(outfits[key].createdAt);
        }
      });
      return outfits;
    } catch (error) {
      console.error('Error getting weather outfits from storage:', error);
      return {};
    }
  }

  /**
   * Save all outfits with weather context to AsyncStorage
   */
  private static async saveAllWeatherOutfits(outfits: { [dateKey: string]: StoredOutfitWithWeather }): Promise<void> {
    try {
      await AsyncStorage.setItem(OUTFITS_WITH_WEATHER_STORAGE_KEY, JSON.stringify(outfits));
    } catch (error) {
      console.error('Error saving weather outfits to storage:', error);
      throw error;
    }
  }

  /**
   * Save an outfit with its weather context for a specific date
   */
  static async saveOutfit(
    outfit: Outfit, 
    weather: Weather, 
    date: Date = new Date(),
    activity: string = 'daily activities'
  ): Promise<void> {
    try {
      const dateKey = this.getDateKey(date);
      const storedOutfit: StoredOutfitWithWeather = {
        outfit,
        weather: {
          feelsLikeTemp: weather.feelsLikeTemp,
          highestChanceOfRain: weather.highestChanceOfRain,
          windiness: weather.windiness,
          condition: weather.condition,
          location: weather.location || 'Unknown Location'
        },
        activity,
        createdAt: new Date()
      };
      
      const weatherOutfits = await this.getAllStoredWeatherOutfits();
      weatherOutfits[dateKey] = storedOutfit;
      await this.saveAllWeatherOutfits(weatherOutfits);
      
      console.log(`Outfit with weather context saved for ${dateKey}`);
    } catch (error) {
      console.error('Error saving outfit with weather:', error);
      throw error;
    }
  }

  /**
   * Get an outfit with its weather context for a specific date
   */
  static async getOutfitByDate(date: Date): Promise<StoredOutfitWithWeather | null> {
    try {
      const dateKey = this.getDateKey(date);
      const weatherOutfits = await this.getAllStoredWeatherOutfits();
      const storedOutfit = weatherOutfits[dateKey];
      
      if (!storedOutfit) {
        return null;
      }
      
      return storedOutfit;
    } catch (error) {
      console.error('Error getting outfit with weather by date:', error);
      return null;
    }
  }

  /**
   * Delete outfit for a specific date
   */
  static async deleteOutfitForDate(date: Date): Promise<void> {
    try {
      const dateKey = this.getDateKey(date);
      const allOutfits = await this.getAllStoredWeatherOutfits();
      delete allOutfits[dateKey];
      await this.saveAllWeatherOutfits(allOutfits);
      console.log(`Outfit deleted for ${dateKey}`);
    } catch (error) {
      console.error('Error deleting outfit for date:', error);
      throw error;
    }
  }

  /**
   * Get all stored outfits with weather context
   */
  static async getAllOutfits(): Promise<{ [dateKey:string]: StoredOutfitWithWeather }> {
    return this.getAllStoredWeatherOutfits();
  }

  /**
   * Clear all stored outfits
   */
  static async clearAllOutfits(): Promise<void> {
    try {
      await AsyncStorage.removeItem(OUTFITS_WITH_WEATHER_STORAGE_KEY);
      console.log('All weather outfits cleared from storage.');
    } catch (error) {
      console.error('Error clearing weather outfits from storage:', error);
      throw error;
    }
  }
}