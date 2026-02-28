/**
 * Clothing items
 * Single source of truth for all clothing items with gender and category metadata
 */

import { useStore } from '@/store/store';
import { OutfitStyle } from '@/types/outfit';

export type ClothingCategory = 'tops' | 'bottoms' | 'outerwear' | 'footwear' | 'accessories';

export const CATEGORY_ORDER: ClothingCategory[] = ['tops', 'bottoms', 'outerwear', 'footwear', 'accessories'];

export const CATEGORY_LABELS: Record<ClothingCategory, string> = {
  tops: 'Tops',
  bottoms: 'Bottoms',
  outerwear: 'Outerwear',
  footwear: 'Footwear',
  accessories: 'Accessories',
};

// Interface for clothing item metadata
export interface ClothingItem {
  iconName: string;       // PNG filename without extension (e.g., "Ankle_boot_women")
  baseName: string;       // Name for LLM prompt (e.g., "Boots")
  category: ClothingCategory;
  gender?: 'masculine' | 'feminine';  // Optional: only present for gendered items
}

// All clothing items with their metadata
export const CLOTHING_ITEMS: ClothingItem[] = [
  // Masculine items
  { iconName: "Boots_men", baseName: "Boots", category: "footwear", gender: 'masculine' },
  { iconName: "Tank_top_mens", baseName: "Tank Top", category: "tops", gender: 'masculine' },

  // Feminine items
  { iconName: "Ankle_boot_women", baseName: "Boots", category: "footwear", gender: 'feminine' },
  { iconName: "High_heel_women", baseName: "High Heel", category: "footwear", gender: 'feminine' },
  { iconName: "Open_toe_heels_women", baseName: "Open Toe Heels", category: "footwear", gender: 'feminine' },
  { iconName: "Tall_boots_women", baseName: "Tall Boots", category: "footwear", gender: 'feminine' },
  { iconName: "Tank_top_womens", baseName: "Tank Top", category: "tops", gender: 'feminine' },
  { iconName: "Maxi_skirt", baseName: "Maxi Skirt", category: "bottoms", gender: 'feminine' },
  { iconName: "Midi_short_sleeve_dress", baseName: "Midi Short Sleeve Dress", category: "tops", gender: 'feminine' },
  { iconName: "Midi_skirt", baseName: "Midi Skirt", category: "bottoms", gender: 'feminine' },
  { iconName: "Mini_dress", baseName: "Mini Dress", category: "tops", gender: 'feminine' },
  { iconName: "Mini_skirt", baseName: "Mini Skirt", category: "bottoms", gender: 'feminine' },
  { iconName: "Strapless_top", baseName: "Strapless Top", category: "tops", gender: 'feminine' },
  { iconName: "Sweater_dress", baseName: "Sweater Dress", category: "tops", gender: 'feminine' },
  { iconName: "Tank_top_maxi_dress", baseName: "Tank Top Maxi Dress", category: "tops", gender: 'feminine' },
  { iconName: "Tights", baseName: "Tights", category: "bottoms", gender: 'feminine' },
  { iconName: "Ugg_boots", baseName: "Ugg Boots", category: "footwear", gender: 'feminine' },

  // Neutral items (no gender field)
  { iconName: "Baseball_cap", baseName: "Baseball Cap", category: "accessories" },
  { iconName: "Beanie", baseName: "Beanie", category: "accessories" },
  { iconName: "Cardigan", baseName: "Cardigan", category: "tops" },
  { iconName: "Flip_flops", baseName: "Flip Flops", category: "footwear" },
  { iconName: "Fur_coat", baseName: "Fur Coat", category: "outerwear" },
  { iconName: "Fuzzy_socks", baseName: "Fuzzy Socks", category: "footwear" },
  { iconName: "Jean_jacket", baseName: "Jean Jacket", category: "outerwear" },
  { iconName: "Jean_shorts", baseName: "Jean Shorts", category: "bottoms" },
  { iconName: "Jeans", baseName: "Jeans", category: "bottoms" },
  { iconName: "Leather_jacket", baseName: "Leather Jacket", category: "outerwear" },
  { iconName: "Linen_pants", baseName: "Linen Pants", category: "bottoms" },
  { iconName: "Long_sleeve_button_up", baseName: "Long Sleeve Button Up", category: "tops" },
  { iconName: "Long_sleeve_top", baseName: "Long Sleeve Top", category: "tops" },
  { iconName: "Long_winter_coat", baseName: "Long Winter Coat", category: "outerwear" },
  { iconName: "Mittens", baseName: "Mittens", category: "accessories" },
  { iconName: "Rain_boots", baseName: "Rain Boots", category: "footwear" },
  { iconName: "Raincoat", baseName: "Raincoat", category: "outerwear" },
  { iconName: "Sandals", baseName: "Sandals", category: "footwear" },
  { iconName: "Scarf", baseName: "Scarf", category: "accessories" },
  { iconName: "Short_sleeve_button_up", baseName: "Short Sleeve Button Up", category: "tops" },
  { iconName: "Short_sleeve_t_shirt", baseName: "Short Sleeve T-Shirt", category: "tops" },
  { iconName: "Sneakers", baseName: "Sneakers", category: "footwear" },
  { iconName: "Sun_hat", baseName: "Sun Hat", category: "accessories" },
  { iconName: "Sunglasses", baseName: "Sunglasses", category: "accessories" },
  { iconName: "Sweater", baseName: "Sweater", category: "outerwear" },
  { iconName: "Sweater_vest", baseName: "Sweater Vest", category: "outerwear" },
  { iconName: "Sweatpants", baseName: "Sweatpants", category: "bottoms" },
  { iconName: "Sweatshirt", baseName: "Sweatshirt", category: "outerwear" },
  { iconName: "Umbrella", baseName: "Umbrella", category: "accessories" },
  { iconName: "Winter_jacket", baseName: "Winter Jacket", category: "outerwear" },
  { iconName: "Winter_vest", baseName: "Winter Vest", category: "outerwear" },
];

