import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { geocodeService } from '@services/geocodeService';
import { weatherService } from '@services/weatherService';
import { getOutfitQueryKey } from '@/utils/cacheUtils';
import { DateOffset } from '@components/CalendarBar';

/**
 * Prefetch weather and outfit data for adjacent dates to improve performance
 */
export function usePrefetchAdjacentDates(
  location: string | null,
  currentActivity: string
) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!location?.trim()) return;

    const dateOffsets: DateOffset[] = [-1, 0, 1];

    // Prefetch weather data for all three dates
    dateOffsets.forEach(async (offset) => {
      const queryKey = ['weather', location, offset];
      
      // Only prefetch if not already in cache
      const existingData = queryClient.getQueryData(queryKey);
      if (!existingData) {
        queryClient.prefetchQuery({
          queryKey,
          queryFn: async () => {
            const coordinates = await geocodeService.geocode(location);
            
            if (offset === 0) {
              // Today - current weather
              return await weatherService.fetchWeatherByCoordinates(
                coordinates.lat,
                coordinates.lon
              );
            } else if (offset === 1) {
              // Tomorrow - forecast
              const forecast = await weatherService.fetchForecastByCoordinates(
                coordinates.lat,
                coordinates.lon,
                2
              );
              return forecast[1];
            } else {
              // Yesterday - use current as fallback
              return await weatherService.fetchWeatherByCoordinates(
                coordinates.lat,
                coordinates.lon
              );
            }
          },
          staleTime: offset === 0 ? 5 * 60 * 1000 : 6 * 60 * 60 * 1000,
          gcTime: 60 * 60 * 1000,
        });
      }
    });

    // Also prefetch outfit query keys to warm the cache
    // This ensures TanStack Query knows about these queries even if they return null initially
    dateOffsets.forEach((offset) => {
      const date = new Date();
      date.setDate(date.getDate() + offset);
      const queryKey = getOutfitQueryKey(date, location, currentActivity);
      
      // Register the query key in cache without fetching
      // The outfit will be generated when actually needed with weather data
      if (!queryClient.getQueryData(queryKey)) {
        queryClient.setQueryDefaults(queryKey, {
          staleTime: offset === -1 ? Infinity : 24 * 60 * 60 * 1000, // Until end of day
          gcTime: 3 * 24 * 60 * 60 * 1000, // 3 days
        });
      }
    });
  }, [location, currentActivity, queryClient]);
}