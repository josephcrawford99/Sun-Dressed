import { theme } from '@/styles/theme';
import { typography } from '@/styles/typography';
import React from 'react';
import { StyleSheet, TextInput as RNTextInput, TextInputProps as RNTextInputProps, View, Text } from 'react-native';

export interface TextInputProps extends RNTextInputProps {
  label?: string;
  size?: 'small' | 'medium' | 'large';
  error?: string;
}

export function TextInput({
  label,
  size = 'medium',
  error,
  style,
  ...props
}: TextInputProps) {
  const inputStyles = [
    styles.base,
    styles[size],
    error && styles.error,
    style,
  ];

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <RNTextInput
        style={inputStyles}
        placeholderTextColor={theme.colors.textSecondary}
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
  },
  base: {
    borderWidth: 1,
    borderColor: theme.colors.gray,
    borderRadius: theme.borderRadius.medium,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.white,
    fontSize: theme.fontSize.md,
    ...typography.body,
  },
  small: {
    height: 36,
    fontSize: theme.fontSize.sm,
    paddingVertical: theme.spacing.sm,
  },
  medium: {
    minHeight: 48,
    fontSize: theme.fontSize.md,
    paddingVertical: theme.spacing.md,
  },
  large: {
    height: 56,
    fontSize: theme.fontSize.lg,
    paddingVertical: theme.spacing.lg,
  },
  error: {
    borderColor: theme.colors.error,
  },
  label: {
    ...typography.label,
    marginBottom: theme.spacing.sm,
  },
  errorText: {
    ...typography.body,
    fontSize: theme.fontSize.xs,
    color: theme.colors.error,
    marginTop: theme.spacing.xs,
  },
});