import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedCard } from '@/components/card';
import { ThemedText } from '@/components/themed-text';
import { Chevron } from '@/components/chevron';
import { getIconForItem } from '@/constants/clothing-items';

export type ItemCardProps = {
  /** Icon name from CLOTHING_ITEMS (e.g., "Ankle_boot_women") */
  iconName: string;
  /** Display name (gender suffix will be stripped) */
  name: string;
  /** Optional elements rendered inline in the header (e.g., quantity badge) */
  headerRight?: React.ReactNode;
  /** Content shown when expanded */
  children: React.ReactNode;
  /** Reset collapse state when this value changes */
  collapseKey?: string;
};

export function ItemCard({ iconName, name, headerRight, children, collapseKey }: ItemCardProps) {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const icon = getIconForItem(iconName);

  // Strip gender suffix from display name
  const displayName = name.replace(/\s+\((masculine|feminine)\)$/, '');

  // Reset collapse when collapseKey changes (e.g., outfit regeneration)
  const [prevKey, setPrevKey] = useState(collapseKey);
  if (collapseKey !== prevKey) {
    setPrevKey(collapseKey);
    setIsCollapsed(true);
  }

  return (
    <ThemedCard variant="default" icon={icon}>
      <Pressable onPress={() => setIsCollapsed(!isCollapsed)}>
        <View style={styles.header}>
          <ThemedText type="subtitle" style={styles.itemName}>
            {displayName}
          </ThemedText>
          {headerRight}
          <Chevron isCollapsed={isCollapsed} />
        </View>
      </Pressable>
      {!isCollapsed && children}
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
});
