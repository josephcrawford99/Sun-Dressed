import { create } from 'zustand';
import { combine } from 'zustand/middleware';

/**
 * Outfit style options
 */
export type OutfitStyle = 'masculine' | 'feminine' | 'neutral';

/**
 * Simple Zustand store for user preferences
 */
export const useStore = create(
  combine(
    {
      style: null as OutfitStyle | null,
      activity: '',
    },
    (set) => {
      return {
        setStyle: (nextStyle: OutfitStyle | null) => {
          set({ style: nextStyle });
        },
        setActivity: (nextActivity: string) => {
          set({ activity: nextActivity });
        },
      };
    },
  ),
);
