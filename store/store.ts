import AsyncStorage from '@react-native-async-storage/async-storage';
import { TempFormat } from '@/services/openweathermap-service';
import { ClothingItem, ItemFeedback, OutfitStyle } from '@/types/outfit';
import { create } from 'zustand';
import { combine, createJSONStorage, persist } from 'zustand/middleware';


/**
 * Zustand store for user preferences
 * go to partialize to add items to persist. otherwise add to combine.
 */
export const useStore = create(
  persist(
    combine(
      {
        style: 'neutral' as OutfitStyle,
        activity: '',
        tempFormat: 'imperial' as TempFormat,
        itemFeedback: {} as ItemFeedback,
        closet: {} as Record<string, boolean>,
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
          toggleClosetItem: (iconPath: string) => {
            set((state) => {
              const current = state.closet[iconPath];
              if (current === false) {
                // Toggling back to owned — remove the key
                const { [iconPath]: _, ...rest } = state.closet;
                return { closet: rest };
              }
              // Mark as unowned
              return { closet: { ...state.closet, [iconPath]: false } };
            });
          },
          approveItem: (item: ClothingItem) => {
            set((state) => {
              if (state.itemFeedback[item.name] === 'up') {
                const { [item.name]: _, ...rest } = state.itemFeedback;
                return { itemFeedback: rest };
              }
              return { itemFeedback: { ...state.itemFeedback, [item.name]: 'up' } };
            });
          },
          disapproveItem: (item: ClothingItem) => {
            set((state) => {
              if (state.itemFeedback[item.name] === 'down') {
                const { [item.name]: _, ...rest } = state.itemFeedback;
                return { itemFeedback: rest };
              }
              return { itemFeedback: { ...state.itemFeedback, [item.name]: 'down' } };
            });
          },
          clearItemFeedback: () => {
            set({ itemFeedback: {} });
          },
        };
      },
    ),
    {
      name: 'sundressed-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        style: state.style,
        tempFormat: state.tempFormat,
        closet: state.closet,
      }),
    },
  ),
);

export function getApprovedItems(feedback: ItemFeedback): string[] {
  return Object.entries(feedback)
    .filter(([, v]) => v === 'up')
    .map(([k]) => k);
}

export function getDisapprovedItems(feedback: ItemFeedback): string[] {
  return Object.entries(feedback)
    .filter(([, v]) => v === 'down')
    .map(([k]) => k);
}
