// Standardized clothing items for LLM outfit generation
// Icons must correspond to keys in ClothingIcons.tsx

export const CLOTHING_ITEMS = {
  tops: [
    't-shirt',
    'button-shirt', 
    'sweater',
    'hoodie',
    'tank-top',
    'blouse',
    'polo-shirt'
  ],
  bottoms: [
    'jeans',
    'shorts', 
    'dress-pants',
    'leggings',
    'skirt',
    'sweatpants'
  ],
  outerwear: [
    'jacket',
    'coat',
    'blazer',
    'cardigan',
    'windbreaker'
  ],
  footwear: [
    'sneakers',
    'boots',
    'sandals',
    'dress-shoes',
    'flats'
  ],
  accessories: [
    'hat',
    'cap',
    'sunglasses',
    'watch',
    'belt',
    'bag',
    'scarf'
  ]
} as const;

// Flattened array of all valid clothing items for LLM prompts
export const ALL_CLOTHING_ITEMS = [
  ...CLOTHING_ITEMS.tops,
  ...CLOTHING_ITEMS.bottoms, 
  ...CLOTHING_ITEMS.outerwear,
  ...CLOTHING_ITEMS.footwear,
  ...CLOTHING_ITEMS.accessories
];

// Type for valid clothing item keys
export type ClothingItemKey = typeof ALL_CLOTHING_ITEMS[number];

// Helper function to check if an item is valid
export function isValidClothingItem(item: string): item is ClothingItemKey {
  return ALL_CLOTHING_ITEMS.includes(item as ClothingItemKey);
}