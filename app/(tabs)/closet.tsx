import { Image } from 'expo-image';
import React from 'react';
import { ScrollView, StyleSheet, Switch, View } from 'react-native';

import { ScreenHeader } from '@/components/screen-header';
import { Section } from '@/components/section';
import { ThemedBackground } from '@/components/themed-background';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { CATEGORY_LABELS, CATEGORY_ORDER, getIconForItem, type ClothingCategory } from '@/constants/clothing-items';
import { useClosetItems, type ClosetItem } from '@/hooks/use-closet-items';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useStore } from '@/store/store';

const ClosetItemRow = React.memo(function ClosetItemRow({ item }: { item: ClosetItem }) {
  const toggleClosetItem = useStore((state) => state.toggleClosetItem);
  const tintColor = useThemeColor({}, 'tint');
  const iconTintColor = useThemeColor({}, 'text');
  const icon = getIconForItem(item.iconName);

  return (
    <View style={styles.itemRow}>
      {icon && (
        <Image
          source={icon}
          style={[styles.itemIcon, { tintColor: iconTintColor }]}
          contentFit="contain"
          cachePolicy="memory-disk"
        />
      )}
      <ThemedText style={styles.itemName}>{item.baseName}</ThemedText>
      <Switch
        value={item.isOwned}
        onValueChange={() => toggleClosetItem(item.iconName)}
        trackColor={{ true: tintColor }}
      />
    </View>
  );
});

export default function ClosetScreen() {
  const grouped = useClosetItems();
  const markAllOwned = useStore((state) => state.markAllOwned);
  const hasUnowned = useStore((state) => state.unownedItems.length > 0);
  const tintColor = useThemeColor({}, 'tint');

  return (
    <ThemedBackground style={styles.container}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        stickyHeaderIndices={[0]}
      >
        <ScreenHeader title="Closet" />
        <ThemedView style={styles.content}>
          <View style={styles.ownAllRow}>
            <ThemedText style={styles.ownAllLabel}>I Own It All!</ThemedText>
            <Switch
              value={!hasUnowned}
              disabled={!hasUnowned}
              onValueChange={(value) => { if (value) markAllOwned(); }}
              trackColor={{ true: tintColor }}
            />
          </View>
          {CATEGORY_ORDER.map((cat: ClothingCategory) => {
            const items = grouped[cat];
            if (!items) return null;
            return (
              <Section key={cat} title={CATEGORY_LABELS[cat]}>
                {items.map((item) => (
                  <ClosetItemRow key={item.iconName} item={item} />
                ))}
              </Section>
            );
          })}
        </ThemedView>
      </ScrollView>
    </ThemedBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingTop: 15,
  },
  ownAllRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  ownAllLabel: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  itemIcon: {
    width: 32,
    height: 32,
    marginRight: 12,
  },
  itemName: {
    flex: 1,
    fontSize: 16,
  },
});
