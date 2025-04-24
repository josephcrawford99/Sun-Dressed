import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { ClothingSuggestion } from '../services/clothingService';
import { useTheme } from '../utils/ThemeContext';
import ClothingCard from './ClothingCard';

interface ClothingSuggestionsProps {
  suggestions: ClothingSuggestion;
}

const ClothingSuggestions: React.FC<ClothingSuggestionsProps> = ({ suggestions }) => {
  const { theme } = useTheme();
  const { colors, typography, spacing } = theme;

  const localStyles = StyleSheet.create({
    container: {
      flex: 1,
    },
    title: {
      ...typography.title,
      color: colors.text,
      marginBottom: spacing.md,
    },
    scrollContainer: {
      paddingBottom: spacing.xl,
    }
  });

  return (
    <View style={localStyles.container}>
      <Text style={localStyles.title}>What to Wear</Text>

      <ScrollView style={localStyles.container} contentContainerStyle={localStyles.scrollContainer}>
        <ClothingCard
          title="Tops"
          items={suggestions.tops}
          icon="shirt-outline"
        />

        <ClothingCard
          title="Bottoms"
          items={suggestions.bottoms}
          icon="albums-outline"
        />

        {suggestions.outerLayers.length > 0 && (
          <ClothingCard
            title="Outer Layers"
            items={suggestions.outerLayers}
            icon="leaf-outline"
          />
        )}

        {suggestions.accessories.length > 0 && (
          <ClothingCard
            title="Accessories"
            items={suggestions.accessories}
            icon="glasses-outline"
          />
        )}

        <ClothingCard
          title="Footwear"
          items={suggestions.footwear}
          icon="footsteps-outline"
        />
      </ScrollView>
    </View>
  );
};

export default ClothingSuggestions;
