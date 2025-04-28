import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { typography } from '../styles/typography';
import { createTheme } from '../styles/theme';

const theme = createTheme();

interface ButtonProps {
  children: React.ReactNode;
  onPress: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

const Button: React.FC<ButtonProps> = ({ children, onPress, disabled, style }) => {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.buttonDisabled, style]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text style={typography.button}>{children}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  buttonDisabled: {
    backgroundColor: theme.colors.textSecondary,
    opacity: 0.5,
  },
});

export default Button;
