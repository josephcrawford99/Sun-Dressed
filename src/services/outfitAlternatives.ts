import {
  ClothingDatabase,
  ClothingItem,
  OutfitRecommendation,
  UserPreferences,
  WeatherData
} from './outfitService';

/**
 * Generates an alternative outfit based on feedback for a specific item
 * 
 * @param clothingData Full clothing database
 * @param currentOutfit The current outfit recommendation
 * @param dislikedCategory The category that received negative feedback
 * @param dislikedItemId The specific item ID that received negative feedback
 * @param weatherData Current weather data for contextual outfit generation
 * @param userPreferences User's clothing preferences
 * @returns A new outfit recommendation with a different item for the disliked category
 */
export function generateAlternativeOutfit(
  clothingData: ClothingDatabase,
  currentOutfit: OutfitRecommendation,
  dislikedCategory: string,
  dislikedItemId: string,
  weatherData: WeatherData,
  userPreferences: UserPreferences
): OutfitRecommendation {
  // Create a deep copy of the current outfit
  const newOutfit: OutfitRecommendation = JSON.parse(JSON.stringify(currentOutfit));
  
  // If disliking a dress, switch to top+bottom combo
  if (dislikedCategory === 'dress' && currentOutfit.dress) {
    // Remove the dress
    newOutfit.dress = undefined;
    
    // Find suitable top and bottom
    const suitableTops = getSuitableItems(
      clothingData.tops,
      weatherData,
      userPreferences,
      dislikedItemId
    );
    
    const suitableBottoms = getSuitableItems(
      clothingData.bottoms,
      weatherData,
      userPreferences,
      dislikedItemId
    );
    
    // Add top and bottom if available
    if (suitableTops.length > 0) {
      newOutfit.top = suitableTops[0];
    }
    
    if (suitableBottoms.length > 0) {
      newOutfit.bottom = suitableBottoms[0];
    }
  }
  // If disliking top or bottom, consider switching to dress (30% chance)
  else if ((dislikedCategory === 'top' || dislikedCategory === 'bottom') && !currentOutfit.dress) {
    const useDress = Math.random() < 0.3;
    
    if (useDress) {
      // Find suitable dress
      const suitableDresses = getSuitableItems(
        clothingData.dresses,
        weatherData,
        userPreferences,
        dislikedItemId
      );
      
      // If we found a suitable dress, switch to it
      if (suitableDresses.length > 0) {
        newOutfit.dress = suitableDresses[0];
        newOutfit.top = undefined;
        newOutfit.bottom = undefined;
      } else {
        // Otherwise just replace the disliked item
        replaceDislikedItem(
          clothingData,
          newOutfit,
          dislikedCategory,
          dislikedItemId,
          weatherData,
          userPreferences
        );
      }
    } else {
      // Replace just the disliked item
      replaceDislikedItem(
        clothingData,
        newOutfit,
        dislikedCategory,
        dislikedItemId,
        weatherData,
        userPreferences
      );
    }
  }
  // For other categories, just replace the disliked item
  else {
    replaceDislikedItem(
      clothingData,
      newOutfit,
      dislikedCategory,
      dislikedItemId,
      weatherData,
      userPreferences
    );
  }
  
  return newOutfit;
}

/**
 * Helper function to replace a disliked item in an outfit
 */
function replaceDislikedItem(
  clothingData: ClothingDatabase,
  outfit: OutfitRecommendation,
  category: string,
  dislikedItemId: string,
  weatherData: WeatherData,
  userPreferences: UserPreferences
): void {
  let items: ClothingItem[] = [];
  
  // Get the appropriate category items
  switch (category) {
    case 'top':
      items = clothingData.tops;
      break;
    case 'bottom':
      items = clothingData.bottoms;
      break;
    case 'outerwear':
      items = clothingData.outerwear;
      break;
    case 'shoes':
      items = clothingData.shoes;
      break;
    case 'accessory':
      items = clothingData.accessories;
      break;
  }
  
  // Find suitable alternatives
  const suitableItems = getSuitableItems(
    items,
    weatherData,
    userPreferences,
    dislikedItemId
  );
  
  // Replace the item if we found a suitable alternative
  if (suitableItems.length > 0) {
    if (category === 'accessory' && outfit.accessories) {
      // For accessories, find the index of the disliked accessory
      const index = outfit.accessories.findIndex(acc => acc.id === dislikedItemId);
      if (index !== -1) {
        outfit.accessories[index] = suitableItems[0];
      } else if (outfit.accessories.length < 2) {
        // If not found but we have room, add it
        outfit.accessories.push(suitableItems[0]);
      }
    } else {
      // For other categories, directly replace
      (outfit as any)[category] = suitableItems[0];
    }
  }
}

/**
 * Helper function to get suitable items for the current weather and user preferences
 */
function getSuitableItems(
  items: ClothingItem[],
  weatherData: WeatherData,
  userPreferences: UserPreferences,
  excludeItemId: string
): ClothingItem[] {
  // Filter out the excluded item
  const filteredItems = items.filter(item => item.id !== excludeItemId);
  
  // Filter by warmth level (simplified for this example)
  let warmthFiltered = filteredItems;
  if (weatherData.temperature < 10) {
    // Cold weather - prefer warmer items
    warmthFiltered = filteredItems.filter(item => item.warmthLevel >= 5);
  } else if (weatherData.temperature > 25) {
    // Hot weather - prefer cooler items
    warmthFiltered = filteredItems.filter(item => item.warmthLevel <= 3);
  } else {
    // Moderate weather - mid-range warmth
    warmthFiltered = filteredItems.filter(item => item.warmthLevel >= 3 && item.warmthLevel <= 6);
  }
  
  // If we have no suitable items after warmth filtering, use the original filtered list
  if (warmthFiltered.length === 0) {
    warmthFiltered = filteredItems;
  }
  
  // Filter by formality preference
  const formalityFiltered = warmthFiltered.filter(
    item => item.formality === userPreferences.formalityPreference || item.formality === 'any'
  );
  
  // If we have no suitable items after formality filtering, use the warmth filtered list
  if (formalityFiltered.length === 0) {
    return warmthFiltered;
  }
  
  // Filter out avoided items
  const preferenceFiltered = formalityFiltered.filter(
    item => !userPreferences.avoidedItems.includes(item.id)
  );
  
  // If we have no suitable items after preference filtering, use the formality filtered list
  if (preferenceFiltered.length === 0) {
    return formalityFiltered;
  }
  
  // Prioritize favorite items
  const sortedItems = [
    ...preferenceFiltered.filter(item => userPreferences.favoriteItems.includes(item.id)),
    ...preferenceFiltered.filter(item => !userPreferences.favoriteItems.includes(item.id))
  ];
  
  return sortedItems;
}
