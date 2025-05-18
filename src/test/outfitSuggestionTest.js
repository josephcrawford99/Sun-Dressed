/**
 * Outfit Suggestion Algorithm Test
 * 
 * This script tests the outfit suggestion algorithm with different weather scenarios
 * to verify it produces appropriate outfit recommendations.
 */

const path = require('path');
const fs = require('fs');

// Load the clothing data
const clothingDataPath = path.join(__dirname, '../mocks/clothingData.json');
const clothingData = JSON.parse(fs.readFileSync(clothingDataPath, 'utf8'));

// Simple implementation of the core algorithm functions for testing
// These are simplified versions of the functions in outfitAlgorithm.ts

/**
 * Filter clothing items based on style preference and seasonal appropriateness
 */
function filterAvailableItems(clothingItems, stylePreference, excludeItems = [], includeItems = []) {
  // Get current season
  const date = new Date();
  const month = date.getMonth();
  let currentSeason;
  
  if (month >= 2 && month <= 4) currentSeason = 'spring';
  else if (month >= 5 && month <= 7) currentSeason = 'summer';
  else if (month >= 8 && month <= 10) currentSeason = 'fall';
  else currentSeason = 'winter';
  
  return clothingItems.filter(item => {
    // Include required items
    if (includeItems.includes(item.id)) return true;
    
    // Exclude items
    if (excludeItems.includes(item.id) || item.exclude) return false;
    
    // Filter by style and season
    const styleMatch = item.style === stylePreference || item.style === 'neutral';
    const seasonMatch = item.seasonality.includes(currentSeason);
    
    return styleMatch && seasonMatch;
  });
}

/**
 * Generate outfit based on weather conditions
 */
function generateOutfit(availableItems, weatherData) {
  // Categorize items
  const tops = availableItems.filter(item => item.category === 'Top');
  const bottoms = availableItems.filter(item => item.category === 'Bottom');
  const dresses = availableItems.filter(item => item.category === 'Dress');
  const shoes = availableItems.filter(item => item.category === 'Shoes');
  const accessories = availableItems.filter(item => item.category === 'Accessory');
  
  // Determine if we need weather protection
  const needsRainProtection = weatherData.chance_of_rain > 30;
  const needsWindProtection = weatherData.wind_speed > 15;
  const needsSunProtection = weatherData.condition.includes('sunny') || weatherData.condition.includes('clear');
  
  // Select items based on temperature
  // For simplicity in testing, use a simple temperature threshold system
  const temp = weatherData.feels_like;
  
  // Filter items by warmth appropriate for temperature
  let appropriateTops = [];
  let appropriateBottoms = [];
  let appropriateDresses = [];
  let appropriateShoes = [];
  
  if (temp < 5) {
    // Very cold: warmth 7-10
    appropriateTops = tops.filter(item => item.warmthFactor >= 6);
    appropriateBottoms = bottoms.filter(item => item.warmthFactor >= 5);
    appropriateDresses = dresses.filter(item => item.warmthFactor >= 6);
    appropriateShoes = shoes.filter(item => item.warmthFactor >= 6);
  } else if (temp < 15) {
    // Cool: warmth 5-7
    appropriateTops = tops.filter(item => item.warmthFactor >= 4 && item.warmthFactor <= 7);
    appropriateBottoms = bottoms.filter(item => item.warmthFactor >= 3 && item.warmthFactor <= 7);
    appropriateDresses = dresses.filter(item => item.warmthFactor >= 4 && item.warmthFactor <= 7);
    appropriateShoes = shoes.filter(item => item.warmthFactor >= 3 && item.warmthFactor <= 7);
  } else if (temp < 25) {
    // Mild: warmth 3-5
    appropriateTops = tops.filter(item => item.warmthFactor >= 2 && item.warmthFactor <= 5);
    appropriateBottoms = bottoms.filter(item => item.warmthFactor >= 2 && item.warmthFactor <= 5);
    appropriateDresses = dresses.filter(item => item.warmthFactor >= 2 && item.warmthFactor <= 5);
    appropriateShoes = shoes.filter(item => item.warmthFactor >= 2 && item.warmthFactor <= 6);
  } else {
    // Hot: warmth 1-3
    appropriateTops = tops.filter(item => item.warmthFactor <= 3);
    appropriateBottoms = bottoms.filter(item => item.warmthFactor <= 3);
    appropriateDresses = dresses.filter(item => item.warmthFactor <= 3);
    appropriateShoes = shoes.filter(item => item.warmthFactor <= 3);
  }
  
  // If no appropriate items, fall back to all items
  if (appropriateTops.length === 0) appropriateTops = tops;
  if (appropriateBottoms.length === 0) appropriateBottoms = bottoms;
  if (appropriateDresses.length === 0) appropriateDresses = dresses;
  if (appropriateShoes.length === 0) appropriateShoes = shoes;
  
  // Choose top items based on user preference score
  appropriateTops.sort((a, b) => b.userPreference - a.userPreference);
  appropriateBottoms.sort((a, b) => b.userPreference - a.userPreference);
  appropriateDresses.sort((a, b) => b.userPreference - a.userPreference);
  appropriateShoes.sort((a, b) => b.userPreference - a.userPreference);
  
  // Decide whether to use dress or top+bottom based on style and preference
  let outfit = {};
  
  if (appropriateDresses.length > 0 && Math.random() > 0.5) {
    // Use a dress
    outfit.dress = appropriateDresses[0];
  } else if (appropriateTops.length > 0 && appropriateBottoms.length > 0) {
    // Use top and bottom
    outfit.top = appropriateTops[0];
    outfit.bottom = appropriateBottoms[0];
  } else if (appropriateDresses.length > 0) {
    // Fall back to dress if no top+bottom combination
    outfit.dress = appropriateDresses[0];
  } else {
    // Emergency fallback
    if (tops.length > 0) outfit.top = tops[0];
    if (bottoms.length > 0) outfit.bottom = bottoms[0];
  }
  
  // Add shoes
  if (appropriateShoes.length > 0) {
    outfit.shoes = appropriateShoes[0];
  } else if (shoes.length > 0) {
    outfit.shoes = shoes[0];
  }
  
  // Add weather appropriate accessories
  outfit.accessories = [];
  
  // Add rain protection
  if (needsRainProtection) {
    const rainGear = accessories.filter(item => item.rainDeterring);
    if (rainGear.length > 0) {
      outfit.accessories.push(rainGear[0]);
    }
    
    // Also use rain boots if available
    const rainBoots = shoes.filter(item => item.rainDeterring && item.id !== outfit.shoes?.id);
    if (rainBoots.length > 0) {
      // Replace shoes with rain boots
      outfit.shoes = rainBoots[0];
    }
  }
  
  // Add sun protection
  if (needsSunProtection) {
    const sunProtection = accessories.filter(item => item.sunDeterring && !outfit.accessories.some(a => a.id === item.id));
    if (sunProtection.length > 0) {
      outfit.accessories.push(sunProtection[0]);
    }
  }
  
  // Add warmth accessories for cold weather
  if (temp < 10) {
    const warmAccessories = accessories.filter(
      item => item.warmthFactor > 5 && 
      !outfit.accessories.some(a => a.id === item.id)
    );
    
    // Add up to 2 warm accessories
    for (let i = 0; i < Math.min(2, warmAccessories.length); i++) {
      outfit.accessories.push(warmAccessories[i]);
    }
  }
  
  return outfit;
}

