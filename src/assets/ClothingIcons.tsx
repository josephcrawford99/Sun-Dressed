import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '@styles';

type IconProps = {
  color?: string;
  size?: number;
};

// Common clothing icons using MaterialCommunityIcons
export const ClothingIcons = {
  // Tops
  't-shirt': (props: IconProps) => <MaterialCommunityIcons name="tshirt-crew" {...props} />,
  'button-shirt': (props: IconProps) => <MaterialCommunityIcons name="tshirt-v" {...props} />,
  'sweater': (props: IconProps) => <MaterialCommunityIcons name="sweater" {...props} />,
  'hoodie': (props: IconProps) => <MaterialCommunityIcons name="hoodie" {...props} />,
  'tank-top': (props: IconProps) => <MaterialCommunityIcons name="tank-top" {...props} />,
  'blouse': (props: IconProps) => <MaterialCommunityIcons name="tshirt-v" {...props} />,
  'polo-shirt': (props: IconProps) => <MaterialCommunityIcons name="polo" {...props} />,
  
  // Bottoms
  'jeans': (props: IconProps) => <MaterialCommunityIcons name="human-handsdown" {...props} />,
  'shorts': (props: IconProps) => <MaterialCommunityIcons name="human-handsup" {...props} />,
  'dress-pants': (props: IconProps) => <MaterialCommunityIcons name="tuxedo" {...props} />,
  'leggings': (props: IconProps) => <MaterialCommunityIcons name="human-female" {...props} />,
  'skirt': (props: IconProps) => <MaterialCommunityIcons name="human-female-dance" {...props} />,
  'sweatpants': (props: IconProps) => <MaterialCommunityIcons name="human-handsdown" {...props} />,
  
  // Outerwear
  'jacket': (props: IconProps) => <MaterialCommunityIcons name="coat-rack" {...props} />,
  'coat': (props: IconProps) => <MaterialCommunityIcons name="hanger" {...props} />,
  'blazer': (props: IconProps) => <MaterialCommunityIcons name="tuxedo" {...props} />,
  'cardigan': (props: IconProps) => <MaterialCommunityIcons name="sweater" {...props} />,
  'windbreaker': (props: IconProps) => <MaterialCommunityIcons name="weather-windy" {...props} />,
  
  // Footwear
  'sneakers': (props: IconProps) => <MaterialCommunityIcons name="shoe-sneaker" {...props} />,
  'boots': (props: IconProps) => <MaterialCommunityIcons name="shoe-boot" {...props} />,
  'sandals': (props: IconProps) => <MaterialCommunityIcons name="shoe-casual" {...props} />,
  'dress-shoes': (props: IconProps) => <MaterialCommunityIcons name="shoe-formal" {...props} />,
  'flats': (props: IconProps) => <MaterialCommunityIcons name="shoe-heel" {...props} />,
  
  // Accessories
  'hat': (props: IconProps) => <MaterialCommunityIcons name="hat-fedora" {...props} />,
  'cap': (props: IconProps) => <MaterialCommunityIcons name="baseball-cap" {...props} />,
  'sunglasses': (props: IconProps) => <MaterialCommunityIcons name="sunglasses" {...props} />,
  'watch': (props: IconProps) => <MaterialCommunityIcons name="watch" {...props} />,
  'belt': (props: IconProps) => <MaterialCommunityIcons name="circle-outline" {...props} />,
  'bag': (props: IconProps) => <MaterialCommunityIcons name="bag-personal" {...props} />,
  'scarf': (props: IconProps) => <MaterialCommunityIcons name="scarf" {...props} />,
  
  // Fallback icon for unrecognized items
  'unknown': (props: IconProps) => <MaterialCommunityIcons name="help-circle-outline" {...props} />,
};

// Default props
const defaultProps: IconProps = {
  color: theme.colors.black,
  size: 24,
};

// Apply default props to all icons
Object.keys(ClothingIcons).forEach(key => {
  const originalIcon = ClothingIcons[key as keyof typeof ClothingIcons];
  ClothingIcons[key as keyof typeof ClothingIcons] = (props: IconProps) => 
    originalIcon({ ...defaultProps, ...props });
});

// Helper function to get icon safely with fallback
export const getClothingIcon = (iconKey: string, props: IconProps = {}) => {
  const IconComponent = ClothingIcons[iconKey as keyof typeof ClothingIcons] || ClothingIcons.unknown;
  return IconComponent(props);
};