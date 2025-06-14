import { Button } from '@/components/ui/Button';
import { TextInput } from '@/components/ui/TextInput';
import { theme, typography } from '@styles';
import { router } from 'expo-router';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function AuthScreen() {
  const handleDevLogin = () => {
    router.replace('/(tabs)/home');
  };

  const handleAppleLogin = () => {
    // TODO: Implement Apple OAuth
    console.log('Apple OAuth login');
  };

  const handleGoogleLogin = () => {
    // TODO: Implement Google OAuth
    console.log('Google OAuth login');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.logoRow}>
        <Text style={typography.logo}>Sun Dressed</Text>
      </View>
      <View style={styles.formContainer}>
        <TextInput 
          placeholder="Email"
          size="medium"
        />
        <TextInput 
          placeholder="Password"
          secureTextEntry
          size="medium"
        />
        <Button
          title="Log In"
          onPress={() => {}}
          variant="primary"
          size="medium"
        />

        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.oauthContainer}>
          <TouchableOpacity style={styles.appleButton} onPress={handleAppleLogin}>
            <Ionicons name="logo-apple" size={20} color={theme.colors.white} />
            <Text style={styles.appleButtonText}>Continue with Apple</Text>
          </TouchableOpacity>

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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.white
  },
  logoRow: {
    paddingVertical: 25,
    paddingLeft: 25,
    maxWidth: '90%'
  },
  formContainer: {
    paddingHorizontal: theme.spacing.xl,
    flex: 1
  },
  devButtonContainer: {
    marginTop: theme.spacing.lg,
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
  appleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.black,
    borderRadius: theme.borderRadius.medium,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  appleButtonText: {
    ...typography.button,
    fontWeight: '600',
    color: theme.colors.white,
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