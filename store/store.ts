import { create } from 'zustand';
import { combine } from 'zustand/middleware';

/**
 * Outfit style options
 */
export type OutfitStyle = 'masculine' | 'feminine' | 'neutral';

/**
 * Zustand store for user preferences
 */
export const useStore = create(
  combine(
    {
      style: 'neutral',
      activity: '',
    },
    (set) => {
      return {
        setStyle: (nextStyle: OutfitStyle) => {
          set({ style: nextStyle });
        },
        setActivity: (nextActivity: string) => {
          set({ activity: nextActivity });
        },
      };
    },
  ),
);
