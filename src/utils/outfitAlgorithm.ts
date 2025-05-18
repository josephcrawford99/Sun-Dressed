/**
 * Outfit Suggestion Algorithm
 * 
 * This module implements the core algorithm for suggesting outfits
 * based on weather conditions and user preferences as specified in
 * the algorithm documentation.
 */

import { 
  ClothingItem, 
  OutfitAlgorithmParams, 
  Outfit, 
  StylePreference, 
  OutfitTemplate,
  OutfitFeedback,
  OutfitWeatherData,
  ClothingCategory,
  Season
} from '../types/clothing';

/**
 * Constants for the scoring algorithm
 */
const SCORING_WEIGHTS = {
  TEMPERATURE: 0.40,
  WEATHER_PROTECTION: 0.15,
  USER_PREFERENCE: 0.25,
  COHESION: 0.10,
  RECENCY: 0.10
};

// Temperature ranges for different clothing warmth factors
const TEMP_RANGES = {
  VERY_COLD: { min: -20, max: 0 },    // 8-10 warmth factor
  COLD: { min: 0, max: 10 },          // 7-8 warmth factor
  COOL: { min: 10, max: 15 },         // 5-6 warmth factor
  MILD: { min: 15, max: 20 },         // 4-5 warmth factor
  WARM: { min: 20, max: 25 },         // 2-3 warmth factor
  HOT: { min: 25, max: 35 },          // 1-2 warmth factor
  VERY_HOT: { min: 35, max: 50 }      // 0-1 warmth factor
};

// Rain threshold for suggesting rain gear
const RAIN_THRESHOLD = 30; // 30% chance of rain or higher

// Wind threshold for suggesting wind protection
const WIND_THRESHOLD = 15; // 15 km/h or higher

/**
 * Get the current season based on date
 * @returns The current season
 */
export const getCurrentSeason = (): Season => {
  const month = new Date().getMonth();
  
  if (month >= 2 && month <= 4) return 'spring';
  if (month >= 5 && month <= 7) return 'summer';
  if (month >= 8 && month <= 10) return 'fall';
  return 'winter';
};

/**
 * Filter clothing items based on style preference and exclusions
 * 
 * @param clothingItems - Array of all clothing items
 * @param stylePreference - User's style preference
 * @param excludeItems - Array of item IDs to exclude
 * @param includeItems - Array of item IDs that must be included
 * @returns Filtered array of clothing items
 */
export const filterAvailableItems = (
  clothingItems: ClothingItem[],
  stylePreference: StylePreference,
  excludeItems: string[] = [],
  includeItems: string[] = []
): ClothingItem[] => {
  // Get the current season for filtering
  const currentSeason = getCurrentSeason();
  
  return clothingItems.filter(item => {
    // Include items that must be included regardless of other criteria
    if (includeItems.includes(item.id)) return true;
    
    // Exclude items explicitly excluded or marked as exclude
    if (excludeItems.includes(item.id) || item.exclude) return false;
    
    // Filter by style preference - keep items matching user's preference or neutral items
    const styleMatch = item.style === stylePreference || item.style === 'neutral';
    
    // Check if the item is appropriate for the current season
    const seasonMatch = item.seasonality.includes(currentSeason);
    
    return styleMatch && seasonMatch;
  });
};

/**
 * Generate outfit templates based on filtered items and weather
 * 
 * @param availableItems - Filtered array of clothing items
 * @param includeItems - Array of item IDs that must be included
 * @param weatherData - Current weather data
 * @param template - Optional template type to prioritize
 * @returns Array of generated outfit combinations
 */