// Static icon mappings (Metro bundler requires static require paths)
const ICON_SOURCES: Record<string, number> = {
  "Ankle_boot_women": require('@/assets/images/clothing-icons/Ankle_boot_women.png'),
  "Baseball_cap": require('@/assets/images/clothing-icons/Baseball_cap.png'),
  "Beanie": require('@/assets/images/clothing-icons/Beanie.png'),
  "Boots_men": require('@/assets/images/clothing-icons/Boots_men.png'),
  "Cardigan": require('@/assets/images/clothing-icons/Cardigan.png'),
  "Flip_flops": require('@/assets/images/clothing-icons/Flip_flops.png'),
  "Fur_coat": require('@/assets/images/clothing-icons/Fur_coat.png'),
  "Fuzzy_socks": require('@/assets/images/clothing-icons/Fuzzy_socks.png'),
  "High_heel_women": require('@/assets/images/clothing-icons/High_heel_women.png'),
  "Jean_jacket": require('@/assets/images/clothing-icons/Jean_jacket.png'),
  "Jean_shorts": require('@/assets/images/clothing-icons/Jean_shorts.png'),
  "Jeans": require('@/assets/images/clothing-icons/Jeans.png'),
  "Leather_jacket": require('@/assets/images/clothing-icons/Leather_jacket.png'),
  "Linen_pants": require('@/assets/images/clothing-icons/Linen_pants.png'),
  "Long_sleeve_button_up": require('@/assets/images/clothing-icons/Long_sleeve_button_up.png'),
  "Long_sleeve_top": require('@/assets/images/clothing-icons/Long_sleeve_top.png'),
  "Long_winter_coat": require('@/assets/images/clothing-icons/Long_winter_coat.png'),
  "Maxi_skirt": require('@/assets/images/clothing-icons/Maxi_skirt.png'),
  "Midi_short_sleeve_dress": require('@/assets/images/clothing-icons/Midi_short_sleeve_dress.png'),
  "Midi_skirt": require('@/assets/images/clothing-icons/Midi_skirt.png'),
  "Mini_dress": require('@/assets/images/clothing-icons/Mini_dress.png'),
  "Mini_skirt": require('@/assets/images/clothing-icons/Mini_skirt.png'),
  "Mittens": require('@/assets/images/clothing-icons/Mittens.png'),
  "Open_toe_heels_women": require('@/assets/images/clothing-icons/Open_toe_heels_women.png'),
  "Rain_boots": require('@/assets/images/clothing-icons/Rain_boots.png'),
  "Raincoat": require('@/assets/images/clothing-icons/Raincoat.png'),
  "Sandals": require('@/assets/images/clothing-icons/Sandals.png'),
  "Scarf": require('@/assets/images/clothing-icons/Scarf.png'),
  "Short_sleeve_button_up": require('@/assets/images/clothing-icons/Short_sleeve_button_up.png'),
  "Short_sleeve_t_shirt": require('@/assets/images/clothing-icons/Short_sleeve_t_shirt.png'),
  "Sneakers": require('@/assets/images/clothing-icons/Sneakers.png'),
  "Strapless_top": require('@/assets/images/clothing-icons/Strapless_top.png'),
  "Sun_hat": require('@/assets/images/clothing-icons/Sun_hat.png'),
  "Sunglasses": require('@/assets/images/clothing-icons/Sunglasses.png'),
  "Sweater": require('@/assets/images/clothing-icons/Sweater.png'),
  "Sweater_dress": require('@/assets/images/clothing-icons/Sweater_dress.png'),
  "Sweater_vest": require('@/assets/images/clothing-icons/Sweater_vest.png'),
  "Sweatpants": require('@/assets/images/clothing-icons/Sweatpants.png'),
  "Sweatshirt": require('@/assets/images/clothing-icons/Sweatshirt.png'),
  "Tall_boots_women": require('@/assets/images/clothing-icons/Tall_boots_women.png'),
  "Tank_top_maxi_dress": require('@/assets/images/clothing-icons/Tank_top_maxi_dress.png'),
  "Tank_top_mens": require('@/assets/images/clothing-icons/Tank_top_mens.png'),
  "Tank_top_womens": require('@/assets/images/clothing-icons/Tank_top_womens.png'),
  "Tights": require('@/assets/images/clothing-icons/Tights.png'),
  "Ugg_boots": require('@/assets/images/clothing-icons/Ugg_boots.png'),
  "Umbrella": require('@/assets/images/clothing-icons/Umbrella.png'),
  "Winter_jacket": require('@/assets/images/clothing-icons/Winter_jacket.png'),
  "Winter_vest": require('@/assets/images/clothing-icons/Winter_vest.png'),
};

