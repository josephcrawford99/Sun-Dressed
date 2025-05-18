/**
 * Test utility for the outfit suggestion algorithm
 *
 * This file demonstrates how to use the outfit suggestion algorithm
 * with mock data for testing purposes.
 */

import { suggestOutfit, processOutfitFeedback, updateRecencyValues } from '../utils/outfitAlgorithm';
import { ClothingItem, OutfitAlgorithmParams, Outfit, OutfitFeedback, StylePreference } from '../types/clothing';
import clothingDataJson from '../mocks/clothingData.json';

/**
 * Test function to demonstrate the outfit suggestion algorithm
 *
 * @param weatherData - Weather data for testing
 * @param stylePreference - Style preference for testing
 * @param includeItems - Optional items to include
 * @param excludeItems - Optional items to exclude
 * @returns The suggested outfit
 */
export const testOutfitSuggestion = (
  weatherData = {
    temperature: 22,
    feels_like: 24,
    wind_speed: 5,
    chance_of_rain: 10,
    icon: '01d'  // Clear sky
  },
  stylePreference = "neutral" as StylePreference,
  includeItems: string[] = [],
  excludeItems: string[] = []
): Outfit => {
  // Get clothing items from mock data
  const clothingItems = (clothingDataJson as any).clothingItems as ClothingItem[];

  // Set up algorithm parameters
  const params: OutfitAlgorithmParams = {
    weatherData,
    stylePreference,
    clothingItems,
    includeItems,
    excludeItems
  };

  // Call the algorithm
  const suggestedOutfit = suggestOutfit(params);

  // Log the result for testing
  console.log('Suggested outfit:', JSON.stringify(suggestedOutfit, null, 2));

  return suggestedOutfit;
};

/**
 * Test function to demonstrate the feedback processing
 *
 * @param outfitId - ID of the outfit that received feedback
 * @param temperatureFeedback - Optional temperature feedback
 * @param itemFeedback - Optional item-specific feedback
 * @returns Updated clothing items after processing feedback
 */
export const testFeedbackProcessing = (
  outfitId: string,
  temperatureFeedback?: 'too_hot' | 'too_cold' | 'just_right',
  itemFeedback?: { itemId: string, liked: boolean }[]
): ClothingItem[] => {
  // Get clothing items from mock data
  const clothingItems = (clothingDataJson as any).clothingItems as ClothingItem[];

  // Create feedback object
  const feedback: OutfitFeedback = {
    outfitId,
    temperatureFeedback,
    itemFeedback,
    timestamp: Date.now(),
    temperature: 22 // Example temperature
  };

  // Process feedback
  const updatedItems = processOutfitFeedback(feedback, clothingItems);

  // Log changes for testing
  console.log('Updated items after feedback:', JSON.stringify(
    updatedItems.filter(item =>
      itemFeedback?.some(fb => fb.itemId === item.id) ||
      outfitId.includes(item.id)
    ),
    null,
    2
  ));

  return updatedItems;
};

/**
 * Examples of how to use the algorithm in different scenarios
 * These demonstrate the main use cases for the outfit suggestion system
 */

/**
 * Example 1: Basic outfit suggestion for warm weather
 */
export const example1_WarmWeatherOutfit = () => {
  const warmWeather = {
    temperature: 28,
    feels_like: 30,
    wind_speed: 3,
    chance_of_rain: 0,
    icon: '01d' // Clear sky
  };

  return testOutfitSuggestion(warmWeather, 'neutral');
};

/**
 * Example 2: Cold weather outfit with wind
 */
export const example2_ColdWeatherOutfit = () => {
  const coldWeather = {
    temperature: 2,
    feels_like: -2,
    wind_speed: 20, // Windy
    chance_of_rain: 0,
    icon: '01d' // Clear but cold
  };

  return testOutfitSuggestion(coldWeather, 'neutral');
};

/**
 * Example 3: Rainy day outfit
 */
export const example3_RainyDayOutfit = () => {
  const rainyWeather = {
    temperature: 15,
    feels_like: 13,
    wind_speed: 10,
    chance_of_rain: 80, // High chance of rain
    icon: '09d' // Rain
  };

  return testOutfitSuggestion(rainyWeather, 'neutral');
};

/**
 * Example 4: Outfit with required items (user preferences)
 */
export const example4_RequiredItemsOutfit = () => {
  const weather = {
    temperature: 18,
    feels_like: 17,
    wind_speed: 5,
    chance_of_rain: 20,
    icon: '03d' // Partly cloudy
  };

  // User wants to include their favorite t-shirt and jeans
  const includeItems = ['t1', 'b1'];

  return testOutfitSuggestion(weather, 'neutral', includeItems);
};

/**
 * Example 5: Outfit for feminine style preference
 */
export const example5_FeminineStyleOutfit = () => {
  const weather = {
    temperature: 22,
    feels_like: 23,
    wind_speed: 4,
    chance_of_rain: 10,
    icon: '02d' // Few clouds
  };

  return testOutfitSuggestion(weather, 'feminine');
};

/**
 * Example 6: Outfit with feedback processing
 */
export const example6_FeedbackProcessing = () => {
  // First, get an outfit suggestion
  const outfit = testOutfitSuggestion();

  // Then, process feedback that the outfit was too warm
  const updatedItems = testFeedbackProcessing(
    outfit.id,
    'too_hot',
    [{ itemId: outfit.top?.id || '', liked: false }]
  );

  // Get a new suggestion with the updated preferences
  const params: OutfitAlgorithmParams = {
    weatherData: {
      temperature: 22,
      feels_like: 24,
      wind_speed: 5,
      chance_of_rain: 10,
      icon: '01d'
    },
    stylePreference: 'neutral',
    clothingItems: updatedItems
  };

  return suggestOutfit(params);
};

/**
 * Run examples for testing
 * Uncomment these to test the algorithm
 */
/*
console.log("=== Example 1: Warm Weather Outfit ===");
example1_WarmWeatherOutfit();

console.log("\n=== Example 2: Cold Weather Outfit ===");
example2_ColdWeatherOutfit();

console.log("\n=== Example 3: Rainy Day Outfit ===");
example3_RainyDayOutfit();

console.log("\n=== Example 4: Required Items Outfit ===");
example4_RequiredItemsOutfit();

console.log("\n=== Example 5: Feminine Style Outfit ===");
example5_FeminineStyleOutfit();

console.log("\n=== Example 6: Feedback Processing ===");
example6_FeedbackProcessing();
*/
