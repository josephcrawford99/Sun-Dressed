import { create } from 'zustand';
import { combine } from 'zustand/middleware';
import { fetchWeatherData, WeatherData } from '@/hooks/use-openweathermap';

/**
 * Outfit style options
 */
export type OutfitStyle = 'masculine' | 'feminine' | 'neutral';

/**
 * Zustand store for user preferences and weather data
 */
export const useStore = create(
  combine(
    {
      style: null as OutfitStyle | null,
      activity: '',
      weather: null as WeatherData | null,
      weatherLoading: false,
      weatherError: null as string | null,
    },
    (set) => {
      return {
        setStyle: (nextStyle: OutfitStyle | null) => {
          set({ style: nextStyle });
        },
        setActivity: (nextActivity: string) => {
          set({ activity: nextActivity });
        },
        fetchWeather: async () => {
          set({ weatherLoading: true, weatherError: null });
          try {
            const data = await fetchWeatherData();
            set({ weather: data, weatherLoading: false });
          } catch (err) {
            set({
              weatherError: err instanceof Error ? err.message : 'Failed to get weather',
              weatherLoading: false
            });
          }
        },
      };
    },
  ),
);
