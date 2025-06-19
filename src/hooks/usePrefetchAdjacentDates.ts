import { useEffect, useRef } from 'react';
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
  const coordinatesCache = useRef<{ [location: string]: { lat: number; lon: number } }>({});
  const lastPrefetchLocation = useRef<string>('');

  useEffect(() => {
    if (!location?.trim()) return;
    
    // Skip if we already prefetched for this location
    if (lastPrefetchLocation.current === location) return;
    lastPrefetchLocation.current = location;

    const dateOffsets: DateOffset[] = [-1, 0, 1];

    // Get coordinates once for all prefetches
    const getCoordinates = async () => {
      if (coordinatesCache.current[location]) {
        return coordinatesCache.current[location];
      }
      const coords = await geocodeService.geocode(location);
      coordinatesCache.current[location] = coords;
      return coords;
    };

    // Prefetch weather data for all three dates
    dateOffsets.forEach(async (offset) => {
      const queryKey = ['weather', location, offset];
      
      // Only prefetch if not already in cache
      const existingData = queryClient.getQueryData(queryKey);
      if (!existingData) {
        queryClient.prefetchQuery({
          queryKey,
          queryFn: async () => {
            const coordinates = await getCoordinates();
            
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

  }, [location, queryClient]); // Remove currentActivity dependency to prevent re-runs
}