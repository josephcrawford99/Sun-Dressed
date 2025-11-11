/**
 * Clothing icon mappings
 * Single source of truth for all clothing items with gender metadata
 */

import { OutfitStyle } from '@/types/outfit';

// Interface for clothing item metadata
export interface ClothingItem {
  iconPath: string;       // PNG filename without extension (e.g., "Ankle_boot_women")
  baseName: string;       // Name for LLM prompt (e.g., "Boots")
  gender?: 'masculine' | 'feminine';  // Optional: only present for gendered items
}

// All clothing items with their metadata
export const CLOTHING_ITEMS: ClothingItem[] = [
  // Masculine items
  { iconPath: "Boots_men", baseName: "Boots", gender: 'masculine' },
  { iconPath: "Tank_top_mens", baseName: "Tank Top", gender: 'masculine' },

  // Feminine items
  { iconPath: "Ankle_boot_women", baseName: "Boots", gender: 'feminine' },
  { iconPath: "High_heel_women", baseName: "High Heel", gender: 'feminine' },
  { iconPath: "Open_toe_heels_women", baseName: "Open Toe Heels", gender: 'feminine' },
  { iconPath: "Tall_boots_women", baseName: "Tall Boots", gender: 'feminine' },
  { iconPath: "Tank_top_womens", baseName: "Tank Top", gender: 'feminine' },
  { iconPath: "Maxi_skirt", baseName: "Maxi Skirt", gender: 'feminine' },
  { iconPath: "Midi_short_sleeve_dress", baseName: "Midi Short Sleeve Dress", gender: 'feminine' },
  { iconPath: "Midi_skirt", baseName: "Midi Skirt", gender: 'feminine' },
  { iconPath: "Mini_dress", baseName: "Mini Dress", gender: 'feminine' },
  { iconPath: "Mini_skirt", baseName: "Mini Skirt", gender: 'feminine' },
  { iconPath: "Strapless_top", baseName: "Strapless Top", gender: 'feminine' },
  { iconPath: "Sweater_dress", baseName: "Sweater Dress", gender: 'feminine' },
  { iconPath: "Tank_top_maxi_dress", baseName: "Tank Top Maxi Dress", gender: 'feminine' },
  { iconPath: "Tights", baseName: "Tights", gender: 'feminine' },
  { iconPath: "Ugg_boots", baseName: "Ugg Boots", gender: 'feminine' },


  // Neutral items (no gender field)
  { iconPath: "Baseball_cap", baseName: "Baseball Cap" },
  { iconPath: "Beanie", baseName: "Beanie" },
  { iconPath: "Cardigan", baseName: "Cardigan" },
  { iconPath: "Flip_flops", baseName: "Flip Flops" },
  { iconPath: "Fur_coat", baseName: "Fur Coat" },
  { iconPath: "Fuzzy_socks", baseName: "Fuzzy Socks" },
  { iconPath: "Jean_jacket", baseName: "Jean Jacket" },
  { iconPath: "Jean_shorts", baseName: "Jean Shorts" },
  { iconPath: "Jeans", baseName: "Jeans" },
  { iconPath: "Leather_jacket", baseName: "Leather Jacket" },
  { iconPath: "Linen_pants", baseName: "Linen Pants" },
  { iconPath: "Long_sleeve_button_up", baseName: "Long Sleeve Button Up" },
  { iconPath: "Long_sleeve_top", baseName: "Long Sleeve Top" },
  { iconPath: "Long_winter_coat", baseName: "Long Winter Coat" },
  { iconPath: "Mittens", baseName: "Mittens" },
  { iconPath: "Rain_boots", baseName: "Rain Boots" },
  { iconPath: "Raincoat", baseName: "Raincoat" },
  { iconPath: "Sandals", baseName: "Sandals" },
  { iconPath: "Scarf", baseName: "Scarf" },
  { iconPath: "Short_sleeve_button_up", baseName: "Short Sleeve Button Up" },
  { iconPath: "Short_sleeve_t_shirt", baseName: "Short Sleeve T-Shirt" },
  { iconPath: "Sneakers", baseName: "Sneakers" },
  { iconPath: "Sun_hat", baseName: "Sun Hat" },
  { iconPath: "Sunglasses", baseName: "Sunglasses" },
  { iconPath: "Sweater", baseName: "Sweater" },
  { iconPath: "Sweater_vest", baseName: "Sweater Vest" },
  { iconPath: "Sweatpants", baseName: "Sweatpants" },
  { iconPath: "Sweatshirt", baseName: "Sweatshirt" },
  { iconPath: "Umbrella", baseName: "Umbrella" },
  { iconPath: "Winter_jacket", baseName: "Winter Jacket" },
  { iconPath: "Winter_vest", baseName: "Winter Vest" },
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

// Helper function to get icon for a clothing item
export function getIconForItem(iconPath: string): number | undefined {
  return ICON_SOURCES[iconPath];
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
 * Map LLM response item name to its icon
 * @param itemName - Item name from LLM response (e.g., "Boots" or "Boots (feminine)")
 * @param userStyle - User's outfit style preference
 * @returns Icon source number or undefined if not found
 */
export function mapResponseItemToIcon(itemName: string, userStyle: OutfitStyle): number | undefined {
  // Check if item name has gender suffix (for neutral users)
  const genderMatch = itemName.match(/^(.+)\s+\((masculine|feminine)\)$/);

  let matchingItem: ClothingItem | undefined;

  if (genderMatch) {
    // Neutral user with gendered item: "Boots (masculine)"
    const baseName = genderMatch[1];
    const gender = genderMatch[2] as 'masculine' | 'feminine';
    matchingItem = CLOTHING_ITEMS.find(
      item => item.baseName === baseName && item.gender === gender
    );
  } else {
    // Masculine/feminine user OR neutral user with neutral item
    // Match by baseName and userStyle (or no gender for neutral items)
    matchingItem = CLOTHING_ITEMS.find(item => {
      if (item.baseName !== itemName) return false;

      // If item has no gender, it matches any style
      if (!item.gender) return true;

      // If item has gender, it must match userStyle
      return item.gender === userStyle;
    });
  }

  return matchingItem ? getIconForItem(matchingItem.iconPath) : undefined;
}
