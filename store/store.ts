import AsyncStorage from '@react-native-async-storage/async-storage';
import { TempFormat } from '@/services/openweathermap-service';
import { OutfitStyle } from '@/types/outfit';
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
        };
      },
    ),
    {
      name: 'sundressed-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        style: state.style,
        tempFormat: state.tempFormat,
      }),
    },
  ),
);
