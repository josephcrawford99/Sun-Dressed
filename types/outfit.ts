/**
 * Represents a single clothing item in an outfit recommendation
 */
export interface ClothingItem {
  /** Name of the clothing item (e.g., "Light Cotton T-Shirt") */
  name: string;
  /** Detailed description of the item */
  description: string;
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
}
