import React, { useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { useAuthQuery } from '@/hooks/queries/useAuthQuery';
import { theme } from '@/styles';

interface AuthGuardProps {
  children: React.ReactNode;
}

/**
 * AuthGuard component that handles route protection based on authentication state
 * Redirects users to appropriate screens based on auth status
 */
export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: authData, isLoading } = useAuthQuery();
  
  const isAuthenticated = !!authData?.user;
  const isAuthRoute = pathname.startsWith('/(auth)') || pathname === '/';

  useEffect(() => {
    // Don't redirect during initial loading
    if (isLoading) return;

    if (isAuthenticated && isAuthRoute) {
      // User is authenticated but on auth screen - redirect to home
      router.replace('/(tabs)/home');
    } else if (!isAuthenticated && !isAuthRoute) {
      // User is not authenticated but trying to access protected route - redirect to auth
      router.replace('/(auth)');
    }
  }, [isAuthenticated, isAuthRoute, isLoading, router]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  // Show children once auth state is determined and routing is handled
  return <>{children}</>;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
  },
});