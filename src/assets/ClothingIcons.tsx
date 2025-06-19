import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '@styles';
import React from 'react';

type IconProps = {
  color?: string;
  size?: number;
};

type IconComponent = ((props?: IconProps) => JSX.Element) | (() => string);

// Common clothing icons using MaterialCommunityIcons
export const ClothingIcons: Record<string, IconComponent> = {
  // Tops
  't-shirt': (props: IconProps) => <MaterialCommunityIcons name="tshirt-v" {...props} />,
  'button-shirt': () => "button shirt",
  'sweater': () => "sweater",
  'hoodie': () => "hoodie",
  'tank-top': () => "tank top",
  'blouse': () => "blouse",
  'polo-shirt': () => "polo shirt",
  
  // Bottoms
  'jeans': (props: IconProps) => <MaterialCommunityIcons name="human-male" {...props} />,
  'shorts': (props: IconProps) => <MaterialCommunityIcons name="human-male" {...props} />,
  'dress-pants': (props: IconProps) => <MaterialCommunityIcons name="account-tie" {...props} />,
  'leggings': (props: IconProps) => <MaterialCommunityIcons name="human-female" {...props} />,
  'skirt': (props: IconProps) => <MaterialCommunityIcons name="human-female" {...props} />,
  'sweatpants': (props: IconProps) => <MaterialCommunityIcons name="human-male" {...props} />,
  
  // Outerwear
  'jacket': () => "jacket",
  'coat': (props: IconProps) => <MaterialCommunityIcons name="hanger" {...props} />,
  'blazer': (props: IconProps) => <MaterialCommunityIcons name="account-tie" {...props} />,
  'cardigan': () => "cardigan",
  'windbreaker': (props: IconProps) => <MaterialCommunityIcons name="weather-windy" {...props} />,
  
  // Footwear
  'sneakers': (props: IconProps) => <MaterialCommunityIcons name="shoe-heel" {...props} />,
  'boots': (props: IconProps) => <MaterialCommunityIcons name="shoe-formal" {...props} />,
  'sandals': (props: IconProps) => <MaterialCommunityIcons name="shoe-heel" {...props} />,
  'dress-shoes': (props: IconProps) => <MaterialCommunityIcons name="shoe-formal" {...props} />,
  'flats': (props: IconProps) => <MaterialCommunityIcons name="shoe-heel" {...props} />,
  
  // Accessories
  'hat': (props: IconProps) => <MaterialCommunityIcons name="hat-fedora" {...props} />,
  'cap': () => "baseball cap",
  'sunglasses': (props: IconProps) => <MaterialCommunityIcons name="sunglasses" {...props} />,
  'watch': (props: IconProps) => <MaterialCommunityIcons name="watch" {...props} />,
  'belt': () => "belt",
  'bag': () => "handbag",
  'scarf': () => "scarf",
  'gloves': () => "gloves",
  'socks': () => "socks",
  
  // Fallback icon for unrecognized items
  'unknown': (props: IconProps) => <MaterialCommunityIcons name="help-circle-outline" {...props} />,
};

// Default props
const defaultProps: IconProps = {
  color: theme.colors.black,
  size: 24,
};

// Apply default props only to icon components (not string functions)
Object.keys(ClothingIcons).forEach(key => {
  const originalIcon = ClothingIcons[key];
  if (typeof originalIcon === 'function' && originalIcon.length > 0) {
    // This is an icon component that takes props
    ClothingIcons[key] = (props: IconProps = {}) => 
      (originalIcon as (props: IconProps) => JSX.Element)({ ...defaultProps, ...props });
  }
  // String functions remain unchanged
});

// Helper function to get icon safely with fallback
export const getClothingIcon = (iconKey: string, props: IconProps = {}) => {
  const IconComponent = ClothingIcons[iconKey] || ClothingIcons.unknown;
  if (typeof IconComponent === 'function' && IconComponent.length === 0) {
    // This is a string function
    return (IconComponent as () => string)();
  }
  // This is an icon component
  return (IconComponent as (props: IconProps) => JSX.Element)(props);
};