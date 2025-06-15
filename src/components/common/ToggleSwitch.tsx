import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { typography, theme } from '../../styles';

interface ToggleSwitchProps {
  label: string;
  value: string;
  options: {
    value: string;
    label: string;
  }[];
  onValueChange: (value: string) => void;
}

export default function ToggleSwitch({ label, value, options, onValueChange }: ToggleSwitchProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.toggleContainer}>
        {options.map((option, index) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.toggleOption,
              index === 0 && styles.toggleOptionLeft,
              index === options.length - 1 && styles.toggleOptionRight,
              index > 0 && styles.toggleOptionBorder,
              value === option.value && styles.toggleOptionActive
            ]}
            onPress={() => onValueChange(option.value)}
          >
            <Text style={[
              styles.toggleOptionText,
              value === option.value && styles.toggleOptionTextActive
            ]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
  },
  label: {
    ...typography.label,
    marginBottom: theme.spacing.sm,
  },
  toggleContainer: {
    flexDirection: 'row',
    borderRadius: theme.borderRadius.medium,
    borderWidth: 1,
    borderColor: theme.colors.gray,
    overflow: 'hidden',
  },
  toggleOption: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    alignItems: 'center',
    backgroundColor: theme.colors.white,
  },
  toggleOptionLeft: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  toggleOptionRight: {
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
  toggleOptionBorder: {
    borderLeftWidth: 1,
    borderLeftColor: theme.colors.gray,
  },
  toggleOptionActive: {
    backgroundColor: theme.colors.black,
  },
  toggleOptionText: {
    ...typography.button,
    color: theme.colors.black,
  },
  toggleOptionTextActive: {
    color: theme.colors.white,
  },
}); 