// Helper function to get icon for a clothing item from its name
export function getIconForItem(iconName: string): number | undefined {
  return ICON_SOURCES[iconName];
}

/**
 * Get allowed item names for LLM prompts, filtered by style and closet ownership.
 * Reads style and closet from the store. Shared by outfit and trip generation.
 *
 * @returns Array of allowed item names formatted for LLM prompt
 */
export function getAllowedItemNames(): string[] {
  const { style, closet } = useStore.getState();

  return CLOTHING_ITEMS
    .filter((item: ClothingItem) => {
      if (item.gender && style !== 'neutral' && item.gender !== style) return false;
      if (closet[item.iconName] === false) return false;
      return true;
    })
    .map((item: ClothingItem) => {
      if (style === 'neutral' && item.gender) {
        return `${item.baseName} (${item.gender})`;
      }
      return item.baseName;
    });
}

/**
 * Get filtered list of item names for LLM prompt based on user's style preference
 * @param style - User's outfit style preference
 * @returns Array of item names to include in LLM prompt
 */
export function getItemsList(style: OutfitStyle): string[] {
  if (style === 'masculine') {
    // Masculine users get neutral + masculine items
    return CLOTHING_ITEMS
      .filter(item => !item.gender || item.gender === 'masculine')
      .map(item => item.baseName);
  } else if (style === 'feminine') {
    // Feminine users get neutral + feminine items
    return CLOTHING_ITEMS
      .filter(item => !item.gender || item.gender === 'feminine')
      .map(item => item.baseName);
  } else {
    // Neutral users get all items, with gender suffix for gendered items
    return CLOTHING_ITEMS.map(item => {
      if (item.gender) {
        return `${item.baseName} (${item.gender})`;
      }
      return item.baseName;
    });
  }
}

/**
 * Map an LLM response item name to its ClothingItem metadata.
 * Reads style from the store. Handles both plain names ("Jeans")
 * and gendered names ("Boots (feminine)").
 *
 * @param itemName - Item name from LLM response
 * @returns Matching ClothingItem or undefined if not found
 */
export function mapResponseToItem(itemName: string): ClothingItem | undefined {
  const style = useStore.getState().style;
  const genderMatch = itemName.match(/^(.+)\s+\((masculine|feminine)\)$/);

  if (genderMatch) {
    const baseName = genderMatch[1];
    const gender = genderMatch[2] as 'masculine' | 'feminine';
    return CLOTHING_ITEMS.find(
      (item) => item.baseName === baseName && item.gender === gender,
    );
  }

  return CLOTHING_ITEMS.find((item) => {
    if (item.baseName !== itemName) return false;
    if (!item.gender) return true;
    return item.gender === style;
  });
}
