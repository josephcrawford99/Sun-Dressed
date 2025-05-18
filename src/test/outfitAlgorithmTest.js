/**
 * Test file for the outfit suggestion algorithm
 * This script runs different test scenarios to verify the algorithm works as expected
 */

import { 
  example1_WarmWeatherOutfit,
  example2_ColdWeatherOutfit,
  example3_RainyDayOutfit,
  example4_RequiredItemsOutfit,
  example5_FeminineStyleOutfit,
  example6_FeedbackProcessing
} from '../utils/outfitAlgorithmTest';

console.log("===== OUTFIT SUGGESTION ALGORITHM TEST =====\n");

console.log("=== Example 1: Warm Weather Outfit ===");
const warmOutfit = example1_WarmWeatherOutfit();
console.log("Warm Weather Outfit Items:");
if (warmOutfit.top) console.log(`- Top: ${warmOutfit.top.name} (Warmth: ${warmOutfit.top.warmthFactor})`);
if (warmOutfit.bottom) console.log(`- Bottom: ${warmOutfit.bottom.name} (Warmth: ${warmOutfit.bottom.warmthFactor})`);
if (warmOutfit.dress) console.log(`- Dress: ${warmOutfit.dress.name} (Warmth: ${warmOutfit.dress.warmthFactor})`);
console.log(`- Shoes: ${warmOutfit.shoes.name} (Warmth: ${warmOutfit.shoes.warmthFactor})`);
if (warmOutfit.outerwear && warmOutfit.outerwear.length > 0) {
  console.log("- Outerwear:");
  warmOutfit.outerwear.forEach(item => console.log(`  * ${item.name} (Warmth: ${item.warmthFactor})`));
}
if (warmOutfit.hat) console.log(`- Hat: ${warmOutfit.hat.name}`);
if (warmOutfit.accessories && warmOutfit.accessories.length > 0) {
  console.log("- Accessories:");
  warmOutfit.accessories.forEach(item => console.log(`  * ${item.name}`));
}
console.log(`Score: ${warmOutfit.score?.toFixed(2)}\n`);

console.log("=== Example 2: Cold Weather Outfit ===");
const coldOutfit = example2_ColdWeatherOutfit();
console.log("Cold Weather Outfit Items:");
if (coldOutfit.top) console.log(`- Top: ${coldOutfit.top.name} (Warmth: ${coldOutfit.top.warmthFactor})`);
if (coldOutfit.bottom) console.log(`- Bottom: ${coldOutfit.bottom.name} (Warmth: ${coldOutfit.bottom.warmthFactor})`);
if (coldOutfit.dress) console.log(`- Dress: ${coldOutfit.dress.name} (Warmth: ${coldOutfit.dress.warmthFactor})`);
console.log(`- Shoes: ${coldOutfit.shoes.name} (Warmth: ${coldOutfit.shoes.warmthFactor})`);
if (coldOutfit.outerwear && coldOutfit.outerwear.length > 0) {
  console.log("- Outerwear:");
  coldOutfit.outerwear.forEach(item => console.log(`  * ${item.name} (Warmth: ${item.warmthFactor})`));
}
if (coldOutfit.hat) console.log(`- Hat: ${coldOutfit.hat.name}`);
if (coldOutfit.accessories && coldOutfit.accessories.length > 0) {
  console.log("- Accessories:");
  coldOutfit.accessories.forEach(item => console.log(`  * ${item.name}`));
}
console.log(`Score: ${coldOutfit.score?.toFixed(2)}\n`);

