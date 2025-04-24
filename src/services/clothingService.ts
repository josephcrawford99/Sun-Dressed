import { WeatherData } from './weatherService';

export interface ClothingItem {
  category: 'top' | 'bottom' | 'outer' | 'accessory' | 'footwear';
  name: string;
  description?: string;
}

export interface ClothingSuggestion {
  tops: ClothingItem[];
  bottoms: ClothingItem[];
  outerLayers: ClothingItem[];
  accessories: ClothingItem[];
  footwear: ClothingItem[];
}

/**
 * Generate clothing suggestions based on weather conditions
 */
export const getSuggestions = (weatherData: WeatherData): ClothingSuggestion => {
  const { temperature, description, wind_speed, time_of_day } = weatherData;

  // Default empty suggestion
  const suggestion: ClothingSuggestion = {
    tops: [],
    bottoms: [],
    outerLayers: [],
    accessories: [],
    footwear: []
  };

  // Add tops based on temperature
  if (temperature < 10) {
    suggestion.tops.push({
      category: 'top',
      name: 'Thermal Long-Sleeve Shirt',
      description: 'A warm base layer'
    });
    suggestion.tops.push({
      category: 'top',
      name: 'Sweater',
      description: 'A thick wool or fleece sweater'
    });
  } else if (temperature < 20) {
    suggestion.tops.push({
      category: 'top',
      name: 'Long-Sleeve Shirt',
      description: 'A comfortable cotton or blend shirt'
    });
  } else {
    suggestion.tops.push({
      category: 'top',
      name: 'T-Shirt',
      description: 'A lightweight, breathable tee'
    });
  }

  // Add bottoms based on temperature
  if (temperature < 10) {
    suggestion.bottoms.push({
      category: 'bottom',
      name: 'Jeans or Thick Pants',
      description: 'Something warm and comfortable'
    });
  } else if (temperature < 20) {
    suggestion.bottoms.push({
      category: 'bottom',
      name: 'Pants or Jeans',
      description: 'Regular weight pants'
    });
  } else {
    suggestion.bottoms.push({
      category: 'bottom',
      name: 'Shorts or Light Pants',
      description: 'Something light and breathable'
    });
  }

  // Add outer layers based on temperature and conditions
  if (temperature < 5) {
    suggestion.outerLayers.push({
      category: 'outer',
      name: 'Heavy Winter Coat',
      description: 'A well-insulated winter jacket'
    });
  } else if (temperature < 15) {
    suggestion.outerLayers.push({
      category: 'outer',
      name: 'Light Jacket',
      description: 'A medium-weight jacket'
    });
  } else if (temperature < 20 || description.includes('rain')) {
    suggestion.outerLayers.push({
      category: 'outer',
      name: 'Light Jacket or Hoodie',
      description: 'Something for light warmth or rain protection'
    });
  }

  // Add footwear based on conditions
  if (description.includes('rain') || description.includes('snow')) {
    suggestion.footwear.push({
      category: 'footwear',
      name: 'Waterproof Boots or Shoes',
      description: 'To keep your feet dry'
    });
  } else if (temperature > 20) {
    suggestion.footwear.push({
      category: 'footwear',
      name: 'Comfortable Shoes or Sandals',
      description: 'Light and breathable'
    });
  } else {
    suggestion.footwear.push({
      category: 'footwear',
      name: 'Closed Shoes or Sneakers',
      description: 'Comfortable for walking'
    });
  }

  // Add accessories based on conditions
  if (temperature < 5) {
    suggestion.accessories.push({
      category: 'accessory',
      name: 'Hat, Gloves, and Scarf',
      description: 'Protect extremities from cold'
    });
  } else if (description.includes('rain')) {
    suggestion.accessories.push({
      category: 'accessory',
      name: 'Umbrella',
      description: 'Stay dry in the rain'
    });
  } else if (description.includes('sun') || description.includes('clear')) {
    suggestion.accessories.push({
      category: 'accessory',
      name: 'Sunglasses',
      description: 'Protect your eyes from UV'
    });

    if (time_of_day === 'morning' || time_of_day === 'afternoon') {
      suggestion.accessories.push({
        category: 'accessory',
        name: 'Sunscreen',
        description: 'Protect your skin from UV'
      });
    }
  }

  return suggestion;
};
