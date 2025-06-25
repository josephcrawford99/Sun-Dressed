import React from 'react';
import { Platform, Alert } from 'react-native';
import * as AppleAuthentication from 'expo-apple-authentication';
import { useAppleSignInMutation } from '@/hooks/queries/useAuthQuery';

interface AppleSignInButtonProps {
  onSuccess?: (user: any) => void;
  onError?: (error: string) => void;
}

export function AppleSignInButton({ onSuccess, onError }: AppleSignInButtonProps) {
  const appleSignInMutation = useAppleSignInMutation();

  const handleAppleSignIn = async () => {
    try {
      // Generate a random nonce for security
      const nonce = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
        nonce,
      });

      if (credential.identityToken) {
        appleSignInMutation.mutate(
          {
            idToken: credential.identityToken,
            nonce,
          },
          {
            onSuccess: (data) => {
              onSuccess?.(data.user);
            },
            onError: (error) => {
              const errorMessage = error.message || 'Apple Sign In failed';
              onError?.(errorMessage);
              Alert.alert('Sign In Error', errorMessage);
            },
          }
        );
      }
    } catch (error: any) {
      if (error.code === 'ERR_REQUEST_CANCELED') {
        // User canceled the sign-in request
        return;
      }
      
      const errorMessage = error.message || 'Apple Sign In failed';
      onError?.(errorMessage);
      Alert.alert('Sign In Error', errorMessage);
    }
  };

  // Only show Apple Sign In on iOS
  if (Platform.OS !== 'ios') {
    return null;
  }

  return (
    <AppleAuthentication.AppleAuthenticationButton
      buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
      buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
      cornerRadius={8}
      style={{
        width: '100%',
        height: 50,
        marginVertical: 8,
      }}
      onPress={handleAppleSignIn}
    />
  );
}