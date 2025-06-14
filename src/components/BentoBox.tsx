import React from 'react';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { theme } from '../styles';
import { Weather } from '../types/weather';
import { Outfit } from '../types/Outfit';

interface BentoBoxProps {
  weather?: Weather;
  activity?: string;
  outfit?: Outfit | null;
  loading?: boolean;
  error?: string | null;
}

const BentoBox: React.FC<BentoBoxProps> = ({ 
  weather, 
  activity = 'daily activities',
  outfit,
  loading = false,
  error = null
}) => {

  const renderOutfitItem = (item: string | undefined, label: string) => {
    if (loading) {
      return (
        <View style={[styles.box, styles.loadingBox]}>
          <ActivityIndicator size="small" color={theme.colors.black} />
          <Text style={styles.labelText}>{label}</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={[styles.box, styles.errorBox]}>
          <Text style={styles.errorText}>Error</Text>
          <Text style={styles.labelText}>{label}</Text>
        </View>
      );
    }

    return (
      <View style={styles.box}>
        <Text style={styles.itemText}>{item || 'None'}</Text>
        <Text style={styles.labelText}>{label}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.column}>
        {renderOutfitItem(outfit?.top, 'Top')}
        {renderOutfitItem(outfit?.bottom, 'Bottom')}
      </View>
      <View style={styles.column}>
        {renderOutfitItem(outfit?.outerwear?.[0], 'Outerwear')}
        {renderOutfitItem(outfit?.accessories?.[0], 'Accessories')}
        {renderOutfitItem(outfit?.shoes, 'Shoes')}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
    gap: theme.spacing.xs,
  },
  column: {
    flex: 1,
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
  },
  box: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.medium,
    marginHorizontal: theme.spacing.xs,
    padding: theme.spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 60,
  },
  loadingBox: {
    backgroundColor: theme.colors.surfaceVariant,
  },
  errorBox: {
    backgroundColor: theme.colors.errorSurface,
  },
  itemText: {
    fontSize: theme.fontSize.sm,
    fontWeight: '600',
    color: theme.colors.black,
    textAlign: 'center',
    marginBottom: 4,
  },
  labelText: {
    fontSize: theme.fontSize.xxs,
    color: theme.colors.gray,
    textAlign: 'center',
    fontWeight: '500',
  },
  errorText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.error,
    textAlign: 'center',
    marginBottom: 4,
  },
});

export default BentoBox;