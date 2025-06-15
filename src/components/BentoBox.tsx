import React from 'react';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { theme } from '../styles';
import { Outfit } from '../types/Outfit';

interface BentoBoxProps {
  outfit?: Outfit | null;
  loading?: boolean;
  error?: string | null;
  showNoOutfit?: boolean;
  noOutfitDate?: string;
}

const BentoBox: React.FC<BentoBoxProps> = ({ 
  outfit,
  loading = false,
  error = null,
  showNoOutfit = false,
  noOutfitDate
}) => {

  // Handle no-outfit state
  if (showNoOutfit) {
    return (
      <View style={styles.container}>
        <View style={styles.noOutfitContainer}>
          <Text style={styles.noOutfitText}>
            no outfit for date: {noOutfitDate || 'this date'}
          </Text>
        </View>
      </View>
    );
  }

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
    <View style={styles.outerContainer}>
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
      
      {/* Explanation Section */}
      {outfit?.explanation && (
        <View style={styles.explanationContainer}>
          <Text style={styles.explanationText}>
            {outfit.explanation}
          </Text>
        </View>
      )}
      
      {loading && (
        <View style={styles.explanationContainer}>
          <Text style={styles.explanationLoadingText}>
            Generating outfit explanation...
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
  },
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
    marginBottom: theme.spacing.xs,
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
    marginBottom: theme.spacing.xs,
  },
  noOutfitContainer: {
    flex: 1,
    backgroundColor: theme.colors.lightGray,
    borderRadius: theme.borderRadius.medium,
    marginHorizontal: theme.spacing.xs,
    padding: theme.spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
  },
  noOutfitText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.gray,
    textAlign: 'center',
    fontWeight: '500',
    fontStyle: 'italic',
  },
  explanationContainer: {
    marginTop: theme.spacing.sm,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.small,
  },
  explanationText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.black,
    textAlign: 'center',
    lineHeight: 20,
    fontStyle: 'italic',
  },
  explanationLoadingText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default BentoBox;