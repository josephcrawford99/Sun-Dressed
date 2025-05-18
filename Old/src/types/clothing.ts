/**
 * Clothing data types for the Sun Dressed app
 */

export interface ClothingItem {
  id: string;
  name: string;
  category: ClothingCategory;
  imageUri: string;
  weatherMinTemp?: number;
  weatherMaxTemp?: number;
  weatherConditions?: string[];
  seasons?: Season[];
  formal?: boolean;
  colors?: string[];
  tags?: string[];
}

export type ClothingCategory = 
  | 'top' 
  | 'bottoms' 
  | 'outerwear' 
  | 'shoes' 
  | 'accessory';

export type Season = 
  | 'spring' 
  | 'summer' 
  | 'fall' 
  | 'winter';

export interface Outfit {
  id?: string;
  top: ClothingItem | null;
  bottoms: ClothingItem | null;
  outerwear: ClothingItem | null;
  shoes: ClothingItem | null;
  accessory: ClothingItem | null;
  date?: string;
  weatherData?: any; // Reference to the weather at time of creation
  rating?: number;
  notes?: string;
}

export interface OutfitRecommendation {
  outfit: Outfit;
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night';
  description?: string;
  confidence?: number; // How confident the algorithm is in this recommendation
}

// Temperature ranges for clothing recommendations
export interface TemperatureRange {
  min: number;
  max: number;
  description: string;
}

export interface ClothingRecommendationRule {
  tempRange: TemperatureRange;
  weatherCondition?: string[];
  recommendedCategories: {
    [key in ClothingCategory]?: {
      required: boolean;
      tags?: string[];
    };
  };
}