/**
 * Format outfit for display
 */
function formatOutfit(outfit) {
  const result = [];
  
  if (outfit.top) result.push(`Top: ${outfit.top.name} (Warmth: ${outfit.top.warmthFactor})`);
  if (outfit.bottom) result.push(`Bottom: ${outfit.bottom.name} (Warmth: ${outfit.bottom.warmthFactor})`);
  if (outfit.dress) result.push(`Dress: ${outfit.dress.name} (Warmth: ${outfit.dress.warmthFactor})`);
  if (outfit.shoes) result.push(`Shoes: ${outfit.shoes.name} (Warmth: ${outfit.shoes.warmthFactor})`);
  
  if (outfit.accessories && outfit.accessories.length > 0) {
    result.push("Accessories:");
    outfit.accessories.forEach(item => {
      result.push(`  - ${item.name} (Warmth: ${item.warmthFactor}, Rain Protection: ${item.rainDeterring}, Sun Protection: ${item.sunDeterring})`);
    });
  }
  
  return result.join("\n");
}

/**
 * Test weather scenarios
 */
console.log("===== OUTFIT SUGGESTION ALGORITHM TEST =====\n");

// Test Scenario 1: Hot summer day
console.log("=== Scenario 1: Hot Summer Day (32°C, Sunny) ===");
const hotWeather = {
  temperature: 32,
  feels_like: 34,
  wind_speed: 5,
  chance_of_rain: 0,
  condition: 'sunny'
};

const summerOutfit = generateOutfit(
  filterAvailableItems(clothingData.clothingItems, 'neutral'),
  hotWeather
);

console.log(formatOutfit(summerOutfit));
console.log("\n");

// Test Scenario 2: Cold winter day
console.log("=== Scenario 2: Cold Winter Day (0°C, Windy) ===");
const coldWeather = {
  temperature: 0,
  feels_like: -5,
  wind_speed: 20,
  chance_of_rain: 0,
  condition: 'clear'
};

const winterOutfit = generateOutfit(
  filterAvailableItems(clothingData.clothingItems, 'neutral'),
  coldWeather
);

console.log(formatOutfit(winterOutfit));
console.log("\n");

// Test Scenario 3: Rainy day
console.log("=== Scenario 3: Rainy Spring Day (15°C, Rainy) ===");
const rainyWeather = {
  temperature: 15,
  feels_like: 13,
  wind_speed: 10,
  chance_of_rain: 80,
  condition: 'rain'
};

const rainyOutfit = generateOutfit(
  filterAvailableItems(clothingData.clothingItems, 'neutral'),
  rainyWeather
);

console.log(formatOutfit(rainyOutfit));
console.log("\n");

// Test Scenario 4: Feminine style preference
console.log("=== Scenario 4: Mild Day with Feminine Style (20°C, Partly Cloudy) ===");
const mildWeather = {
  temperature: 20,
  feels_like: 22,
  wind_speed: 8,
  chance_of_rain: 10,
  condition: 'partly cloudy'
};

const feminineOutfit = generateOutfit(
  filterAvailableItems(clothingData.clothingItems, 'feminine'),
  mildWeather
);

console.log(formatOutfit(feminineOutfit));
console.log("\n");

console.log("===== TEST COMPLETE =====");
