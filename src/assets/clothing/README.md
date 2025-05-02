# Clothing Images System

This directory contains clothing images for the Sun Dressed app's outfit recommendation feature.

## Directory Structure

```
src/assets/clothing/
├── tops/         # Top clothing items (t-shirts, blouses, etc.)
├── bottoms/      # Bottom clothing items (pants, shorts, skirts)
├── dresses/      # Dresses and jumpsuits
├── outerwear/    # Jackets, coats, cardigans
├── shoes/        # Footwear (shoes, boots, sandals)
└── accessories/  # Accessories (hats, scarves, gloves, etc.)
```

## Adding New Images

1. Place new clothing item images in the appropriate category folder
2. Name the image file after the item ID in the clothingData.json file
   - Example: For a t-shirt with ID "tshirt", save as "tshirt.png"
3. Add the new image to the appropriate map in `src/utils/clothingImages.ts`
   - Example: `tshirt: require('../assets/clothing/tops/tshirt.png')`

## Image Requirements

- PNG format with transparent background is preferred
- Recommended size: 300x300 pixels
- Keep file sizes small (under 50KB if possible)
- Use consistent lighting and angles for all images

## Default Images

Each category has a default fallback image that will be used if a specific item image is not found.

## Usage

```typescript
import { getClothingImage } from '../utils/clothingImages';

// To get an image for a specific clothing item:
const topImage = getClothingImage('tshirt', 'top');
const shoeImage = getClothingImage('sneakers', 'shoes');
```

## Future Enhancements

- Add support for multiple styles of the same item
- Add support for different colors
- Add support for seasonal variations