export const generateOutfitTemplates = (
  availableItems: ClothingItem[],
  includeItems: string[] = [],
  weatherData: OutfitWeatherData,
  template?: OutfitTemplate
): Outfit[] => {
  // Helper function to get items by category
  const getItemsByCategory = (category: ClothingCategory): ClothingItem[] => {
    return availableItems.filter(item => item.category === category);
  };
  
  // Get items by category
  const tops = getItemsByCategory('Top');
  const bottoms = getItemsByCategory('Bottom');
  const shoes = getItemsByCategory('Shoes');
  const dresses = getItemsByCategory('Dress');
  const outerwear = getItemsByCategory('Outerwear');
  const accessories = getItemsByCategory('Accessory');
  const hats = getItemsByCategory('Hat');
  
  // Get required include items and categorize them
  const includeItemsObjects = availableItems.filter(item => includeItems.includes(item.id));
  const includeTop = includeItemsObjects.find(item => item.category === 'Top');
  const includeBottom = includeItemsObjects.find(item => item.category === 'Bottom');
  const includeShoes = includeItemsObjects.find(item => item.category === 'Shoes');
  const includeDress = includeItemsObjects.find(item => item.category === 'Dress');
  
  // Determine if we need outerwear based on temperature
  const needsOuterwear = weatherData.feels_like < 20;
  
  // Determine if we need rain protection
  const needsRainProtection = weatherData.chance_of_rain != null && weatherData.chance_of_rain >= RAIN_THRESHOLD;
  
  // Determine if we need wind protection
  const needsWindProtection = weatherData.wind_speed >= WIND_THRESHOLD;
  
  // Determine if we need sun protection
  const needsSunProtection = weatherData.icon?.includes('01') || weatherData.icon?.includes('02');
  
  // Initialize outfits array
  const outfits: Outfit[] = [];
  
  // Generate top + bottom + shoes combinations
  if (tops.length > 0 && bottoms.length > 0 && shoes.length > 0) {
    // For included items, we only need to generate combinations with those
    if (includeTop && includeBottom && includeShoes) {
      outfits.push({
        id: `${includeTop.id}-${includeBottom.id}-${includeShoes.id}`,
        top: includeTop,
        bottom: includeBottom,
        shoes: includeShoes
      });
    } else {
      // Generate combinations based on what's included
      const topsToUse = includeTop ? [includeTop] : tops;
      const bottomsToUse = includeBottom ? [includeBottom] : bottoms;
      const shoesToUse = includeShoes ? [includeShoes] : shoes;
      
      // Generate a reasonable number of combinations
      const maxCombinations = 10;
      let count = 0;
      
      for (const top of topsToUse) {
        for (const bottom of bottomsToUse) {
          for (const shoe of shoesToUse) {
            if (count >= maxCombinations) break;
            
            outfits.push({
              id: `${top.id}-${bottom.id}-${shoe.id}`,
              top,
              bottom,
              shoes: shoe
            });
            
            count++;
          }
          if (count >= maxCombinations) break;
        }
        if (count >= maxCombinations) break;
      }
    }
  }
  
  // Generate dress + shoes combinations for feminine style
  if (dresses.length > 0 && shoes.length > 0) {
    // For included items, prioritize those
    if (includeDress && includeShoes) {
      outfits.push({
        id: `${includeDress.id}-${includeShoes.id}`,
        dress: includeDress,
        shoes: includeShoes
      });
    } else {
      // Generate combinations based on what's included
      const dressesToUse = includeDress ? [includeDress] : dresses;
      const shoesToUse = includeShoes ? [includeShoes] : shoes;
      
      // Generate a reasonable number of combinations
      const maxCombinations = 5;
      let count = 0;
      
      for (const dress of dressesToUse) {
        for (const shoe of shoesToUse) {
          if (count >= maxCombinations) break;
          
          outfits.push({
            id: `${dress.id}-${shoe.id}`,
            dress,
            shoes: shoe
          });
          
          count++;
        }
        if (count >= maxCombinations) break;
      }
    }
  }
  
  // Add outerwear, accessories, and hats to outfits based on weather conditions
  return outfits.map(outfit => {
    const outfitWithExtras = { ...outfit };
    
    // Add outerwear if needed based on temperature
    if (needsOuterwear && outerwear.length > 0) {
      // Sort outerwear by warmth factor for colder temperatures
      const sortedOuterwear = [...outerwear].sort((a, b) => {
        // If it's very cold, prioritize warmer items
        if (weatherData.feels_like < 5) {
          return b.warmthFactor - a.warmthFactor;
        }
        // Otherwise, use items with appropriate warmth
        return Math.abs(a.warmthFactor - 5) - Math.abs(b.warmthFactor - 5);
      });
      
      // Add up to 2 layers of outerwear for very cold weather
      if (weatherData.feels_like < 0 && sortedOuterwear.length >= 2) {
        outfitWithExtras.outerwear = [sortedOuterwear[0], sortedOuterwear[1]];
      } else if (sortedOuterwear.length > 0) {
        outfitWithExtras.outerwear = [sortedOuterwear[0]];
      }
    }
    
    // Add rain protection if needed
    if (needsRainProtection) {
      const rainGear = accessories.filter(item => item.rainDeterring);
      if (rainGear.length > 0) {
        outfitWithExtras.accessories = outfitWithExtras.accessories || [];
        outfitWithExtras.accessories.push(rainGear[0]);
      }
    }
    
    // Add sun protection if needed
    if (needsSunProtection) {
      const sunHats = hats.filter(item => item.sunDeterring);
      if (sunHats.length > 0) {
        outfitWithExtras.hat = sunHats[0];
      }
    }
    
    // Add wind protection if needed
    if (needsWindProtection && !outfitWithExtras.outerwear) {
      const windProtection = outerwear.filter(item => item.windDeterring);
      if (windProtection.length > 0) {
        outfitWithExtras.outerwear = [windProtection[0]];
      }
    }
    
    return outfitWithExtras;
  });
};

