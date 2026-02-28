import { useColorScheme as useSystemColorScheme } from 'react-native';
import { useStore } from '@/store/store';

/**
 * Wraps React Native's useColorScheme with user preference override.
 * Returns the system color scheme when preference is 'auto',
 * otherwise returns the explicit user choice.
 */
export function useColorScheme() {
  const systemScheme = useSystemColorScheme();
  const preference = useStore((state) => state.colorScheme);

  if (preference === 'auto') return systemScheme;
  return preference;
}
