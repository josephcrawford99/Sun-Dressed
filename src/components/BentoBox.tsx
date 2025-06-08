import React, { useEffect } from 'react';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { theme } from '../styles';
import { useOutfitGenerator } from '../hooks/useOutfitGenerator';
import { mockWeather } from '../types/weather';

const BentoBox: React.FC = () => {
  const { outfit, loading, error, generateOutfit } = useOutfitGenerator();

  useEffect(() => {
    generateOutfit(mockWeather, 'daily activities');
  }, [generateOutfit]);

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
    backgroundColor: '#F5F5F5',
    borderRadius: theme.borderRadius.medium,
    marginHorizontal: theme.spacing.xs,
    padding: theme.spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 60,
  },
  loadingBox: {
    backgroundColor: '#E8F4FD',
  },
  errorBox: {
    backgroundColor: '#FFE8E8',
  },
  itemText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.black,
    textAlign: 'center',
    marginBottom: 4,
  },
  labelText: {
    fontSize: 10,
    color: theme.colors.gray,
    textAlign: 'center',
    fontWeight: '500',
  },
  errorText: {
    fontSize: 12,
    color: '#D32F2F',
    textAlign: 'center',
    marginBottom: 4,
  },
});

export default BentoBox;