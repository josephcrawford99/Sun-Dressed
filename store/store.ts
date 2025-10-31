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
      style: 'neutral' as OutfitStyle,
      activity: '',
      prompt: null as string | null,
      outfit: null as string | null,
    },
    (set) => {
      return {
        setStyle: (nextStyle: OutfitStyle) => {
          set({ style: nextStyle });
        },
        setActivity: (nextActivity: string) => {
          set({ activity: nextActivity });
        },
        setPrompt: (nextPrompt: string | null) => {
          set({ prompt: nextPrompt });
        },
        setOutfit: (nextOutfit: string | null) => {
          set({ outfit: nextOutfit });
        },
      };
    },
  ),
);
