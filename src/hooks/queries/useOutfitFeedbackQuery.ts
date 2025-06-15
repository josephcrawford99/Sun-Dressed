import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { OutfitFeedbackQueryService } from '@/services/outfitFeedbackQueryService';
import { OutfitFeedback } from '@/types/Outfit';

// Query key factories for consistent cache management
export const outfitFeedbackKeys = {
  all: ['outfitFeedback'] as const,
  byDate: (date: Date) => [...outfitFeedbackKeys.all, 'date', date.toISOString()] as const,
  list: () => [...outfitFeedbackKeys.all, 'list'] as const,
};

/**
 * Hook to fetch feedback for a specific date
 */
export function useOutfitFeedbackQuery(date: Date) {
  return useQuery({
    queryKey: outfitFeedbackKeys.byDate(date),
    queryFn: () => OutfitFeedbackQueryService.getFeedbackForDate(date),
    staleTime: Infinity, // Local storage data doesn't go stale
    gcTime: 1000 * 60 * 60 * 24, // Keep in memory for 24 hours
  });
}

/**
 * Hook to fetch all outfits with feedback
 */
export function useOutfitsWithFeedbackQuery() {
  return useQuery({
    queryKey: outfitFeedbackKeys.list(),
    queryFn: () => OutfitFeedbackQueryService.getOutfitsWithFeedback(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 60, // 1 hour
  });
}

/**
 * Mutation hook to submit outfit feedback
 */
export function useSubmitOutfitFeedbackMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ date, feedback }: { date: Date; feedback: OutfitFeedback }) => 
      OutfitFeedbackQueryService.submitFeedback(date, feedback),
    onSuccess: (_, { date, feedback }) => {
      // Update the cache for this specific date
      queryClient.setQueryData(outfitFeedbackKeys.byDate(date), feedback);
      
      // Invalidate the list query to refetch
      queryClient.invalidateQueries({
        queryKey: outfitFeedbackKeys.list(),
      });
      
      // Also invalidate the outfit context query if needed
      queryClient.invalidateQueries({
        queryKey: ['outfit', date.toISOString()],
      });
    },
    onError: (error) => {
      // Error is handled by TanStack Query's error state
    },
  });
}