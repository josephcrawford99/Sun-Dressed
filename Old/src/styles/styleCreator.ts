import { StyleSheet } from 'react-native';
import { Theme } from './theme';

/**
 * Creates a style sheet with theme context.
 * This allows components to create styles that adapt to the current theme.
 * 
 * @param theme The current theme
 * @param styleFunction A function that returns styles based on the theme
 * @returns StyleSheet object
 * 
 * @example
 * const styles = createStyles(theme, (theme) => ({
 *   container: {
 *     backgroundColor: theme.colors.background,
 *     padding: theme.spacing.md,
 *   }
 * }));
 */
export const createStyles = <T extends Record<string, any>>(
  theme: Theme,
  styleFunction: (theme: Theme) => T
): T => {
  return StyleSheet.create(styleFunction(theme));
};
