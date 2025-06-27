import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ProfileService, UserProfile, ProfileUpdateData } from '@/services/profileService';
import { CACHE_DURATION } from '@/constants';

// Query key factories for consistent cache management
export const profileKeys = {
  all: ['profile'] as const,
  current: () => [...profileKeys.all, 'current'] as const,
  onboardingStatus: () => [...profileKeys.all, 'onboarding-status'] as const,
};

/**
 * Hook to get current user's profile
 */
export function useProfileQuery() {
  return useQuery({
    queryKey: profileKeys.current(),
    queryFn: () => ProfileService.getCurrentProfile(),
    staleTime: CACHE_DURATION.USER_SESSION,
    gcTime: CACHE_DURATION.USER_SESSION,
  });
}

/**
 * Hook to check onboarding completion status
 */
export function useOnboardingStatusQuery() {
  return useQuery({
    queryKey: profileKeys.onboardingStatus(),
    queryFn: () => ProfileService.hasCompletedOnboarding(),
    staleTime: CACHE_DURATION.USER_SESSION,
    gcTime: CACHE_DURATION.USER_SESSION,
  });
}

/**
 * Mutation hook to update user profile
 */
export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updates: ProfileUpdateData) => ProfileService.updateProfile(updates),
    onSuccess: (updatedProfile) => {
      // Update the profile cache with the new data
      if (updatedProfile) {
        queryClient.setQueryData(profileKeys.current(), updatedProfile);
        queryClient.setQueryData(profileKeys.onboardingStatus(), updatedProfile.onboarding_completed);
      }
      
      // Invalidate queries to ensure fresh data
      queryClient.invalidateQueries({ queryKey: profileKeys.all });
    },
  });
}

/**
 * Mutation hook to complete onboarding
 */
export function useCompleteOnboardingMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      name,
      style_preference,
      temperature_unit,
    }: {
      name: string;
      style_preference: 'masculine' | 'feminine' | 'neutral';
      temperature_unit: 'fahrenheit' | 'celsius';
    }) => ProfileService.completeOnboarding(name, style_preference, temperature_unit),
    onSuccess: (updatedProfile) => {
      // Update the profile cache with the new data
      if (updatedProfile) {
        queryClient.setQueryData(profileKeys.current(), updatedProfile);
        queryClient.setQueryData(profileKeys.onboardingStatus(), true);
      }
      
      // Invalidate all profile queries to ensure fresh data
      queryClient.invalidateQueries({ queryKey: profileKeys.all });
    },
  });
}

/**
 * Helper hook to get current user's profile data
 */
export function useCurrentProfile(): UserProfile | null {
  const { data } = useProfileQuery();
  return data || null;
}

/**
 * Helper hook to check if onboarding is completed
 */
export function useIsOnboardingCompleted(): boolean {
  const { data } = useOnboardingStatusQuery();
  return data ?? false;
}

/**
 * Helper hook to get profile loading state
 */
export function useProfileLoading(): boolean {
  const { isLoading } = useProfileQuery();
  return isLoading;
}