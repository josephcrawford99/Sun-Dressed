// Icon component supporting multiple icon libraries for Android and web.

import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { SymbolWeight } from 'expo-symbols';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type IconSymbolName = keyof typeof MAPPING;

/**
 * Mapping of icon names to their respective libraries and icon names.
 */
const MAPPING = {
  'outfit': { library: 'FontAwesome6', name: 'person-half-dress' },
  'me': { library: 'MaterialCommunityIcons', name: 'hanger' },
  'weather': { library: 'MaterialCommunityIcons', name: 'weather-partly-cloudy' },
  'debug': { library: 'MaterialCommunityIcons', name: 'bug' },
} as const;

/**
 * An icon component that uses native SF Symbols on iOS, and various icon libraries on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  const iconConfig = MAPPING[name];

  if (iconConfig.library === 'FontAwesome6') {
    return <FontAwesome6 color={color} size={size} name={iconConfig.name} style={style} />;
  }

  if (iconConfig.library === 'MaterialCommunityIcons') {
    return <MaterialCommunityIcons color={color} size={size} name={iconConfig.name} style={style} />;
  }

  return null;
}
