import { StyleSheet, Text, type TextProps } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';
import { theme } from '@/styles/theme';
import { typography } from '@/styles/typography';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    ...typography.body,
    lineHeight: 24,
  },
  defaultSemiBold: {
    ...typography.body,
    lineHeight: 24,
    fontWeight: '600',
  },
  title: {
    ...typography.heading,
    fontSize: theme.fontSize.display,
    lineHeight: 32,
  },
  subtitle: {
    ...typography.subheading,
    fontSize: theme.fontSize.xl,
  },
  link: {
    ...typography.body,
    lineHeight: 30,
    color: theme.colors.primary,
  },
});