/**
 * Calculate temperature appropriateness score for an outfit
 * 
 * @param outfit - Outfit to score
 * @param weatherData - Current weather data
 * @returns Score from 0-1 for temperature appropriateness
 */
export const calculateTemperatureScore = (
  outfit: Outfit,
  weatherData: OutfitWeatherData
): number => {
  // Calculate total warmth factor of the outfit
  let totalWarmth = 0;
  let itemCount = 0;
  
  // Add warmth from top and bottom or dress
  if (outfit.top) {
    totalWarmth += outfit.top.warmthFactor;
    itemCount++;
  }
  
  if (outfit.bottom) {
    totalWarmth += outfit.bottom.warmthFactor;
    itemCount++;
  }
  
  if (outfit.dress) {
    totalWarmth += outfit.dress.warmthFactor;
    itemCount++;
  }
  
  // Add warmth from shoes
  totalWarmth += outfit.shoes.warmthFactor;
  itemCount++;
  
  // Add warmth from outerwear (potentially multiple layers)
  if (outfit.outerwear) {
    outfit.outerwear.forEach(item => {
      totalWarmth += item.warmthFactor;
      itemCount++;
    });
  }
  
  // Add warmth from hat if present
  if (outfit.hat) {
    totalWarmth += outfit.hat.warmthFactor;
    itemCount++;
  }
  
  // Calculate average warmth factor
  const avgWarmth = totalWarmth / itemCount;
  
  // Determine ideal warmth based on temperature
  let idealWarmth;
  const temp = weatherData.feels_like;
  
  if (temp < TEMP_RANGES.VERY_COLD.max) idealWarmth = 9; // Very cold
  else if (temp < TEMP_RANGES.COLD.max) idealWarmth = 7.5; // Cold
  else if (temp < TEMP_RANGES.COOL.max) idealWarmth = 5.5; // Cool
  else if (temp < TEMP_RANGES.MILD.max) idealWarmth = 4.5; // Mild
  else if (temp < TEMP_RANGES.WARM.max) idealWarmth = 2.5; // Warm
  else if (temp < TEMP_RANGES.HOT.max) idealWarmth = 1.5; // Hot
  else idealWarmth = 0.5; // Very hot
  
  // Calculate score based on how close the outfit's warmth is to ideal
  // Score decreases as the difference increases
  const difference = Math.abs(avgWarmth - idealWarmth);
  const maxDifference = 10; // Maximum possible difference in warmth
  
  return Math.max(0, 1 - (difference / maxDifference));
};

/**
 * Calculate weather protection score for an outfit
 * 
 * @param outfit - Outfit to score
 * @param weatherData - Current weather data
 * @returns Score from 0-1 for weather protection
 */
