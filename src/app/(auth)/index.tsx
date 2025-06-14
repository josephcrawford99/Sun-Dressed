import { Button } from '@/components/ui/Button';
import { TextInput } from '@/components/ui/TextInput';
import { theme, typography } from '@styles';
import { router } from 'expo-router';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

export default function AuthScreen() {
  const handleDevLogin = () => {
    router.replace('/(tabs)/home');
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
});