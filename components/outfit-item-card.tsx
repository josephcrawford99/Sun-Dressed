import { StyleSheet } from 'react-native';

import { ItemCard } from '@/components/item-card';
import { ItemFeedbackButtons } from '@/components/item-feedback-buttons';
import { ThemedText } from '@/components/themed-text';
import { ClothingItem } from '@/types/outfit';

export type OutfitItemCardProps = ClothingItem;

export function OutfitItemCard({ name, blurb, iconName }: OutfitItemCardProps) {
  return (
    <ItemCard iconName={iconName} name={name} collapseKey={blurb}>
      <ThemedText style={styles.blurb}>{blurb}</ThemedText>
      <ItemFeedbackButtons item={{ name, blurb, iconName }} />
    </ItemCard>
  );
}

const styles = StyleSheet.create({
  blurb: {
    fontSize: 13,
    lineHeight: 18,
    opacity: 0.8,
    fontStyle: 'italic',
  },
});
