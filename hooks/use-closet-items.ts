import { useMemo } from 'react';

import { CATEGORY_ORDER, CLOTHING_ITEMS, type ClothingCategory, type ClothingItem } from '@/constants/clothing-items';
import { useStore } from '@/store/store';

export type ClosetItem = ClothingItem & { isOwned: boolean };

/**
 * Returns clothing items for the current style, grouped by category,
 * with owned/unowned status from the closet store.
 */
export function useClosetItems(): Record<ClothingCategory, ClosetItem[]> {
  const style = useStore((state) => state.style);
  const closet = useStore((state) => state.closet);

  return useMemo(() => {
    // Filter items by user's style (same logic as getItemsList)
    const filtered = CLOTHING_ITEMS.filter((item) => {
      if (!item.gender) return true;
      if (style === 'neutral') return true;
      return item.gender === style;
    });

    // Group by category in display order
    const grouped = {} as Record<ClothingCategory, ClosetItem[]>;
    for (const cat of CATEGORY_ORDER) {
      const items = filtered
        .filter((item) => item.category === cat)
        .map((item) => ({
          ...item,
          isOwned: closet[item.iconName] !== false,
        }));
      if (items.length > 0) {
        grouped[cat] = items;
      }
    }

    return grouped;
  }, [style, closet]);
}
