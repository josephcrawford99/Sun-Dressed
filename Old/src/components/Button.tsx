import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  TouchableOpacityProps
} from 'react-native';
import { buttonStyles, colors, defaultTheme } from '../styles/theme';

type ButtonType = 'primary' | 'secondary' | 'tertiary' | 'danger' | 'success';

interface ButtonProps extends TouchableOpacityProps {
  title?: string;
  onPress: () => void;
  type?: ButtonType;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
  loading?: boolean;
  small?: boolean;
  children?: React.ReactNode;
}

/**
 * A standardized button component following the app's design system.
 * Supports both title prop and children for flexible content.
 */
const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  type = 'primary',
  style,
  textStyle,
  disabled = false,
  loading = false,
  small = false,
  children,
  ...rest
}) => {
  // Use the appropriate button style for the type
  const buttonStyle = buttonStyles[type] || buttonStyles.primary;

  // Get the size-specific styles
  const sizeStyles = small ? styles.smallButton : styles.button;
  const textSizeStyles = small ? styles.smallText : styles.text;

  return (
    <TouchableOpacity
      style={[
        sizeStyles,
        { backgroundColor: buttonStyle.backgroundColor },
        buttonStyle.borderColor && {
          borderColor: buttonStyle.borderColor,
          borderWidth: buttonStyle.borderWidth || 1
        },
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator
          size={small ? 'small' : 'small'}
          color={buttonStyle.textColor}
        />
      ) : children ? (
        children
      ) : (
        <Text
          style={[
            textSizeStyles,
            { color: buttonStyle.textColor },
            textStyle,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
    ...defaultTheme.effects.shadow.light,
  },
  smallButton: {
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80,
    ...defaultTheme.effects.shadow.light,
  },
  text: {
    fontWeight: '600',
    fontSize: 16,
  },
  smallText: {
    fontWeight: '600',
    fontSize: 14,
  },
  disabled: {
    opacity: 0.6,
  },
});

export default Button;
