import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ClothingItem } from '../services/clothingService';
import { useTheme } from '../utils/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

interface ClothingCardProps {
  title: string;
  items: ClothingItem[];
  icon: string;
}

const ClothingCard: React.FC<ClothingCardProps> = ({ title, items, icon }) => {
  const { theme } = useTheme();
  const { colors, typography, spacing, effects } = theme;

  const localStyles = StyleSheet.create({
    container: {
      backgroundColor: colors.surface,
      borderRadius: effects.borderRadius.medium,
      marginBottom: spacing.md,
      padding: spacing.md,
      ...effects.shadow.light,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.sm,
    },
    title: {
      ...typography.subtitle,
      color: colors.text,
      marginLeft: spacing.sm,
    },
    itemContainer: {
      marginVertical: spacing.xs,
      paddingVertical: spacing.xs,
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    itemName: {
      ...typography.body,
      color: colors.text,
      fontWeight: '500',
    },
    itemDescription: {
      ...typography.caption,
      color: colors.textSecondary,
      marginTop: spacing.xs,
    },
    emptyText: {
      ...typography.caption,
      color: colors.textSecondary,
      fontStyle: 'italic',
      textAlign: 'center',
      marginTop: spacing.sm,
    },
  });

  return (
    <View style={localStyles.container}>
      <View style={localStyles.header}>
        <Ionicons name={icon as any} size={24} color={colors.primary} />
        <Text style={localStyles.title}>{title}</Text>
      </View>

      {items.length === 0 ? (
        <Text style={localStyles.emptyText}>
          No {title.toLowerCase()} needed for this weather
        </Text>
      ) : (
        items.map((item, index) => (
          <View key={index} style={localStyles.itemContainer}>
            <Text style={localStyles.itemName}>{item.name}</Text>
            {item.description && (
              <Text style={localStyles.itemDescription}>{item.description}</Text>
            )}
          </View>
        ))
      )}
    </View>
  );
};

export default ClothingCard;
