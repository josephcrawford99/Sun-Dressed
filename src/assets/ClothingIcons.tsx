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
  tshirt: (props: IconProps) => <MaterialCommunityIcons name="tshirt-crew" {...props} />,
  shirt: (props: IconProps) => <MaterialCommunityIcons name="tshirt-v" {...props} />,
  sweater: (props: IconProps) => <MaterialCommunityIcons name="sweater" {...props} />,
  tank: (props: IconProps) => <MaterialCommunityIcons name="tank-top" {...props} />,
  
  // Bottoms
  pants: (props: IconProps) => <MaterialCommunityIcons name="human-handsdown" {...props} />,
  shorts: (props: IconProps) => <MaterialCommunityIcons name="human-handsup" {...props} />,
  jeans: (props: IconProps) => <MaterialCommunityIcons name="account-cowboy-hat" {...props} />,
  skirt: (props: IconProps) => <MaterialCommunityIcons name="human-female-dance" {...props} />,
  
  // Dresses & Outerwear
  dress: (props: IconProps) => <MaterialCommunityIcons name="human-female" {...props} />,
  jacket: (props: IconProps) => <MaterialCommunityIcons name="coat-rack" {...props} />,
  coat: (props: IconProps) => <MaterialCommunityIcons name="hanger" {...props} />,
  
  // Footwear
  sneakers: (props: IconProps) => <MaterialCommunityIcons name="shoe-sneaker" {...props} />,
  boots: (props: IconProps) => <MaterialCommunityIcons name="shoe-boot" {...props} />,
  sandals: (props: IconProps) => <MaterialCommunityIcons name="shoe-casual" {...props} />,
  
  // Accessories
  hat: (props: IconProps) => <MaterialCommunityIcons name="hat-fedora" {...props} />,
  cap: (props: IconProps) => <MaterialCommunityIcons name="baseball-bat" {...props} />,
  watch: (props: IconProps) => <MaterialCommunityIcons name="watch" {...props} />,
  sunglasses: (props: IconProps) => <MaterialCommunityIcons name="sunglasses" {...props} />,
  bag: (props: IconProps) => <MaterialCommunityIcons name="bag-personal" {...props} />,
  belt: (props: IconProps) => <MaterialCommunityIcons name="circle-outline" {...props} />,
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