export const calculateWeatherProtectionScore = (
  outfit: Outfit,
  weatherData: OutfitWeatherData
): number => {
  let score = 1.0; // Start with perfect score
  
  // Check for rain protection if needed
  if (weatherData.chance_of_rain != null && weatherData.chance_of_rain >= RAIN_THRESHOLD) {
    const hasRainProtection = 
      (outfit.outerwear?.some(item => item.rainDeterring) || false) ||
      (outfit.accessories?.some(item => item.rainDeterring) || false);
    
    if (!hasRainProtection) {
      score -= 0.4; // Penalize lack of rain protection
    }
  }
  
  // Check for wind protection if needed
  if (weatherData.wind_speed >= WIND_THRESHOLD) {
    const hasWindProtection = 
      (outfit.outerwear?.some(item => item.windDeterring) || false) ||
      (outfit.hat?.windDeterring || false);
    
    if (!hasWindProtection) {
      score -= 0.3; // Penalize lack of wind protection
    }
  }
  
  // Check for sun protection if needed (sunny day)
  if (weatherData.icon?.includes('01') || weatherData.icon?.includes('02')) {
    const hasSunProtection = 
      (outfit.hat?.sunDeterring || false) ||
      (outfit.accessories?.some(item => item.sunDeterring) || false);
    
    if (!hasSunProtection) {
      score -= 0.3; // Penalize lack of sun protection
    }
  }
  
  return Math.max(0, score); // Ensure score is not negative
};

/**
 * Calculate user preference score for an outfit
 * 
 * @param outfit - Outfit to score
 * @returns Score from 0-1 based on user preferences
 */
export const calculateUserPreferenceScore = (outfit: Outfit): number => {
  let totalPreference = 0;
  let itemCount = 0;
  
  // Add preference scores for each component
  const components: (ClothingItem | undefined)[] = [
    outfit.top, 
    outfit.bottom, 
    outfit.dress, 
    outfit.shoes,
    outfit.hat,
    ...(outfit.outerwear || []),
    ...(outfit.accessories || [])
  ];
  
  // Calculate the average preference score
  components.forEach(item => {
    if (item) {
      totalPreference += item.userPreference;
      itemCount++;
    }
  });
  
  // Return normalized score (divide by 10 since preference is 0-10)
  return itemCount > 0 ? (totalPreference / itemCount) / 10 : 0;
};

/**
 * Calculate style cohesion score for an outfit
 * 
 * @param outfit - Outfit to score
 * @returns Score from 0-1 for style cohesion
 */
export const calculateCohesionScore = (outfit: Outfit): number => {
  let totalCohesion = 0;
  let pairCount = 0;
  
  // Get all items in the outfit
  const items: ClothingItem[] = [];
  if (outfit.top) items.push(outfit.top);
  if (outfit.bottom) items.push(outfit.bottom);
  if (outfit.dress) items.push(outfit.dress);
  items.push(outfit.shoes);
  if (outfit.hat) items.push(outfit.hat);
  if (outfit.outerwear) items.push(...outfit.outerwear);
  if (outfit.accessories) items.push(...outfit.accessories);
  
  // Check cohesion between each pair of items
  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      const item1 = items[i];
      const item2 = items[j];
      
      // Check if there's a cohesion score between these items
      if (item1.cohesionScores[item2.id]) {
        totalCohesion += item1.cohesionScores[item2.id];
        pairCount++;
      } else if (item2.cohesionScores[item1.id]) {
        totalCohesion += item2.cohesionScores[item1.id];
        pairCount++;
      } else {
        // If no explicit cohesion score, give a default middle score
        totalCohesion += 5;
        pairCount++;
      }
    }
  }
  
  // Return normalized score (divide by 10 since cohesion is 0-10)
  return pairCount > 0 ? (totalCohesion / pairCount) / 10 : 0.5;
};

/**
 * Calculate recency and variety score for an outfit
 * 
 * @param outfit - Outfit to score
 * @returns Score from 0-1 based on when items were last worn
 */
