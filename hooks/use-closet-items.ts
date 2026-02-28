import { useMemo } from 'react';

import { CATEGORY_ORDER, CLOTHING_ITEMS, type ClothingCategory, type ClothingItem } from '@/constants/clothing-items';
import { useStore } from '@/store/store';

export type ClosetItem = ClothingItem & { isOwned: boolean };

/**
 * Returns clothing items for the current style, grouped by category,
 * with owned/unowned status derived from the unownedItems list.
 */
export function useClosetItems(): Record<ClothingCategory, ClosetItem[]> {
  const style = useStore((state) => state.style);
  const unownedItems = useStore((state) => state.unownedItems);

  return useMemo(() => {
    const unownedSet = new Set(unownedItems);

    const filtered = CLOTHING_ITEMS.filter((item) => {
      if (!item.gender) return true;
      if (style === 'neutral') return true;
      return item.gender === style;
    });

    const grouped = {} as Record<ClothingCategory, ClosetItem[]>;
    for (const cat of CATEGORY_ORDER) {
      const items = filtered
        .filter((item) => item.category === cat)
        .map((item) => ({
          ...item,
          isOwned: !unownedSet.has(item.iconName),
        }));
      if (items.length > 0) {
        grouped[cat] = items;
      }
    }

    return grouped;
  }, [style, unownedItems]);
}
