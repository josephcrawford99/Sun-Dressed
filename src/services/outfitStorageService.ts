import AsyncStorage from '@react-native-async-storage/async-storage';
import { Outfit } from '../types/Outfit';

const OUTFITS_STORAGE_KEY = 'user_outfits';

/**
 * Service for managing outfit data persistence using AsyncStorage
 * Stores outfits as string arrays keyed by ISO date strings
 */
export class OutfitStorageService {
  /**
   * Convert Outfit object to string array for storage
   */
  private static outfitToStringArray(outfit: Outfit): string[] {
    const items: string[] = [];
    
    if (outfit.top) items.push(outfit.top);
    if (outfit.bottom) items.push(outfit.bottom);
    if (outfit.shoes) items.push(outfit.shoes);
    
    // Add outerwear items
    if (outfit.outerwear && outfit.outerwear.length > 0) {
      items.push(...outfit.outerwear);
    }
    
    // Add accessories
    if (outfit.accessories && outfit.accessories.length > 0) {
      items.push(...outfit.accessories);
    }
    
    return items;
  }

  /**
   * Convert string array back to Outfit object
   * Note: This is a simplified conversion - we lose the original structure
   */
  private static stringArrayToOutfit(items: string[]): Outfit {
    // Simple heuristic: first item is top, second is bottom, third is shoes
    // Rest are treated as outerwear or accessories based on keywords
    const outfit: Outfit = {
      top: items[0] || '',
      shoes: items[2] || ''
    };
    
    if (items[1]) {
      outfit.bottom = items[1];
    }
    
    // Simple categorization for remaining items
    const remaining = items.slice(3);
    const outerwear: string[] = [];
    const accessories: string[] = [];
    
    remaining.forEach(item => {
      const lowerItem = item.toLowerCase();
      if (lowerItem.includes('jacket') || lowerItem.includes('coat') || 
          lowerItem.includes('sweater') || lowerItem.includes('cardigan') ||
          lowerItem.includes('hoodie') || lowerItem.includes('blazer')) {
        outerwear.push(item);
      } else {
        accessories.push(item);
      }
    });
    
    if (outerwear.length > 0) outfit.outerwear = outerwear;
    if (accessories.length > 0) outfit.accessories = accessories;
    
    return outfit;
  }

  /**
   * Get date key in ISO format (YYYY-MM-DD)
   */
  private static getDateKey(date: Date = new Date()): string {
    return date.toISOString().split('T')[0];
  }

  /**
   * Retrieve all stored outfits from AsyncStorage
   */
  private static async getAllStoredOutfits(): Promise<{ [dateKey: string]: string[] }> {
    try {
      const outfitsJson = await AsyncStorage.getItem(OUTFITS_STORAGE_KEY);
      if (!outfitsJson) {
        return {};
      }
      return JSON.parse(outfitsJson);
    } catch (error) {
      console.error('Error getting outfits from storage:', error);
      return {};
    }
  }

  /**
   * Save all outfits to AsyncStorage
   */
  private static async saveAllOutfits(outfits: { [dateKey: string]: string[] }): Promise<void> {
    try {
      await AsyncStorage.setItem(OUTFITS_STORAGE_KEY, JSON.stringify(outfits));
    } catch (error) {
      console.error('Error saving outfits to storage:', error);
      throw error;
    }
  }

  /**
   * Save an outfit for a specific date
   */
  static async saveOutfitForDate(outfit: Outfit, date: Date = new Date()): Promise<void> {
    try {
      const dateKey = this.getDateKey(date);
      const outfitItems = this.outfitToStringArray(outfit);
      const allOutfits = await this.getAllStoredOutfits();
      
      allOutfits[dateKey] = outfitItems;
      await this.saveAllOutfits(allOutfits);
      
      console.log(`Outfit saved for ${dateKey}:`, outfitItems);
    } catch (error) {
      console.error('Error saving outfit for date:', error);
      throw error;
    }
  }

  /**
   * Get outfit for a specific date
   */
  static async getOutfitByDate(date: Date): Promise<Outfit | null> {
    try {
      const dateKey = this.getDateKey(date);
      const allOutfits = await this.getAllStoredOutfits();
      const outfitItems = allOutfits[dateKey];
      
      if (!outfitItems || outfitItems.length === 0) {
        return null;
      }
      
      return this.stringArrayToOutfit(outfitItems);
    } catch (error) {
      console.error('Error getting outfit by date:', error);
      return null;
    }
  }

  /**
   * Get raw outfit items (string array) for a specific date
   */
  static async getOutfitItemsByDate(date: Date): Promise<string[] | null> {
    try {
      const dateKey = this.getDateKey(date);
      const allOutfits = await this.getAllStoredOutfits();
      return allOutfits[dateKey] || null;
    } catch (error) {
      console.error('Error getting outfit items by date:', error);
      return null;
    }
  }

  /**
   * Delete outfit for a specific date
   */
  static async deleteOutfitForDate(date: Date): Promise<void> {
    try {
      const dateKey = this.getDateKey(date);
      const allOutfits = await this.getAllStoredOutfits();
      delete allOutfits[dateKey];
      await this.saveAllOutfits(allOutfits);
    } catch (error) {
      console.error('Error deleting outfit for date:', error);
      throw error;
    }
  }

  /**
   * Get all stored outfits
   */
  static async getAllOutfits(): Promise<{ [dateKey: string]: string[] }> {
    return this.getAllStoredOutfits();
  }

  /**
   * Clear all stored outfits
   */
  static async clearAllOutfits(): Promise<void> {
    try {
      await AsyncStorage.removeItem(OUTFITS_STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing outfits from storage:', error);
      throw error;
    }
  }
}