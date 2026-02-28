import { StyleSheet } from 'react-native';

import { ItemCard } from '@/components/item-card';
import { ThemedText } from '@/components/themed-text';
import { PackingItem } from '@/types/trip';

export type PackingItemCardProps = {
  item: PackingItem;
};

export function PackingItemCard({ item }: PackingItemCardProps) {
  return (
    <ItemCard
      iconName={item.iconName}
      name={item.baseName}
      headerRight={<ThemedText style={styles.quantity}>x{item.quantity}</ThemedText>}
    >
      <ThemedText style={styles.notes}>{item.notes}</ThemedText>
    </ItemCard>
  );
}

const styles = StyleSheet.create({
  quantity: {
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.6,
    marginRight: 10,
  },
  notes: {
    fontSize: 13,
    lineHeight: 18,
    opacity: 0.8,
    fontStyle: 'italic',
  },
});