console.log("=== Example 3: Rainy Day Outfit ===");
const rainyOutfit = example3_RainyDayOutfit();
console.log("Rainy Day Outfit Items:");
if (rainyOutfit.top) console.log(`- Top: ${rainyOutfit.top.name} (Rain Protection: ${rainyOutfit.top.rainDeterring})`);
if (rainyOutfit.bottom) console.log(`- Bottom: ${rainyOutfit.bottom.name} (Rain Protection: ${rainyOutfit.bottom.rainDeterring})`);
if (rainyOutfit.dress) console.log(`- Dress: ${rainyOutfit.dress.name} (Rain Protection: ${rainyOutfit.dress.rainDeterring})`);
console.log(`- Shoes: ${rainyOutfit.shoes.name} (Rain Protection: ${rainyOutfit.shoes.rainDeterring})`);
if (rainyOutfit.outerwear && rainyOutfit.outerwear.length > 0) {
  console.log("- Outerwear:");
  rainyOutfit.outerwear.forEach(item => console.log(`  * ${item.name} (Rain Protection: ${item.rainDeterring})`));
}
if (rainyOutfit.accessories && rainyOutfit.accessories.length > 0) {
  console.log("- Accessories:");
  rainyOutfit.accessories.forEach(item => console.log(`  * ${item.name} (Rain Protection: ${item.rainDeterring})`));
}
console.log(`Score: ${rainyOutfit.score?.toFixed(2)}\n`);

console.log("=== Example 4: Required Items Outfit ===");
const requiredItemsOutfit = example4_RequiredItemsOutfit();
console.log("Required Items Outfit:");
if (requiredItemsOutfit.top) console.log(`- Top: ${requiredItemsOutfit.top.name} (ID: ${requiredItemsOutfit.top.id})`);
if (requiredItemsOutfit.bottom) console.log(`- Bottom: ${requiredItemsOutfit.bottom.name} (ID: ${requiredItemsOutfit.bottom.id})`);
if (requiredItemsOutfit.dress) console.log(`- Dress: ${requiredItemsOutfit.dress.name} (ID: ${requiredItemsOutfit.dress.id})`);
console.log(`- Shoes: ${requiredItemsOutfit.shoes.name} (ID: ${requiredItemsOutfit.shoes.id})`);
if (requiredItemsOutfit.outerwear && requiredItemsOutfit.outerwear.length > 0) {
  console.log("- Outerwear:");
  requiredItemsOutfit.outerwear.forEach(item => console.log(`  * ${item.name} (ID: ${item.id})`));
}
console.log(`Score: ${requiredItemsOutfit.score?.toFixed(2)}\n`);

console.log("=== Example 5: Feminine Style Outfit ===");
const feminineOutfit = example5_FeminineStyleOutfit();
console.log("Feminine Style Outfit Items:");
if (feminineOutfit.top) console.log(`- Top: ${feminineOutfit.top.name} (Style: ${feminineOutfit.top.style})`);
if (feminineOutfit.bottom) console.log(`- Bottom: ${feminineOutfit.bottom.name} (Style: ${feminineOutfit.bottom.style})`);
if (feminineOutfit.dress) console.log(`- Dress: ${feminineOutfit.dress.name} (Style: ${feminineOutfit.dress.style})`);
console.log(`- Shoes: ${feminineOutfit.shoes.name} (Style: ${feminineOutfit.shoes.style})`);
if (feminineOutfit.outerwear && feminineOutfit.outerwear.length > 0) {
  console.log("- Outerwear:");
  feminineOutfit.outerwear.forEach(item => console.log(`  * ${item.name} (Style: ${item.style})`));
}
console.log(`Score: ${feminineOutfit.score?.toFixed(2)}\n`);

console.log("=== Example 6: Feedback Processing ===");
const feedbackOutfit = example6_FeedbackProcessing();
console.log("Feedback-Adjusted Outfit Items:");
if (feedbackOutfit.top) console.log(`- Top: ${feedbackOutfit.top.name}`);
if (feedbackOutfit.bottom) console.log(`- Bottom: ${feedbackOutfit.bottom.name}`);
if (feedbackOutfit.dress) console.log(`- Dress: ${feedbackOutfit.dress.name}`);
console.log(`- Shoes: ${feedbackOutfit.shoes.name}`);
if (feedbackOutfit.outerwear && feedbackOutfit.outerwear.length > 0) {
  console.log("- Outerwear:");
  feedbackOutfit.outerwear.forEach(item => console.log(`  * ${item.name}`));
}
console.log(`Score: ${feedbackOutfit.score?.toFixed(2)}\n`);

console.log("===== TEST COMPLETE =====");
