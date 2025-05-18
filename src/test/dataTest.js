// Simple test script for our outfit algorithm
const path = require('path');
const fs = require('fs');

// Load the clothing data
const clothingDataPath = path.join(__dirname, '../mocks/clothingData.json');
const clothingData = JSON.parse(fs.readFileSync(clothingDataPath, 'utf8'));

console.log("===== OUTFIT SUGGESTION ALGORITHM TEST =====\n");

// Check if clothing data is loaded correctly
console.log(`Loaded ${clothingData.clothingItems.length} clothing items`);

// Display items by category
const categories = [...new Set(clothingData.clothingItems.map(item => item.category))];
console.log("\nItems by category:");
categories.forEach(category => {
  const itemsInCategory = clothingData.clothingItems.filter(item => item.category === category);
  console.log(`- ${category}: ${itemsInCategory.length} items`);
});

// Display warmth range
const warmthValues = clothingData.clothingItems.map(item => item.warmthFactor);
const minWarmth = Math.min(...warmthValues);
const maxWarmth = Math.max(...warmthValues);
console.log(`\nWarmth factor range: ${minWarmth} (coolest) to ${maxWarmth} (warmest)`);

// Display some sample items
console.log("\nSample items from each category:");
categories.forEach(category => {
  const sampleItem = clothingData.clothingItems.find(item => item.category === category);
  console.log(`- ${category}: ${sampleItem.name} (Warmth: ${sampleItem.warmthFactor}, Style: ${sampleItem.style})`);
});

console.log("\n===== TEST COMPLETE =====");
