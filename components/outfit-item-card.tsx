import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedCard } from '@/components/ui/card';

export type OutfitItemCardProps = {
  name: string;
  description: string;
  blurb: string;
};

export function OutfitItemCard({ name, description, blurb }: OutfitItemCardProps) {
  return (
    <ThemedCard variant="default">
      <ThemedText type="subtitle" style={styles.itemName}>
        {name}
      </ThemedText>
      <ThemedText style={styles.itemDescription}>{description}</ThemedText>
      <ThemedText style={styles.itemBlurb}>{blurb}</ThemedText>
    </ThemedCard>
  );
}

const styles = StyleSheet.create({
  itemName: {
    marginBottom: 8,
  },
  itemDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  itemBlurb: {
    fontSize: 13,
    lineHeight: 18,
    opacity: 0.8,
    fontStyle: 'italic',
  },
});
