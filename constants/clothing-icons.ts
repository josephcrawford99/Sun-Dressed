/**
 * Clothing icon mappings
 * Maps human-readable clothing item names to their corresponding icon files
 */

export const CLOTHING_ICONS = {
  "Ankle Boot - Women's": require('@/assets/images/clothing-icons/Ankle_boot_women.png'),
  "Baseball Cap": require('@/assets/images/clothing-icons/Baseball_cap.png'),
  "Beanie": require('@/assets/images/clothing-icons/Beanie.png'),
  "Boots - Men's": require('@/assets/images/clothing-icons/Boots_men.png'),
  "Cardigan": require('@/assets/images/clothing-icons/Cardigan.png'),
  "Flip Flops": require('@/assets/images/clothing-icons/Flip_flops.png'),
  "Fur Coat": require('@/assets/images/clothing-icons/Fur_coat.png'),
  "Fuzzy Socks": require('@/assets/images/clothing-icons/Fuzzy_socks.png'),
  "High Heel - Women's": require('@/assets/images/clothing-icons/High_heel_women.png'),
  "Jean Jacket": require('@/assets/images/clothing-icons/Jean_jacket.png'),
  "Jean Shorts": require('@/assets/images/clothing-icons/Jean_shorts.png'),
  "Jeans": require('@/assets/images/clothing-icons/Jeans.png'),
  "Leather Jacket": require('@/assets/images/clothing-icons/Leather_jacket.png'),
  "Linen Pants": require('@/assets/images/clothing-icons/Linen_pants.png'),
  "Long Sleeve Button Up": require('@/assets/images/clothing-icons/Long_sleeve_button_up.png'),
  "Long Sleeve Top": require('@/assets/images/clothing-icons/Long_sleeve_top.png'),
  "Long Winter Coat": require('@/assets/images/clothing-icons/Long_winter_coat.png'),
  "Maxi Skirt": require('@/assets/images/clothing-icons/Maxi_skirt.png'),
  "Midi Short Sleeve Dress": require('@/assets/images/clothing-icons/Midi_short_sleeve_dress.png'),
  "Midi Skirt": require('@/assets/images/clothing-icons/Midi_skirt.png'),
  "Mini Dress": require('@/assets/images/clothing-icons/Mini_dress.png'),
  "Mini Skirt": require('@/assets/images/clothing-icons/Mini_skirt.png'),
  "Mittens": require('@/assets/images/clothing-icons/Mittens.png'),
  "Open Toe Heels - Women's": require('@/assets/images/clothing-icons/Open_toe_heels_women.png'),
  "Rain Boots": require('@/assets/images/clothing-icons/Rain_boots.png'),
  "Raincoat": require('@/assets/images/clothing-icons/Raincoat.png'),
  "Sandals": require('@/assets/images/clothing-icons/Sandals.png'),
  "Scarf": require('@/assets/images/clothing-icons/Scarf.png'),
  "Short Sleeve Button Up": require('@/assets/images/clothing-icons/Short_sleeve_button_up.png'),
  "Short Sleeve T-Shirt": require('@/assets/images/clothing-icons/Short_sleeve_t_shirt.png'),
  "Sneakers": require('@/assets/images/clothing-icons/Sneakers.png'),
  "Strapless Top": require('@/assets/images/clothing-icons/Strapless_top.png'),
  "Sun Hat": require('@/assets/images/clothing-icons/Sun_hat.png'),
  "Sunglasses": require('@/assets/images/clothing-icons/Sunglasses.png'),
  "Sweater": require('@/assets/images/clothing-icons/Sweater.png'),
  "Sweater Dress": require('@/assets/images/clothing-icons/Sweater_dress.png'),
  "Sweater Vest": require('@/assets/images/clothing-icons/Sweater_vest.png'),
  "Sweatpants": require('@/assets/images/clothing-icons/Sweatpants.png'),
  "Sweatshirt": require('@/assets/images/clothing-icons/Sweatshirt.png'),
  "Tall Boots - Women's": require('@/assets/images/clothing-icons/Tall_boots_women.png'),
  "Tank Top Maxi Dress": require('@/assets/images/clothing-icons/Tank_top_maxi_dress.png'),
  "Tank Top - Men's": require('@/assets/images/clothing-icons/Tank_top_mens.png'),
  "Tank Top - Women's": require('@/assets/images/clothing-icons/Tank_top_womens.png'),
  "Tights": require('@/assets/images/clothing-icons/Tights.png'),
  "Ugg Boots": require('@/assets/images/clothing-icons/Ugg_boots.png'),
  "Umbrella": require('@/assets/images/clothing-icons/Umbrella.png'),
  "Winter Jacket": require('@/assets/images/clothing-icons/Winter_jacket.png'),
  "Winter Vest": require('@/assets/images/clothing-icons/Winter_vest.png'),
} as const;

// Type representing all valid clothing item names
export type AllowedClothingItem = keyof typeof CLOTHING_ICONS;

// Array of all allowed item names (for prompt generation and validation)
export const ALLOWED_ITEM_NAMES: readonly string[] = Object.keys(CLOTHING_ICONS);

// Helper function to get icon path for a given item name
export function getIconForItem(itemName: string): number | undefined {
  return CLOTHING_ICONS[itemName as AllowedClothingItem];
}
