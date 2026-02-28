import { StyleSheet } from 'react-native';

import { ThemedButton, type ThemedButtonProps } from '@/components/button';
import { useThemeColor } from '@/hooks/use-theme-color';

export function ThemedDestructiveButton({ style, children, ...rest }: ThemedButtonProps) {
  const errorBg = useThemeColor({}, 'cardError');
  const errorBorder = useThemeColor({}, 'cardErrorBorder');

  return (
    <ThemedButton
      style={(state) => [
        { backgroundColor: errorBg, borderWidth: 1, borderColor: errorBorder },
        typeof style === 'function' ? style(state) : style,
      ]}
      {...rest}
    >
      {children}
    </ThemedButton>
  );
}
