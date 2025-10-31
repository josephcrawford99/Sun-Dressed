import { TempFormat } from '@/services/openweathermap-service';
import { Outfit, OutfitStyle } from '@/types/outfit';
import { create } from 'zustand';
import { combine } from 'zustand/middleware';


/**
 * Zustand store for user preferences
 */
export const useStore = create(
  combine(
    {
      style: 'neutral' as OutfitStyle,
      activity: '',
      tempFormat: 'imperial' as TempFormat,
      prompt: null as string | null,
      outfit: null as Outfit | null,
      outfitRawText: null as string | null,
    },
    (set) => {
      return {
        setStyle: (nextStyle: OutfitStyle) => {
          set({ style: nextStyle });
        },
        setActivity: (nextActivity: string) => {
          set({ activity: nextActivity });
        },
        setTempFormat: (nextTempFormat: TempFormat) => {
          set({ tempFormat: nextTempFormat });
        },
        setPrompt: (nextPrompt: string | null) => {
          set({ prompt: nextPrompt });
        },
        setOutfit: (nextOutfit: Outfit | null) => {
          set({ outfit: nextOutfit });
        },
        setOutfitRawText: (nextOutfitRawText: string | null) => {
          set({ outfitRawText: nextOutfitRawText });
        },
      };
    },
  ),
);
