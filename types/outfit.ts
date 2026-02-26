/**
 * Represents a single clothing item in an outfit recommendation
 */
export interface ClothingItem {
  /** Name of the clothing item from LLM response (e.g., "Boots" or "Boots (feminine)") */
  name: string;
  /** One sentence explanation of why this item is good for the conditions and outfit */
  blurb: string;
}

/**
 * Outfit style options
 */
export type OutfitStyle = 'masculine' | 'feminine' | 'neutral';

/**
 * Complete outfit with items and overall description
 */
export interface Outfit {
  /** Array of individual clothing items */
  items: ClothingItem[];
  /** Overall outfit description from the fashion advisor perspective */
  overallDescription: string;
  /** Whether a warm coat is recommended for the weather conditions */
  warmCoatRecommended: boolean;
  /** Whether rain gear is recommended for the weather conditions */
  rainGearRecommended: boolean;
}
