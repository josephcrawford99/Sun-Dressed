import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SupabaseAuthService, AuthResult, SignInData, SignUpData } from '@/services/supabaseService';
import { CACHE_DURATION } from '@/constants';
import { User, Session } from '@supabase/supabase-js';

// Query key factories for consistent cache management
export const authKeys = {
  all: ['auth'] as const,
  session: () => [...authKeys.all, 'session'] as const,
  user: () => [...authKeys.all, 'user'] as const,
};

/**
 * Hook to get current user session
 * Follows TanStack Query patterns for session persistence
 */
export function useAuthQuery() {
  return useQuery({
    queryKey: authKeys.session(),
    queryFn: () => SupabaseAuthService.getCurrentSession(),
    staleTime: CACHE_DURATION.USER_SESSION,
    gcTime: CACHE_DURATION.USER_SESSION,
    retry: (failureCount, error) => {
      // Don't retry auth failures, they're usually intentional
      return failureCount < 1 && !error.message.includes('Invalid');
    },
  });
}

/**
 * Mutation hook to sign in with email/password
 */
export function useSignInMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: SignInData) => SupabaseAuthService.signIn(credentials),
    onSuccess: (authResult) => {
      // Update the auth cache with the new session
      queryClient.setQueryData(authKeys.session(), authResult);
    },
    onError: () => {
      // Clear any stale auth data on sign-in failure
      queryClient.setQueryData(authKeys.session(), {
        user: null,
        session: null,
      });
    },
  });
}

/**
 * Mutation hook to sign up with email/password
 */
export function useSignUpMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: SignUpData) => SupabaseAuthService.signUp(userData),
    onSuccess: (authResult) => {
      // Update the auth cache with the new session
      queryClient.setQueryData(authKeys.session(), authResult);
    },
    onError: () => {
      // Clear any stale auth data on sign-up failure
      queryClient.setQueryData(authKeys.session(), {
        user: null,
        session: null,
      });
    },
  });
}

/**
 * Mutation hook to sign out
 */
export function useSignOutMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => SupabaseAuthService.signOut(),
    onSuccess: () => {
      // Clear all auth-related cache data
      queryClient.setQueryData(authKeys.session(), {
        user: null,
        session: null,
      });
      
      // Optionally clear other user-specific data
      // This ensures a clean slate after logout
      queryClient.removeQueries({
        queryKey: ['user'],
        exact: false,
      });
    },
  });
}

/**
 * Mutation hook to update password
 */
export function useUpdatePasswordMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newPassword: string) => SupabaseAuthService.updatePassword(newPassword),
    onSuccess: (authResult) => {
      // Update user data in cache while keeping session intact
      const currentData = queryClient.getQueryData<AuthResult>(authKeys.session());
      if (currentData) {
        queryClient.setQueryData(authKeys.session(), {
          user: authResult.user,
          session: currentData.session, // Keep existing session
        });
      }
    },
  });
}

/**
 * Mutation hook to reset password
 */
export function useResetPasswordMutation() {
  return useMutation({
    mutationFn: (email: string) => SupabaseAuthService.resetPassword(email),
    // No cache updates needed for password reset
  });
}

/**
 * Mutation hook to update user profile
 */
export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updates: { name?: string; email?: string }) => 
      SupabaseAuthService.updateProfile(updates),
    onSuccess: (authResult) => {
      // Update user data in cache while keeping session intact
      const currentData = queryClient.getQueryData<AuthResult>(authKeys.session());
      if (currentData) {
        queryClient.setQueryData(authKeys.session(), {
          user: authResult.user,
          session: currentData.session, // Keep existing session
        });
      }
    },
  });
}

/**
 * Mutation hook to sign in with Apple
 */
export function useAppleSignInMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ idToken, nonce }: { idToken: string; nonce?: string }) => 
      SupabaseAuthService.signInWithApple(idToken, nonce),
    onSuccess: (authResult) => {
      // Update the auth cache with the new session
      queryClient.setQueryData(authKeys.session(), authResult);
    },
    onError: () => {
      // Clear any stale auth data on sign-in failure
      queryClient.setQueryData(authKeys.session(), {
        user: null,
        session: null,
      });
    },
  });
}

/**
 * Helper hook to get current user from the query
 */
export function useCurrentUser(): User | null {
  const { data } = useAuthQuery();
  return data?.user || null;
}

/**
 * Helper hook to check if user is authenticated
 */
export function useIsAuthenticated(): boolean {
  const { data, isLoading } = useAuthQuery();
  return !isLoading && !!data?.user;
}

/**
 * Helper hook to get auth loading state
 */
export function useAuthLoading(): boolean {
  const { isLoading } = useAuthQuery();
  return isLoading;
}