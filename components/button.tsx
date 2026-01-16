import { Pressable, StyleSheet, type PressableProps } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedButtonProps = PressableProps & {
  children: React.ReactNode;
};

export function ThemedButton({ children, style, disabled, ...rest }: ThemedButtonProps) {
  const backgroundColor = useThemeColor({}, 'tint');
  const textColor = useThemeColor({}, 'text');

  return (
    <Pressable
      style={(state) => [
        styles.button,
        { backgroundColor },
        state.pressed && styles.buttonPressed,
        disabled && styles.buttonDisabled,
        typeof style === 'function' ? style(state) : style,
      ]}
      disabled={disabled}
      {...rest}
    >
      <ThemedText style={[styles.buttonText, { color: textColor }]}>{children}</ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonPressed: {
    opacity: 0.7,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
