import { Button } from '@/components/ui/Button';
import { TextInput } from '@/components/ui/TextInput';
import { AppleSignInButton } from '@/components/AppleSignInButton';
import { theme, typography } from '@styles';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, Alert, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSignInMutation, useSignUpMutation, authKeys } from '@/hooks/queries/useAuthQuery';
import { useQueryClient } from '@tanstack/react-query';

export default function AuthScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  
  const queryClient = useQueryClient();
  const signInMutation = useSignInMutation();
  const signUpMutation = useSignUpMutation();
  
  const currentMutation = isSignUp ? signUpMutation : signInMutation;

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    try {
      const result = await currentMutation.mutateAsync({
        email: email.trim(),
        password,
      });

      if (result.user) {
        router.replace('/(tabs)/home');
      }
    } catch (error: any) {
      Alert.alert(
        'Authentication Error',
        error.message || 'An error occurred during authentication'
      );
    }
  };

  const handleDevLogin = () => {
    // Create a mock user session for development
    const mockAuthData = {
      user: {
        id: 'dev-user-123',
        email: 'dev@sundressed.app',
        user_metadata: {
          name: 'Developer',
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      session: {
        access_token: 'dev-token',
        refresh_token: 'dev-refresh-token',
        user: {
          id: 'dev-user-123',
          email: 'dev@sundressed.app',
          user_metadata: {
            name: 'Developer',
          },
        },
      },
    };

    // Set the mock auth data in TanStack Query cache
    queryClient.setQueryData(authKeys.session(), mockAuthData);
    
    // Navigate to home - AuthGuard will recognize the user as authenticated
    router.replace('/(tabs)/home');
  };

  const handleAppleSuccess = (user: any) => {
    if (user) {
      // Invalidate queries to refetch user session
      queryClient.invalidateQueries({ queryKey: authKeys.session() });
      router.replace('/(tabs)/home');
    }
  };

  const handleGoogleLogin = () => {
    // TODO: Implement Google OAuth
    Alert.alert('Coming Soon', 'Google Sign In will be available in a future update');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.content}>
          <View style={styles.logoRow}>
            <Text style={typography.logo}>Sun Dressed</Text>
          </View>
          <View style={styles.formContainer}>
        <View style={styles.toggleContainer}>
          <TouchableOpacity 
            style={[styles.toggleButton, !isSignUp && styles.activeToggle]}
            onPress={() => setIsSignUp(false)}
          >
            <Text style={[styles.toggleText, !isSignUp && styles.activeToggleText]}>
              Sign In
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.toggleButton, isSignUp && styles.activeToggle]}
            onPress={() => setIsSignUp(true)}
          >
            <Text style={[styles.toggleText, isSignUp && styles.activeToggleText]}>
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>

        <TextInput 
          placeholder="Email"
          size="medium"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="email"
          textContentType="emailAddress"
        />
        <TextInput 
          placeholder="Password"
          secureTextEntry
          size="medium"
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
          autoComplete={isSignUp ? "new-password" : "current-password"}
          textContentType={isSignUp ? "newPassword" : "password"}
        />
        <Button
          title={currentMutation.isPending ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Sign In')}
          onPress={handleSubmit}
          variant="primary"
          size="medium"
          disabled={currentMutation.isPending}
        />

        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.oauthContainer}>
          <AppleSignInButton onSuccess={handleAppleSuccess} />

          <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin}>
            <Ionicons name="logo-google" size={20} color={theme.colors.black} />
            <Text style={styles.googleButtonText}>Continue with Google</Text>
          </TouchableOpacity>
        </View>
        
        {__DEV__ && (
          <View style={styles.devButtonContainer}>
            <Button
              title="Developer Login"
              onPress={handleDevLogin}
              variant="secondary"
              size="medium"
            />
          </View>
        )}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.white
  },
  content: {
    flex: 1,
  },
  logoRow: {
    paddingVertical: theme.spacing.lg,
    paddingLeft: theme.spacing.lg,
    maxWidth: '90%'
  },
  formContainer: {
    paddingHorizontal: theme.spacing.xl,
    flex: 1
  },
  devButtonContainer: {
    marginTop: theme.spacing.lg,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.lightGray,
    borderRadius: theme.borderRadius.medium,
    padding: 4,
    marginBottom: theme.spacing.lg,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.small,
    alignItems: 'center',
  },
  activeToggle: {
    backgroundColor: theme.colors.white,
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleText: {
    ...typography.body,
    fontSize: theme.fontSize.md,
    color: theme.colors.gray,
    fontWeight: '500',
  },
  activeToggleText: {
    color: theme.colors.black,
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: theme.spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.lightGray,
  },
  dividerText: {
    ...typography.body,
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray,
    paddingHorizontal: theme.spacing.md,
  },
  oauthContainer: {
    gap: theme.spacing.sm,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.medium,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.gray,
    gap: theme.spacing.sm,
  },
  googleButtonText: {
    ...typography.button,
    fontWeight: '600',
    color: theme.colors.black,
  },
});