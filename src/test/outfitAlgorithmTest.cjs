// Test runner for the outfit algorithm
// Modified to use CommonJS require syntax

const outfitAlgorithmTest = require('../utils/outfitAlgorithmTest.cjs');

console.log("===== OUTFIT SUGGESTION ALGORITHM TEST =====\n");

console.log("=== Example 1: Warm Weather Outfit ===");
const warmOutfit = outfitAlgorithmTest.example1_WarmWeatherOutfit();
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
const coldOutfit = outfitAlgorithmTest.example2_ColdWeatherOutfit();
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
const rainyOutfit = outfitAlgorithmTest.example3_RainyDayOutfit();
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

console.log("===== TEST COMPLETE =====");