export const calculateRecencyScore = (outfit: Outfit): number => {
  let totalRecency = 0;
  let itemCount = 0;
  
  // Get all items in the outfit
  const items: ClothingItem[] = [];
  if (outfit.top) items.push(outfit.top);
  if (outfit.bottom) items.push(outfit.bottom);
  if (outfit.dress) items.push(outfit.dress);
  items.push(outfit.shoes);
  if (outfit.hat) items.push(outfit.hat);
  if (outfit.outerwear) items.push(...outfit.outerwear);
  if (outfit.accessories) items.push(...outfit.accessories);
  
  // Calculate score based on days since last worn
  // Items worn a long time ago get higher scores
  items.forEach(item => {
    // Map recency (days) to a score
    // 0 days = 0.0, 30+ days = 1.0
    const recencyScore = Math.min(item.recency / 30, 1.0);
    totalRecency += recencyScore;
    itemCount++;
  });
  
  return itemCount > 0 ? totalRecency / itemCount : 0.5;
};

/**
 * Score an outfit based on all factors
 * 
 * @param outfit - Outfit to score
 * @param weatherData - Current weather data
 * @returns Total score from 0-1
 */
export const scoreOutfit = (
  outfit: Outfit,
  weatherData: OutfitWeatherData
): number => {
  // Calculate individual scores
  const temperatureScore = calculateTemperatureScore(outfit, weatherData);
  const weatherProtectionScore = calculateWeatherProtectionScore(outfit, weatherData);
  const userPreferenceScore = calculateUserPreferenceScore(outfit);
  const cohesionScore = calculateCohesionScore(outfit);
  const recencyScore = calculateRecencyScore(outfit);
  
  // Apply weights to each score component
  const weightedScore = 
    (SCORING_WEIGHTS.TEMPERATURE * temperatureScore) +
    (SCORING_WEIGHTS.WEATHER_PROTECTION * weatherProtectionScore) +
    (SCORING_WEIGHTS.USER_PREFERENCE * userPreferenceScore) +
    (SCORING_WEIGHTS.COHESION * cohesionScore) +
    (SCORING_WEIGHTS.RECENCY * recencyScore);
  
  return weightedScore;
};

/**
 * Process user feedback to update item properties
 * 
 * @param feedback - User feedback data
 * @param clothingItems - Array of clothing items to update
 * @returns Updated clothing items
 */
export const processOutfitFeedback = (
  feedback: OutfitFeedback,
  clothingItems: ClothingItem[]
): ClothingItem[] => {
  const updatedItems = [...clothingItems];
  
  // Process temperature feedback
  if (feedback.temperatureFeedback) {
    // Find all items in the outfit by parsing the outfitId
    // Assuming outfitId is constructed as a hyphen-separated list of item IDs
    const outfitItemIds = feedback.outfitId.split('-');
    const outfitItems = updatedItems.filter(item => outfitItemIds.includes(item.id));
    
    // Adjust warmth factors based on feedback
    outfitItems.forEach(item => {
      const itemIndex = updatedItems.findIndex(i => i.id === item.id);
      if (itemIndex !== -1) {
        const updatedItem = { ...updatedItems[itemIndex] };
        
        if (feedback.temperatureFeedback === 'too_hot') {
          // Decrease warmth factor if too hot
          updatedItem.warmthFactor = Math.max(0, updatedItem.warmthFactor - 0.5);
        } else if (feedback.temperatureFeedback === 'too_cold') {
          // Increase warmth factor if too cold
          updatedItem.warmthFactor = Math.min(10, updatedItem.warmthFactor + 0.5);
        }
        
        updatedItems[itemIndex] = updatedItem;
      }
    });
  }
  
  // Process individual item feedback
  if (feedback.itemFeedback) {
    feedback.itemFeedback.forEach(({ itemId, liked }) => {
      const itemIndex = updatedItems.findIndex(item => item.id === itemId);
      if (itemIndex !== -1) {
        const updatedItem = { ...updatedItems[itemIndex] };
        
        // Adjust user preference based on feedback
        if (liked) {
          updatedItem.userPreference = Math.min(10, updatedItem.userPreference + 1);
        } else {
          updatedItem.userPreference = Math.max(0, updatedItem.userPreference - 1);
        }
        
        updatedItems[itemIndex] = updatedItem;
      }
    });
    
    // Update cohesion scores for liked items
    const likedItemIds = feedback.itemFeedback
      .filter(fb => fb.liked)
      .map(fb => fb.id);
    
    // If multiple items were liked together, increase their cohesion scores
    if (likedItemIds.length >= 2) {
      for (let i = 0; i < likedItemIds.length; i++) {
        for (let j = i + 1; j < likedItemIds.length; j++) {
          const item1Id = likedItemIds[i];
          const item2Id = likedItemIds[j];
          
          // Update cohesion score for first item
          const item1Index = updatedItems.findIndex(item => item.id === item1Id);
          if (item1Index !== -1) {
            const updatedItem = { ...updatedItems[item1Index] };
            const currentScore = updatedItem.cohesionScores[item2Id] || 5;
            updatedItem.cohesionScores[item2Id] = Math.min(10, currentScore + 1);
            updatedItems[item1Index] = updatedItem;
          }
          
          // Update cohesion score for second item
          const item2Index = updatedItems.findIndex(item => item.id === item2Id);
          if (item2Index !== -1) {
            const updatedItem = { ...updatedItems[item2Index] };
            const currentScore = updatedItem.cohesionScores[item1Id] || 5;
            updatedItem.cohesionScores[item1Id] = Math.min(10, currentScore + 1);
            updatedItems[item2Index] = updatedItem;
          }
        }
      }
    }
  }
  
  return updatedItems;
};

