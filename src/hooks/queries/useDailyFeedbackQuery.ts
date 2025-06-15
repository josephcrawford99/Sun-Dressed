import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DailyFeedbackQueryService } from '@/services/dailyFeedbackQueryService';
import { OutfitFeedback, DailyFeedbackState } from '@/types/Outfit';

// Query key factories for consistent cache management
export const dailyFeedbackKeys = {
  all: ['dailyFeedback'] as const,
  state: () => [...dailyFeedbackKeys.all, 'state'] as const,
  shouldShow: () => [...dailyFeedbackKeys.all, 'shouldShow'] as const,
  yesterdayOutfit: () => [...dailyFeedbackKeys.all, 'yesterdayOutfit'] as const,
};

/**
 * Hook to check if we should show the daily feedback modal
 * Returns outfit data and date if modal should be shown
 */
export function useShouldShowDailyFeedback() {
  return useQuery({
    queryKey: dailyFeedbackKeys.shouldShow(),
    queryFn: () => DailyFeedbackQueryService.shouldShowFeedbackModal(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 60, // 1 hour
  });
}

/**
 * Hook to get the daily feedback state
 */
export function useDailyFeedbackState() {
  return useQuery({
    queryKey: dailyFeedbackKeys.state(),
    queryFn: () => DailyFeedbackQueryService.getFeedbackState(),
    staleTime: Infinity, // Local storage data doesn't go stale
    gcTime: 1000 * 60 * 60 * 24, // Keep in memory for 24 hours
  });
}

/**
 * Mutation hook to save daily feedback
 */
export function useSaveDailyFeedbackMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (feedback: Partial<OutfitFeedback>) => 
      DailyFeedbackQueryService.saveFeedback(feedback),
    onSuccess: (updatedState) => {
      // Update the state cache
      queryClient.setQueryData(dailyFeedbackKeys.state(), updatedState);
      
      // Invalidate the shouldShow query to prevent re-showing
      queryClient.invalidateQueries({
        queryKey: dailyFeedbackKeys.shouldShow(),
      });
      
      // Also invalidate outfit feedback queries to sync data
      queryClient.invalidateQueries({
        queryKey: ['outfitFeedback'],
      });
    },
    onError: (error) => {
      console.error('Failed to save daily feedback:', error);
    },
  });
}

/**
 * Hook to get feedback history for LLM context
 */
export function useFeedbackHistory(limit: number = 10) {
  return useQuery({
    queryKey: [...dailyFeedbackKeys.all, 'history', limit],
    queryFn: () => DailyFeedbackQueryService.getFeedbackHistory(limit),
    staleTime: 1000 * 60 * 15, // 15 minutes
    gcTime: 1000 * 60 * 60, // 1 hour
  });
}