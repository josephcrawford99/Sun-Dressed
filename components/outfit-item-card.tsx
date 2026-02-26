import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedCard } from '@/components/card';
import { Chevron } from '@/components/chevron';
import { ItemFeedbackButtons } from '@/components/item-feedback-buttons';
import { mapResponseItemToIcon } from '@/constants/clothing-items';
import { useStore } from '@/store/store';

export type OutfitItemCardProps = {
  name: string;
  blurb: string;
};

export function OutfitItemCard({ name, blurb }: OutfitItemCardProps) {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const userStyle = useStore((state) => state.style);

  // Reset collapse state when outfit regenerates (blurb is always new per generation)
  useEffect(() => {
    setIsCollapsed(true);
  }, [blurb]);
  const icon = mapResponseItemToIcon(name, userStyle);

  // Strip gender suffix from display name (e.g., "Boots (feminine)" -> "Boots")
  const displayName = name.replace(/\s+\((masculine|feminine)\)$/, '');

  return (
    <ThemedCard variant="default" icon={icon}>
      <Pressable onPress={() => setIsCollapsed(!isCollapsed)}>
        <View style={styles.header}>
          <ThemedText type="subtitle" style={styles.itemName}>
            {displayName}
          </ThemedText>
          <Chevron isCollapsed={isCollapsed} />
        </View>
      </Pressable>
      {!isCollapsed && (
        <>
          <ThemedText style={styles.itemBlurb}>{blurb}</ThemedText>
          <ItemFeedbackButtons item={{ name, blurb }} />
        </>
      )}
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
  itemBlurb: {
    fontSize: 13,
    lineHeight: 18,
    opacity: 0.8,
    fontStyle: 'italic',
  },
});
