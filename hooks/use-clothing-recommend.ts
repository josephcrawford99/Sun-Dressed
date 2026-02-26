import { useWeather } from '@/hooks/use-weather';
import { generateOutfitRecommendation, OutfitGenerationResult } from '@/services/gemini-service';
import { getApprovedItems, getDisapprovedItems, useStore } from '@/store/store';
import { buildOutfitPrompt } from '@/utils/prompt-generator';
import { useQuery, UseQueryResult } from '@tanstack/react-query';

/**
 * Hook to generate clothing recommendations based on weather and user preferences
 *
 * Uses TanStack Query with Gemini API to generate outfit suggestions combining:
 * - Current weather conditions from TanStack Query
 * - User style preferences and planned activity from zustand store
 *
 * Query is disabled by default (enabled: false) - user must pull-to-refresh or click button to generate
 *
 * @returns TanStack Query result with refetch function, data, loading state, and error
 */
export function useClothingRecommend(): UseQueryResult<OutfitGenerationResult, Error> {
  // Get user preferences from zustand store
  const style = useStore((state) => state.style);
  const activity = useStore((state) => state.activity);
  const tempFormat = useStore((state) => state.tempFormat);
  const itemFeedback = useStore((state) => state.itemFeedback);

  // Get weather data from TanStack Query
  const { data: weather, isLoading: weatherLoading, error: weatherError } = useWeather();

  return useQuery<OutfitGenerationResult, Error>({
    queryKey: ['outfit-generation', style, activity, tempFormat],
    queryFn: async () => {
      // Validate weather data
      if (weatherLoading) {
        throw new Error('Weather data is still loading. Please wait...');
      }

      if (weatherError) {
        throw new Error(`Weather error: ${weatherError.message}`);
      }

      if (!weather) {
        throw new Error('Weather data not available. Please ensure weather has loaded.');
      }

      // Build the prompt
      const prompt = buildOutfitPrompt(
        { style, activity },
        weather,
        tempFormat,
        getApprovedItems(itemFeedback),
        getDisapprovedItems(itemFeedback),
      );

      // Generate outfit recommendation (returns both structured and raw data)
      return await generateOutfitRecommendation(prompt);
    },
    enabled: false, // Don't auto-fetch - user must trigger via pull-to-refresh or button
    staleTime: 0, // Always consider stale - no caching of outfit recommendations
    retry: 2,
  });
}
