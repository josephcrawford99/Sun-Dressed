/**
 * Helper module for mapping clothing items to their image assets
 * This enables easy addition of new clothing images in the future
 */

import { ImageSourcePropType } from 'react-native';

// Default fallback images - using mock images for now
const defaultImages = {
  top: require('../assets/mock/top.png'),
  bottom: require('../assets/mock/bottoms.png'),
  dress: require('../assets/mock/top.png'), // Reusing top image for dress
  outerwear: require('../assets/mock/outerwear.png'),
  shoes: require('../assets/mock/shoes.png'),
  accessory: require('../assets/mock/accessory.png'),
};

// Type definition for our clothing image map
interface ClothingImageMap {
  [key: string]: ImageSourcePropType;
}

// Maps for each clothing category - to be populated with actual images
// Top images
const topImages: ClothingImageMap = {
  // Default fallback
  default: defaultImages.top,

  // Actual images we found in the directory
  strapless_top: require('../assets/clothing/tops/Strapless_top.png'),
  tshirt: require('../assets/clothing/tops/T_shirt.png'),
  tank_top: require('../assets/clothing/tops/tank_top.png'),
  // long_sleeve_shirt: require('../assets/clothing/tops/long_sleeve_shirt.png'),
  // sweater: require('../assets/clothing/tops/sweater.png'),
  // polo_shirt: require('../assets/clothing/tops/polo_shirt.png'),
  // henley_shirt: require('../assets/clothing/tops/henley_shirt.png'),
};

// Bottom images
const bottomImages: ClothingImageMap = {
  // Default fallback
  default: defaultImages.bottom,

  // Actual images we found in the directory
  jeans: require('../assets/clothing/bottoms/Jeans.png'),

  // Add more bottoms as you add images
  // shorts_jean: require('../assets/clothing/bottoms/shorts_jean.png'),
  // shorts_athletic: require('../assets/clothing/bottoms/shorts_athletic.png'),
  // mini_skirt: require('../assets/clothing/bottoms/mini_skirt.png'),
  // linen_pants: require('../assets/clothing/bottoms/linen_pants.png'),
  // midi_skirt: require('../assets/clothing/bottoms/midi_skirt.png'),
  // dress_pants: require('../assets/clothing/bottoms/dress_pants.png'),
};

// Dress images
const dressImages: ClothingImageMap = {
  // Default fallback
  default: defaultImages.dress,

  // Actual images we found in the directory
  maxi_dress: require('../assets/clothing/dresses/Maxi_dress.png'),

  // Add more dresses as you add images
  // athletic_mini_dress: require('../assets/clothing/dresses/athletic_mini_dress.png'),
  // mini_sun_dress: require('../assets/clothing/dresses/mini_sun_dress.png'),
  // sweater_dress: require('../assets/clothing/dresses/sweater_dress.png'),
};

// Outerwear images
const outerwearImages: ClothingImageMap = {
  // Default fallback
  default: defaultImages.outerwear,

  // Add more outerwear as you add images
  // short_sleeve_button_up: require('../assets/clothing/outerwear/short_sleeve_button_up.png'),
  // cardigan: require('../assets/clothing/outerwear/cardigan.png'),
  // jean_jacket: require('../assets/clothing/outerwear/jean_jacket.png'),
  rain_coat: require('../assets/clothing/outerwear/Raincoat.png'),
  // sweatshirt: require('../assets/clothing/outerwear/sweatshirt.png'),
  // leather_jacket: require('../assets/clothing/outerwear/leather_jacket.png'),
  // blazer: require('../assets/clothing/outerwear/blazer.png'),
};

// Shoes images
const shoesImages: ClothingImageMap = {
  // Default fallback
  default: defaultImages.shoes,

  // Add more shoes as you add images
  sneakers: require('../assets/clothing/shoes/Sneakers.png'),

  // flip_flops: require('../assets/clothing/shoes/flip_flops.png'),
  // sandals: require('../assets/clothing/shoes/sandals.png'),
  // boots: require('../assets/clothing/shoes/boots.png'),
  // heels: require('../assets/clothing/shoes/heels.png'),
  // rain_boots: require('../assets/clothing/shoes/rain_boots.png'),
  // dress_shoes: require('../assets/clothing/shoes/dress_shoes.png'),
};

// Accessory images
const accessoryImages: ClothingImageMap = {
  // Default fallback
  default: defaultImages.accessory,

  // Actual images we found in the directory
  umbrella: require('../assets/clothing/accessories/Umbrella.png'),

  // Add more accessories as you add images
  sunglasses: require('../assets/clothing/accessories/sunglasses.png'),
  // sun_hat: require('../assets/clothing/accessories/sun_hat.png'),
  // baseball_cap: require('../assets/clothing/accessories/baseball_cap.png'),
  // scarf: require('../assets/clothing/accessories/scarf.png'),
  // gloves: require('../assets/clothing/accessories/gloves.png'),
  // tights: require('../assets/clothing/accessories/tights.png'),
  // beanie: require('../assets/clothing/accessories/beanie.png'),
  // winter_hat: require('../assets/clothing/accessories/winter_hat.png'),
  // tie: require('../assets/clothing/accessories/tie.png'),
};

/**
 * Gets the image for a specific clothing item
 * @param itemId The ID of the clothing item
 * @param category The category of the clothing item
 * @returns The image source for the clothing item
 */
export function getClothingImage(itemId: string, category: 'top' | 'bottom' | 'dress' | 'outerwear' | 'shoes' | 'accessory'): ImageSourcePropType {
  // Select the appropriate image map based on category
  let imageMap: ClothingImageMap;

  switch (category) {
    case 'top':
      imageMap = topImages;
      break;
    case 'bottom':
      imageMap = bottomImages;
      break;
    case 'dress':
      imageMap = dressImages;
      break;
    case 'outerwear':
      imageMap = outerwearImages;
      break;
    case 'shoes':
      imageMap = shoesImages;
      break;
    case 'accessory':
      imageMap = accessoryImages;
      break;
    default:
      return defaultImages.top; // Fallback for unknown category
  }

  // Return the specific image if available, otherwise return the default for that category
  return imageMap[itemId] || imageMap.default;
}

/**
 * Gets the clothing category from an item's ID
 * This is a helper function to determine what type of item we're dealing with
 * @param itemId The ID of the clothing item
 * @returns The category of the clothing item
 */
export function getCategoryFromItemId(itemId: string): 'top' | 'bottom' | 'dress' | 'outerwear' | 'shoes' | 'accessory' {
  if (itemId.includes('top') || itemId.includes('shirt') || itemId.includes('sweater') && !itemId.includes('dress')) {
    return 'top';
  } else if (itemId.includes('bottom') || itemId.includes('pants') || itemId.includes('skirt') || itemId.includes('shorts') || itemId.includes('jeans')) {
    return 'bottom';
  } else if (itemId.includes('dress')) {
    return 'dress';
  } else if (itemId.includes('coat') || itemId.includes('jacket') || itemId.includes('cardigan')) {
    return 'outerwear';
  } else if (itemId.includes('shoes') || itemId.includes('boots') || itemId.includes('sandals') || itemId.includes('sneakers') || itemId.includes('heels')) {
    return 'shoes';
  } else {
    return 'accessory'; // Default if we can't determine
  }
}
