import React, { useState } from 'react';
import { 
  SafeAreaView, 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { router } from 'expo-router';
import { theme, typography } from '@styles';
import { TextInput } from '@/components/ui/TextInput';
import { Button } from '@/components/ui/Button';
import { useCompleteOnboardingWithSettingsMutation } from '@/hooks/queries/useSettingsQuery';
import { useAuthQuery } from '@/hooks/queries/useAuthQuery';

type StylePreference = 'masculine' | 'feminine' | 'neutral';
type TemperatureUnit = 'fahrenheit' | 'celsius';

export default function OnboardingScreen() {
  const [currentStep, setCurrentStep] = useState(0);
  const [name, setName] = useState('');
  const [stylePreference, setStylePreference] = useState<StylePreference | null>(null);
  const [temperatureUnit, setTemperatureUnit] = useState<TemperatureUnit>('fahrenheit');
  
  const completeOnboardingMutation = useCompleteOnboardingWithSettingsMutation();
  const { data: authData, isLoading: authLoading } = useAuthQuery();

  const handleNext = () => {
    if (currentStep === 0 && !name.trim()) {
      Alert.alert('Name Required', 'Please enter your name to continue');
      return;
    }
    if (currentStep === 1 && !stylePreference) {
      Alert.alert('Style Preference Required', 'Please select a style preference');
      return;
    }
    
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = async () => {
    if (!stylePreference) return;

    // Ensure auth is loaded and valid
    if (authLoading) {
      Alert.alert('Please Wait', 'Loading authentication...');
      return;
    }

    if (!authData?.user) {
      Alert.alert(
        'Session Expired', 
        'Your session has expired. Please sign in again.',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/(auth)'),
          },
        ]
      );
      return;
    }

    try {
      await completeOnboardingMutation.mutateAsync({
        name: name.trim(),
        stylePreference,
        temperatureUnit,
      });
      
      // Navigate to main app
      router.replace('/(tabs)/home');
    } catch (error: any) {
      console.error('Onboarding error:', error);
      
      // Provide more specific error messages
      let errorMessage = 'Failed to complete onboarding. ';
      
      if (error.message?.includes('No authenticated user')) {
        errorMessage += 'Your session has expired. Please sign in again.';
        // Redirect to auth screen
        setTimeout(() => router.replace('/(auth)'), 2000);
      } else if (error.message?.includes('Failed to complete onboarding')) {
        errorMessage += 'Unable to save your preferences. Please try again.';
      } else if (error.message?.includes('Network')) {
        errorMessage += 'Please check your internet connection and try again.';
      } else {
        errorMessage += error.message || 'Please try again later.';
      }
      
      Alert.alert('Unable to Complete Setup', errorMessage);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.title}>Welcome to Sun Dressed!</Text>
            <Text style={styles.subtitle}>Let&apos;s personalize your experience</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>What&apos;s your name?</Text>
              <TextInput
                placeholder="Enter your name"
                value={name}
                onChangeText={setName}
                size="medium"
                autoFocus
              />
            </View>
          </View>
        );
        
      case 1:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.title}>Style Preference</Text>
            <Text style={styles.subtitle}>How do you prefer to dress?</Text>
            
            <View style={styles.optionsContainer}>
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  stylePreference === 'masculine' && styles.selectedOption
                ]}
                onPress={() => setStylePreference('masculine')}
              >
                <Text style={[
                  styles.optionText,
                  stylePreference === 'masculine' && styles.selectedOptionText
                ]}>
                  Masculine
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  stylePreference === 'feminine' && styles.selectedOption
                ]}
                onPress={() => setStylePreference('feminine')}
              >
                <Text style={[
                  styles.optionText,
                  stylePreference === 'feminine' && styles.selectedOptionText
                ]}>
                  Feminine
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  stylePreference === 'neutral' && styles.selectedOption
                ]}
                onPress={() => setStylePreference('neutral')}
              >
                <Text style={[
                  styles.optionText,
                  stylePreference === 'neutral' && styles.selectedOptionText
                ]}>
                  Neutral
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        );
        
      case 2:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.title}>Temperature Units</Text>
            <Text style={styles.subtitle}>Choose your preferred temperature unit</Text>
            
            <View style={styles.optionsContainer}>
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  temperatureUnit === 'fahrenheit' && styles.selectedOption
                ]}
                onPress={() => setTemperatureUnit('fahrenheit')}
              >
                <Text style={[
                  styles.optionText,
                  temperatureUnit === 'fahrenheit' && styles.selectedOptionText
                ]}>
                  Fahrenheit (°F)
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  temperatureUnit === 'celsius' && styles.selectedOption
                ]}
                onPress={() => setTemperatureUnit('celsius')}
              >
                <Text style={[
                  styles.optionText,
                  temperatureUnit === 'celsius' && styles.selectedOptionText
                ]}>
                  Celsius (°C)
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${((currentStep + 1) / 3) * 100}%` }
                ]} 
              />
            </View>
          </View>
          
          {renderStep()}
          
          <View style={styles.buttonContainer}>
            <Button
              title={currentStep === 2 ? 'Complete' : 'Continue'}
              onPress={handleNext}
              variant="primary"
              size="medium"
              disabled={completeOnboardingMutation.isPending}
            />
            
            {currentStep > 0 && !completeOnboardingMutation.isPending && (
              <TouchableOpacity 
                style={styles.backButton}
                onPress={() => setCurrentStep(currentStep - 1)}
              >
                <Text style={styles.backButtonText}>Back</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.xl,
  },
  progressContainer: {
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
  },
  progressBar: {
    height: 4,
    backgroundColor: theme.colors.lightGray,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 2,
  },
  stepContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: theme.spacing.xl,
  },
  title: {
    ...typography.logo,
    fontSize: theme.fontSize.xxl,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    ...typography.body,
    fontSize: theme.fontSize.lg,
    color: theme.colors.gray,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  inputContainer: {
    marginTop: theme.spacing.xl,
  },
  label: {
    ...typography.body,
    fontSize: theme.fontSize.md,
    fontWeight: '600',
    marginBottom: theme.spacing.sm,
  },
  optionsContainer: {
    marginTop: theme.spacing.xl,
    gap: theme.spacing.md,
  },
  optionButton: {
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.medium,
    borderWidth: 2,
    borderColor: theme.colors.lightGray,
    backgroundColor: theme.colors.white,
  },
  selectedOption: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.white,
  },
  optionText: {
    ...typography.body,
    fontSize: theme.fontSize.lg,
    textAlign: 'center',
    fontWeight: '500',
    color: theme.colors.black,
  },
  selectedOptionText: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  buttonContainer: {
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
    gap: theme.spacing.md,
  },
  backButton: {
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
  },
  backButtonText: {
    ...typography.body,
    fontSize: theme.fontSize.md,
    color: theme.colors.gray,
    fontWeight: '500',
  },
});