/**
 * Update the recency values for items in the chosen outfit
 * 
 * @param outfit - The outfit that was worn
 * @param clothingItems - Array of all clothing items
 * @returns Updated clothing items with recency values
 */
export const updateRecencyValues = (
  outfit: Outfit,
  clothingItems: ClothingItem[]
): ClothingItem[] => {
  const updatedItems = [...clothingItems];
  
  // Get all items in the outfit
  const outfitItems: ClothingItem[] = [];
  if (outfit.top) outfitItems.push(outfit.top);
  if (outfit.bottom) outfitItems.push(outfit.bottom);
  if (outfit.dress) outfitItems.push(outfit.dress);
  outfitItems.push(outfit.shoes);
  if (outfit.hat) outfitItems.push(outfit.hat);
  if (outfit.outerwear) outfitItems.push(...outfit.outerwear);
  if (outfit.accessories) outfitItems.push(...outfit.accessories);
  
  // Reset recency to 0 for all items in the outfit
  outfitItems.forEach(item => {
    const itemIndex = updatedItems.findIndex(i => i.id === item.id);
    if (itemIndex !== -1) {
      updatedItems[itemIndex] = {
        ...updatedItems[itemIndex],
        recency: 0
      };
    }
  });
  
  return updatedItems;
};

/**
 * Main function to suggest an outfit based on weather and preferences
 * 
 * @param params - Algorithm parameters including weather data and preferences
 * @returns The highest-scoring outfit
 */
export const suggestOutfit = (params: OutfitAlgorithmParams): Outfit => {
  const {
    weatherData,
    stylePreference,
    clothingItems,
    includeItems = [],
    excludeItems = [],
    template
  } = params;
  
  // Step 1: Filter available items
  const availableItems = filterAvailableItems(
    clothingItems,
    stylePreference,
    excludeItems,
    includeItems
  );
  
  // Step 2: Generate outfit templates
  const outfitTemplates = generateOutfitTemplates(
    availableItems,
    includeItems,
    weatherData,
    template
  );
  
  // Step 3: Score each outfit
  const scoredOutfits = outfitTemplates.map(outfit => ({
    ...outfit,
    score: scoreOutfit(outfit, weatherData)
  }));
  
  // Step 4: Return highest scoring outfit
  return scoredOutfits.sort((a, b) => (b.score || 0) - (a.score || 0))[0];
};

export default suggestOutfit;
