import { isValidClothingItem, ALL_CLOTHING_ITEMS } from '@/constants/clothingItems';
import { Outfit, OutfitItem } from '@/types/Outfit';

export interface ValidationResult {
  isValid: boolean;
  invalidItems: string[];
  errorMessage?: string;
}

export class ClothingValidationService {
  /**
   * Validate an entire outfit response from LLM
   */
  static validateOutfit(outfit: any): ValidationResult {
    const invalidItems: string[] = [];

    // Helper function to validate a single item
    const validateItem = (item: any, itemName: string) => {
      if (item && typeof item === 'object' && item.iconKey) {
        if (!isValidClothingItem(item.iconKey)) {
          invalidItems.push(`${itemName}: "${item.iconKey}"`);
        }
      } else if (typeof item === 'string') {
        // Handle legacy format - just validate the string
        if (!isValidClothingItem(item)) {
          invalidItems.push(`${itemName}: "${item}"`);
        }
      }
    };

    // Helper function to validate array of items
    const validateItemArray = (items: any[], arrayName: string) => {
      if (Array.isArray(items)) {
        items.forEach((item, index) => {
          validateItem(item, `${arrayName}[${index}]`);
        });
      }
    };

    // Validate required fields
    if (outfit.top) {
      validateItem(outfit.top, 'top');
    }

    if (outfit.shoes) {
      validateItem(outfit.shoes, 'shoes');
    }

    // Validate optional fields
    if (outfit.bottom) {
      validateItem(outfit.bottom, 'bottom');
    }

    if (outfit.outerwear) {
      validateItemArray(outfit.outerwear, 'outerwear');
    }

    if (outfit.accessories) {
      validateItemArray(outfit.accessories, 'accessories');
    }

    const isValid = invalidItems.length === 0;
    const errorMessage = isValid ? undefined : this.generateErrorMessage(invalidItems);

    return {
      isValid,
      invalidItems,
      errorMessage
    };
  }

  /**
   * Generate a helpful error message for invalid items
   */
  private static generateErrorMessage(invalidItems: string[]): string {
    const itemList = invalidItems.join(', ');
    const availableItems = ALL_CLOTHING_ITEMS.join(', ');
    
    return `The following items are not in the list of available clothing item icons: ${itemList}. Please choose only from: ${availableItems}`;
  }

  /**
   * Check if a single clothing item key is valid
   */
  static isValidItem(itemKey: string): boolean {
    return isValidClothingItem(itemKey);
  }

  /**
   * Get list of all valid clothing items for display
   */
  static getValidItems(): string[] {
    return [...ALL_CLOTHING_ITEMS];
  }
}