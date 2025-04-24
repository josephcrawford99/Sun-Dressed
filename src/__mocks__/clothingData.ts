import { ClothingSuggestion } from '../services/clothingService';

export const mockSunnyClothing: ClothingSuggestion = {
  tops: [
    {
      category: 'top',
      name: 'T-Shirt',
      description: 'A lightweight, breathable cotton tee'
    }
  ],
  bottoms: [
    {
      category: 'bottom',
      name: 'Shorts',
      description: 'Light cotton or linen shorts'
    }
  ],
  outerLayers: [],
  accessories: [
    {
      category: 'accessory',
      name: 'Sunglasses',
      description: 'Protect your eyes from UV rays'
    },
    {
      category: 'accessory',
      name: 'Sunscreen',
      description: 'SPF 30+ for sun protection'
    },
    {
      category: 'accessory',
      name: 'Hat',
      description: 'A light cap or sun hat'
    }
  ],
  footwear: [
    {
      category: 'footwear',
      name: 'Sandals',
      description: 'Light summer footwear'
    }
  ]
};

export const mockRainyClothing: ClothingSuggestion = {
  tops: [
    {
      category: 'top',
      name: 'Long-Sleeve Shirt',
      description: 'A comfortable cotton or blend shirt'
    }
  ],
  bottoms: [
    {
      category: 'bottom',
      name: 'Jeans',
      description: 'Regular weight denim jeans'
    }
  ],
  outerLayers: [
    {
      category: 'outer',
      name: 'Rain Jacket',
      description: 'Waterproof jacket with hood'
    }
  ],
  accessories: [
    {
      category: 'accessory',
      name: 'Umbrella',
      description: 'Compact travel umbrella'
    }
  ],
  footwear: [
    {
      category: 'footwear',
      name: 'Waterproof Boots',
      description: 'Keep your feet dry in the rain'
    }
  ]
};

export const mockColdClothing: ClothingSuggestion = {
  tops: [
    {
      category: 'top',
      name: 'Thermal Long-Sleeve',
      description: 'A warm base layer'
    },
    {
      category: 'top',
      name: 'Sweater',
      description: 'A thick wool or fleece sweater'
    }
  ],
  bottoms: [
    {
      category: 'bottom',
      name: 'Thick Pants',
      description: 'Insulated or lined pants'
    }
  ],
  outerLayers: [
    {
      category: 'outer',
      name: 'Heavy Winter Coat',
      description: 'Insulated winter jacket'
    }
  ],
  accessories: [
    {
      category: 'accessory',
      name: 'Scarf',
      description: 'Wool or fleece neck protection'
    },
    {
      category: 'accessory',
      name: 'Gloves',
      description: 'Insulated gloves or mittens'
    },
    {
      category: 'accessory',
      name: 'Beanie',
      description: 'Keep your head warm'
    }
  ],
  footwear: [
    {
      category: 'footwear',
      name: 'Winter Boots',
      description: 'Insulated waterproof boots'
    }
  ]
};
