// Types definition
export interface ClothingItem {
  id: string;
  name: string;
  warmthLevel: number;
  formality: 'casual' | 'smart_casual' | 'formal' | 'any';
  rainSuitable: boolean;
  rainSpecific?: boolean;
  sunSpecific?: boolean;
}

export interface ClothingDatabase {
  tops: ClothingItem[];
  dresses: ClothingItem[];
  bottoms: ClothingItem[];
  outerwear: ClothingItem[];
  shoes: ClothingItem[];
  accessories: ClothingItem[];
}

export interface WeatherData {
  temperature: number; // in Celsius
  precipitation: number; // probability of precipitation 0-1
  isRaining: boolean;
  isSunny: boolean;
}

export interface UserPreferences {
  warmthAdjustment: number; // -2 to +2, negative means user feels cold
  formalityPreference: 'casual' | 'smart_casual' | 'formal';
  avoidedItems: string[]; // IDs of items the user wants to avoid
  favoriteItems: string[]; // IDs of items the user prefers
}

export interface OutfitRecommendation {
  top?: ClothingItem;
  dress?: ClothingItem;
  bottom?: ClothingItem;
  outerwear?: ClothingItem;
  shoes: ClothingItem;
  accessories: ClothingItem[];
}

// Temperature ranges mapped to warmth levels
const temperatureRanges = [
  { min: -Infinity, max: 0, warmthLevel: { min: 9, max: 11 } }, // Very cold
  { min: 0, max: 5, warmthLevel: { min: 8, max: 10 } }, // Cold
  { min: 5, max: 10, warmthLevel: { min: 7, max: 9 } }, // Chilly
  { min: 10, max: 15, warmthLevel: { min: 5, max: 7 } }, // Cool
  { min: 15, max: 20, warmthLevel: { min: 4, max: 6 } }, // Mild
  { min: 20, max: 25, warmthLevel: { min: 3, max: 4 } }, // Warm
  { min: 25, max: 30, warmthLevel: { min: 1, max: 3 } }, // Hot
  { min: 30, max: Infinity, warmthLevel: { min: 1, max: 2 } } // Very hot
];

// Get appropriate warmth level for temperature
export function getWarmthLevelForTemperature(
  temperature: number,
  userAdjustment: number = 0
): { min: number, max: number } {
  const range = temperatureRanges.find(
    range => temperature >= range.min && temperature < range.max
  );

  if (!range) {
    return { min: 3, max: 5 }; // Fallback to mild range
  }

  return {
    min: Math.max(1, range.warmthLevel.min - userAdjustment),
    max: Math.min(11, range.warmthLevel.max - userAdjustment)
  };
}

