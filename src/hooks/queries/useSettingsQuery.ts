import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ProfileService, UserProfile } from '@/services/profileService';
import { UserSettings, DEFAULT_SETTINGS } from '@/types/settings';
import { CACHE_DURATION } from '@/constants';
import { useAuthQuery } from './useAuthQuery';
import { useProfileQuery } from './useProfileQuery';

// Query key factories for consistent cache management
export const settingsKeys = {
  all: ['settings'] as const,
  unified: () => [...settingsKeys.all, 'unified'] as const,
  legacy: () => [...settingsKeys.all, 'legacy'] as const,
};

/**
 * Converts UserProfile from Supabase to UserSettings format
 */
function profileToSettings(profile: UserProfile | null, userEmail?: string): UserSettings {
  if (!profile) {
    return {
      ...DEFAULT_SETTINGS,
      email: userEmail || '',
    };
  }

  return {
    name: profile.name || '',
    email: userEmail || '',
    temperatureUnit: profile.temperature_unit === 'celsius' ? 'Celsius' : 'Fahrenheit',
    speedUnit: 'mph', // Default as not stored in profile
    stylePreference: profile.style_preference || 'neutral',
  };
}

/**
 * Unified settings query that merges local TanStack Query cache with remote Supabase profile
 * This replaces direct AsyncStorage usage and handles legacy migration
 */
export function useSettingsQuery() {
  const { data: authData } = useAuthQuery();
  const userEmail = authData?.user?.email;

  return useQuery({
    queryKey: settingsKeys.unified(),
    queryFn: async (): Promise<UserSettings> => {
      // First, try to get profile from Supabase
      const profile = await ProfileService.getCurrentProfile();
      
      // If we have a profile, convert and return it
      if (profile) {
        return profileToSettings(profile, userEmail);
      }

      // If no profile exists but user is authenticated, return defaults
      // The profile will be created when user completes onboarding or updates settings
      return {
        ...DEFAULT_SETTINGS,
        email: userEmail || '',
      };
    },
    enabled: !!authData?.user, // Only run when authenticated
    staleTime: CACHE_DURATION.USER_SESSION,
    gcTime: CACHE_DURATION.USER_SESSION,
    // Return default settings for non-authenticated users
    placeholderData: DEFAULT_SETTINGS,
  });
}

/**
 * Check if user has completed onboarding
 * User is considered onboarded if they have a name and style preference set
 */
export function useHasCompletedOnboarding() {
  const { data: settings, isLoading } = useSettingsQuery();
  const { data: profile } = useProfileQuery();
  
  if (isLoading) return { hasCompleted: false, isLoading: true };
  
  // Check if profile explicitly has onboarding_completed flag
  if (profile?.onboarding_completed) {
    return { hasCompleted: true, isLoading: false };
  }
  
  // For legacy users, check if they have essential settings
  const hasEssentialSettings = !!(
    settings?.name?.trim() && 
    settings?.stylePreference &&
    settings?.stylePreference !== 'neutral' // Neutral is default, so require explicit choice
  );
  
  return { hasCompleted: hasEssentialSettings, isLoading: false };
}

/**
 * Mutation to update settings (both local cache and remote)
 */
export function useUpdateSettingsMutation() {
  const queryClient = useQueryClient();
  const { data: authData } = useAuthQuery();

  return useMutation({
    mutationFn: async (updates: Partial<UserSettings>) => {
      // Ensure we have an authenticated user
      const userId = authData?.user?.id;
      if (!userId) {
        throw new Error('No authenticated user found. Please sign in again.');
      }

      // Get current settings
      const currentSettings = queryClient.getQueryData<UserSettings>(settingsKeys.unified()) || DEFAULT_SETTINGS;
      const newSettings = { ...currentSettings, ...updates };
      
      // Update profile in Supabase
      const profileUpdates = {
        name: newSettings.name,
        style_preference: newSettings.stylePreference as 'masculine' | 'feminine' | 'neutral',
        temperature_unit: newSettings.temperatureUnit.toLowerCase() as 'fahrenheit' | 'celsius',
      };
      
      await ProfileService.updateProfileById(userId, profileUpdates);
      
      return newSettings;
    },
    onSuccess: (newSettings) => {
      // Update the settings cache
      queryClient.setQueryData(settingsKeys.unified(), newSettings);
      
      // Invalidate profile queries to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}

/**
 * Mutation to complete onboarding with settings
 */
export function useCompleteOnboardingWithSettingsMutation() {
  const queryClient = useQueryClient();
  const { data: authData } = useAuthQuery();

  return useMutation({
    mutationFn: async ({
      name,
      stylePreference,
      temperatureUnit,
    }: {
      name: string;
      stylePreference: 'masculine' | 'feminine' | 'neutral';
      temperatureUnit: 'fahrenheit' | 'celsius';
    }) => {
      // Ensure we have an authenticated user
      const userId = authData?.user?.id;
      if (!userId) {
        throw new Error('No authenticated user found. Please sign in again.');
      }

      // Complete onboarding in Supabase using the cached user ID
      try {
        const profile = await ProfileService.completeOnboardingForUser(
          userId,
          name,
          stylePreference,
          temperatureUnit
        );
        
        if (!profile) {
          throw new Error('Failed to complete onboarding - profile creation returned null');
        }
        
        return profileToSettings(profile, authData?.user?.email);
      } catch (error: any) {
        console.error('Onboarding error details:', error);
        
        // Provide more specific error messages
        if (error.message?.includes('column') && error.message?.includes('does not exist')) {
          throw new Error('Database schema mismatch. The app will handle this automatically.');
        } else if (error.message?.includes('Failed to create profile')) {
          throw new Error('Unable to create your profile. Please check your connection and try again.');
        } else if (error.message?.includes('Failed to update profile')) {
          throw new Error('Unable to update your profile. Please try again.');
        }
        
        throw error;
      }
    },
    onSuccess: (newSettings) => {
      // Update settings cache
      queryClient.setQueryData(settingsKeys.unified(), newSettings);
      
      // Invalidate profile queries
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}

/**
 * Helper to get current settings synchronously from cache
 */
export function useCurrentSettings(): UserSettings {
  const { data } = useSettingsQuery();
  return data || DEFAULT_SETTINGS;
}

/**
 * Mutation to migrate legacy settings to profile
 */
export function useMigrateLegacySettingsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (legacySettings: UserSettings) => {
      // Check if profile already exists
      const existingProfile = await ProfileService.getCurrentProfile();
      
      if (!existingProfile && legacySettings.name && legacySettings.stylePreference) {
        // Create profile from legacy settings
        await ProfileService.completeOnboarding(
          legacySettings.name,
          legacySettings.stylePreference,
          legacySettings.temperatureUnit.toLowerCase() as 'fahrenheit' | 'celsius'
        );
      }
      
      return legacySettings;
    },
    onSuccess: () => {
      // Invalidate all settings and profile queries to refetch
      queryClient.invalidateQueries({ queryKey: settingsKeys.all });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}