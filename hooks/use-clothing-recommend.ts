import { useWeather } from '@/hooks/use-weather';
import { generateOutfitRecommendation, OutfitGenerationResult } from '@/services/gemini-service';
import { useStore } from '@/store/store';
import { buildOutfitPrompt } from '@/utils/prompt-generator';
import { useMutation, UseMutationResult } from '@tanstack/react-query';

/**
 * Hook to generate clothing recommendations based on weather and user preferences
 *
 * Uses TanStack Query mutation with Gemini API to generate outfit suggestions combining:
 * - Current weather conditions from TanStack Query
 * - User style preferences and planned activity from zustand store
 *
 * @returns TanStack Query mutation result with mutate function, data, loading state, and error
 */
export function useClothingRecommend(): UseMutationResult<OutfitGenerationResult, Error, void> {
  // Get user preferences from zustand store
  const style = useStore((state) => state.style);
  const activity = useStore((state) => state.activity);
  const tempFormat = useStore((state) => state.tempFormat);

  // Get weather data from TanStack Query
  const { data: weather, isLoading: weatherLoading, error: weatherError } = useWeather();

  return useMutation<OutfitGenerationResult, Error, void>({
    mutationFn: async () => {
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
        tempFormat
      );

      // Generate outfit recommendation (returns both structured and raw data)
      return await generateOutfitRecommendation(prompt);
    },
    retry: 2,
  });
}
