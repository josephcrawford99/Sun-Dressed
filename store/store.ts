import AsyncStorage from '@react-native-async-storage/async-storage';
import { TempFormat } from '@/services/openweathermap-service';
import { ClothingItem, ItemFeedback, OutfitStyle } from '@/types/outfit';
import { Trip } from '@/types/trip';
/** Generate a v4-style unique ID without native crypto dependency */
function generateId(): string {
  const hex = '0123456789abcdef';
  let id = '';
  for (let i = 0; i < 32; i++) {
    id += hex[Math.floor(Math.random() * 16)];
  }
  return `${id.slice(0, 8)}-${id.slice(8, 12)}-4${id.slice(13, 16)}-${hex[8 + Math.floor(Math.random() * 4)]}${id.slice(17, 20)}-${id.slice(20)}`;
}
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
        trips: [] as Trip[],
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
          toggleClosetItem: (iconName: string) => {
            set((state) => {
              const current = state.closet[iconName];
              if (current === false) {
                // Toggling back to owned — remove the key
                const { [iconName]: _, ...rest } = state.closet;
                return { closet: rest };
              }
              // Mark as unowned
              return { closet: { ...state.closet, [iconName]: false } };
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
          addTrip: (data: { destination: string; startDate: Date; endDate: Date; activities: string }): string => {
            const id = generateId();
            set((state) => ({
              trips: [...state.trips, {
                id,
                ...data,
                plan: null,
                createdAt: new Date(),
                planGeneratedAt: null,
              }],
            }));
            return id;
          },
          updateTrip: (id: string, updates: Partial<Trip>) => {
            set((state) => ({
              trips: state.trips.map((t) =>
                t.id === id ? { ...t, ...updates } : t,
              ),
            }));
          },
          deleteTrip: (id: string) => {
            set((state) => ({
              trips: state.trips.filter((t) => t.id !== id),
            }));
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
        trips: state.trips,
      }),
      // JSON.stringify turns Date objects into strings when saving to AsyncStorage.
      // This converts them back to Date objects when the store rehydrates on app launch.
      onRehydrateStorage: () => (state) => {
        if (state?.trips) {
          state.trips = state.trips.map((trip) => ({
            ...trip,
            startDate: new Date(trip.startDate),
            endDate: new Date(trip.endDate),
            createdAt: new Date(trip.createdAt),
            planGeneratedAt: trip.planGeneratedAt
              ? new Date(trip.planGeneratedAt)
              : null,
          }));
        }
      },
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

export function getTripById(id: string): Trip | undefined {
  return useStore.getState().trips.find((t) => t.id === id);
}