// Main recommendation function
export function recommendOutfit(
  clothingData: ClothingDatabase,
  weatherData: WeatherData,
  userPreferences: UserPreferences
): OutfitRecommendation {
  // Get warmth level range based on temperature and user preferences
  const warmthRange = getWarmthLevelForTemperature(
    weatherData.temperature,
    userPreferences.warmthAdjustment
  );

  // Determine if we need rain-specific items
  const needsRainItems = weatherData.isRaining || weatherData.precipitation > 0.5;

  // Choose between dress or top+bottom (30% chance for dress)
  const useDress = Math.random() < 0.3;

  // Helper function to filter items by warmth and formality
  const filterByWarmthAndFormality = (items: ClothingItem[]): ClothingItem[] => {
    return items.filter(item =>
      item.warmthLevel >= warmthRange.min &&
      item.warmthLevel <= warmthRange.max &&
      (item.formality === userPreferences.formalityPreference || item.formality === 'any') &&
      !userPreferences.avoidedItems.includes(item.id)
    );
  };

  // Helper function to prioritize favorite items
  const prioritizeFavorites = (items: ClothingItem[]): ClothingItem[] => {
    return [
      ...items.filter(item => userPreferences.favoriteItems.includes(item.id)),
      ...items.filter(item => !userPreferences.favoriteItems.includes(item.id))
    ];
  };

  // Helper function for rain-suitable items
  const getRainSuitableItems = (items: ClothingItem[]): ClothingItem[] => {
    const rainSuitable = items.filter(item => item.rainSuitable);

    if (needsRainItems) {
      return [
        ...rainSuitable.filter(item => item.rainSpecific),
        ...rainSuitable.filter(item => !item.rainSpecific)
      ];
    }

    return rainSuitable;
  };

  // Get filtered options for each category
  let topOptions = prioritizeFavorites(filterByWarmthAndFormality(clothingData.tops));
  let dressOptions = prioritizeFavorites(filterByWarmthAndFormality(clothingData.dresses));
  let bottomOptions = prioritizeFavorites(filterByWarmthAndFormality(clothingData.bottoms));

  let outerwearOptions = prioritizeFavorites(
    getRainSuitableItems(filterByWarmthAndFormality(clothingData.outerwear))
  );

  let shoeOptions = prioritizeFavorites(
    getRainSuitableItems(filterByWarmthAndFormality(clothingData.shoes))
  );

  // Handle accessories with weather specifics
  let accessoryOptions = filterByWarmthAndFormality(clothingData.accessories);
  accessoryOptions = getRainSuitableItems(accessoryOptions);

  // Add weather-specific accessories
  if (needsRainItems) {
    const umbrellaOption = clothingData.accessories.find(item => item.id === 'umbrella');
    if (umbrellaOption && !accessoryOptions.some(item => item.id === 'umbrella')) {
      accessoryOptions.push(umbrellaOption);
    }
  }

  if (weatherData.isSunny) {
    const sunglassesOption = clothingData.accessories.find(item => item.id === 'sunglasses');
    if (sunglassesOption && !accessoryOptions.some(item => item.id === 'sunglasses')) {
      accessoryOptions.push(sunglassesOption);
    }
  }

  accessoryOptions = prioritizeFavorites(accessoryOptions);

  // Build the outfit recommendation
  const outfit: OutfitRecommendation = {
    shoes: shoeOptions.length > 0 ? shoeOptions[0] : clothingData.shoes[0],
    accessories: accessoryOptions.slice(0, 2) // Limit to 2 accessories
  };

  // Add top/dress and bottoms
  if (useDress && dressOptions.length > 0) {
    outfit.dress = dressOptions[0];
  } else {
    outfit.top = topOptions.length > 0 ? topOptions[0] : clothingData.tops[0];
    outfit.bottom = bottomOptions.length > 0 ? bottomOptions[0] : clothingData.bottoms[0];
  }

  // Add outerwear if needed (based on temperature)
  if (warmthRange.min > 3) {
    outfit.outerwear = outerwearOptions.length > 0 ? outerwearOptions[0] : undefined;
  }

  return outfit;
}

// Process user feedback
export function updatePreferencesFromFeedback(
  feedback: 'too_cold' | 'too_hot' | 'just_right' | 'dislike',
  itemId: string,
  userPreferences: UserPreferences
): UserPreferences {
  const updatedPreferences = { ...userPreferences };

  switch (feedback) {
    case 'too_cold':
      // User feels cold, adjust warmth level up
      updatedPreferences.warmthAdjustment = Math.min(2, updatedPreferences.warmthAdjustment + 1);
      break;

    case 'too_hot':
      // User feels hot, adjust warmth level down
      updatedPreferences.warmthAdjustment = Math.max(-2, updatedPreferences.warmthAdjustment - 1);
      break;

    case 'dislike':
      // Add to avoided items
      if (!updatedPreferences.avoidedItems.includes(itemId)) {
        updatedPreferences.avoidedItems.push(itemId);
      }
      // Remove from favorites if present
      updatedPreferences.favoriteItems = updatedPreferences.favoriteItems.filter(
        id => id !== itemId
      );
      break;

    case 'just_right':
      // Add to favorites
      if (!updatedPreferences.favoriteItems.includes(itemId)) {
        updatedPreferences.favoriteItems.push(itemId);
      }
      // Remove from avoided items if present
      updatedPreferences.avoidedItems = updatedPreferences.avoidedItems.filter(
        id => id !== itemId
      );
      break;
  }

  return updatedPreferences;
}
