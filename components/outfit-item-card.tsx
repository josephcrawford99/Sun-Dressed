import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';


import { ThemedText } from '@/components/themed-text';
import { ThemedCard } from '@/components/ui/card';
import { Chevron } from '@/components/ui/chevron';

export type OutfitItemCardProps = {
  name: string;
  description: string;
  blurb: string;
};

export function OutfitItemCard({ name, description, blurb }: OutfitItemCardProps) {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <ThemedCard variant="default">
      <Pressable onPress={() => setIsCollapsed(!isCollapsed)}>
        <View style={styles.header}>
          <ThemedText type="subtitle" style={styles.itemName}>
            {name}
          </ThemedText>
          <Chevron isCollapsed={isCollapsed} />
        </View>
        <ThemedText style={[styles.itemDescription, isCollapsed && styles.itemDescriptionLast]}>
          {description}
        </ThemedText>
        {!isCollapsed && (
          <ThemedText style={styles.itemBlurb}>{blurb}</ThemedText>
        )}
      </Pressable>
    </ThemedCard>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemName: {
    marginBottom: 0,
    flex: 1,
  },
  itemDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  itemDescriptionLast: {
    marginBottom: 0,
  },
  itemBlurb: {
    fontSize: 13,
    lineHeight: 18,
    opacity: 0.8,
    fontStyle: 'italic',
  },
});
