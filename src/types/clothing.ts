/**
 * Types and interfaces for the outfit suggestion algorithm
 * These define the data structures used for clothing items, outfits,
 * and related concepts in the Sun Dressed app.
 */

// Style preference options
export type StylePreference = 'masculine' | 'feminine' | 'neutral';

// Clothing category types
export type ClothingCategory = 'Top' | 'Bottom' | 'Shoes' | 'Dress' | 'Outerwear' | 'Accessory' | 'Hat';

// Activity types for clothing items
export type ActivityType = 'workout' | 'outdoors' | 'formal' | 'casual' | 'work';

// Seasons for clothing seasonality
export type Season = 'spring' | 'summer' | 'fall' | 'winter';

/**
 * Interface for clothing item properties
 * This represents a single piece of clothing in the user's inventory
 */
export interface ClothingItem {
  // Basic Properties
  id: string;
  name: string;
  category: ClothingCategory;
  imageUrl: string;
  
  // Weather Properties
  warmthFactor: number; // Scale indicating how warm the item is
  rainDeterring: boolean; // Whether the item protects from rain
  sunDeterring: boolean; // Whether the item protects from sun
  windDeterring: boolean; // Whether the item protects from wind
  
  // Style Properties
  style: StylePreference;
  formality: number; // Scale from 1-10 for occasion appropriateness
  activityTypes: ActivityType[]; // Activities this item is suitable for
  seasonality: Season[]; // Seasons this item is appropriate for
  
  // User Interaction Properties
  userPreference: number; // Score adjusted based on feedback history
  recency: number; // Days since last worn
  exclude: boolean; // Flag to completely remove from suggestions
  cohesionScores: Record<string, number>; // Mapping to other item IDs with pairing scores
}

/**
 * Interface for a complete outfit
 * An outfit consists of multiple clothing items arranged by category
 */
export interface Outfit {
  id: string;
  top?: ClothingItem; // Optional because dresses don't need tops
  bottom?: ClothingItem; // Optional because dresses don't need bottoms
  shoes: ClothingItem; // Required for all outfits
  dress?: ClothingItem; // Optional, mutually exclusive with top+bottom
  outerwear?: ClothingItem[]; // Optional layers for colder weather
  accessories?: ClothingItem[]; // Optional accessories
  hat?: ClothingItem; // Optional headwear
  score?: number; // The calculated score of this outfit (used internally)
}

/**
 * Interface for weather data required by the outfit algorithm
 * This is a subset of the full WeatherData interface from useWeather.ts
 */
export interface OutfitWeatherData {
  temperature: number; // Current temperature
  feels_like: number; // "Feels like" temperature
  wind_speed: number; // Wind speed
  chance_of_rain?: number; // Probability of precipitation (0-100)
  icon?: string; // Weather condition icon code
}

/**
 * Outfit template types for different scenarios
 */
export type OutfitTemplate = 'default' | 'workout' | 'outdoors' | 'formal' | 'work';

/**
 * Interface for outfit algorithm function parameters
 */
export interface OutfitAlgorithmParams {
  weatherData: OutfitWeatherData;
  stylePreference: StylePreference;
  clothingItems: ClothingItem[];
  includeItems?: string[]; // IDs of items to include (thumbs-up)
  excludeItems?: string[]; // IDs of items to exclude (thumbs-down)
  template?: OutfitTemplate; // Optional template to prioritize
}

/**
 * Interface for user feedback on suggested outfits
 */
export interface OutfitFeedback {
  outfitId: string;
  temperatureFeedback?: 'too_hot' | 'too_cold' | 'just_right';
  itemFeedback?: {
    itemId: string;
    liked: boolean;
  }[];
  timestamp: number; // Unix timestamp of when feedback was given
  temperature: number; // Temperature at the time of feedback
}
