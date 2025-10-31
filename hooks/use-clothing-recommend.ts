import { useState } from 'react';
import { useStore } from '@/store/store';
import { useWeather } from '@/hooks/use-weather';
import { generateOutfitRecommendation } from '@/services/gemini-service';
import { buildOutfitPrompt } from '@/services/prompt-generator';

/**
 * Return type for the useClothingRecommend hook
 */
export interface UseClothingRecommendResult {
  generateOutfit: () => Promise<void>;
  outfit: string | null;
  prompt: string | null;
  loading: boolean;
  error: string | null;
}

/**
 * Hook to generate clothing recommendations based on weather and user preferences
 *
 * Uses Gemini API to generate outfit suggestions combining:
 * - Current weather conditions from TanStack Query
 * - User style preferences and planned activity from zustand store
 *
 * @returns Object containing generateOutfit function and state (outfit, prompt, loading, error)
 */
export function useClothingRecommend(): UseClothingRecommendResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get user preferences and outfit data from zustand store
  const style = useStore((state) => state.style);
  const activity = useStore((state) => state.activity);
  const outfit = useStore((state) => state.outfit);
  const prompt = useStore((state) => state.prompt);
  const setOutfit = useStore((state) => state.setOutfit);
  const setPrompt = useStore((state) => state.setPrompt);

  // Get weather data from TanStack Query
  const { data: weather, isLoading: weatherLoading, error: weatherError } = useWeather();

  /**
   * Generates an outfit recommendation
   * Validates required data, builds prompt, and calls Gemini API
   */
  const generateOutfit = async () => {
    // Reset state
    setError(null);
    setOutfit(null);
    setPrompt(null);

    // Validate weather data
    if (weatherLoading) {
      setError('Weather data is still loading. Please wait...');
      return;
    }

    if (weatherError) {
      setError(`Weather error: ${weatherError.message}`);
      return;
    }

    if (!weather) {
      setError('Weather data not available. Please ensure weather has loaded.');
      return;
    }

    // Start loading
    setLoading(true);

    try {
      // Build the prompt
      const generatedPrompt = buildOutfitPrompt(
        { style, activity },
        weather
      );
      setPrompt(generatedPrompt);

      // Generate outfit recommendation
      const recommendation = await generateOutfitRecommendation(generatedPrompt);
      setOutfit(recommendation);
    } catch (err) {
      // Handle errors
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate outfit recommendation';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    generateOutfit,
    outfit,
    prompt,
    loading,
    error,
  };
}
