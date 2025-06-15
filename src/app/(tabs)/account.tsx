import ToggleSwitch from '@/components/common/ToggleSwitch';
import { Button } from '@/components/ui/Button';
import { TextInput } from '@/components/ui/TextInput';
import { useSettings } from '@/contexts/SettingsContext';
import { theme, typography } from '@styles';
import { router } from 'expo-router';
import React, { useState, useEffect } from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


export default function AccountScreen() {
  const insets = useSafeAreaInsets();
  const { settings, updateSetting } = useSettings();
  const [name, setName] = useState(settings.name);
  const [email, setEmail] = useState(settings.email);

  // Update local state when settings change
  useEffect(() => {
    setName(settings.name);
    setEmail(settings.email);
  }, [settings]);

  const handleNameChange = async (value: string) => {
    setName(value);
    try {
      await updateSetting('name', value);
    } catch {
      // Failed to update name
    }
  };

  const handleEmailChange = async (value: string) => {
    setEmail(value);
    try {
      await updateSetting('email', value);
    } catch {
      // Failed to update email
    }
  };

  const handleLogout = () => {
    router.replace('/(auth)');
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: Platform.OS === 'ios' ? insets.top : 20 }]}>
        <Text style={styles.title}>Account</Text>
      </View>
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formContainer}>
          <TextInput
            label="Name"
            placeholder="Enter your name"
            size="medium"
            value={name}
            onChangeText={handleNameChange}
          />

          <TextInput
            label="Email"
            placeholder="Enter your email"
            size="medium"
            value={email}
            onChangeText={handleEmailChange}
          />

          <View style={styles.unitContainer}>
            <ToggleSwitch
              label="Temperature Unit"
              value={settings.temperatureUnit}
              options={[
                { value: 'Celsius', label: '°C' },
                { value: 'Fahrenheit', label: '°F' }
              ]}
              onValueChange={(value) => updateSetting('temperatureUnit', value as 'Celsius' | 'Fahrenheit')}
            />

            <ToggleSwitch
              label="Wind Speed Unit"
              value={settings.speedUnit}
              options={[
                { value: 'kph', label: 'km/h' },
                { value: 'mph', label: 'mph' }
              ]}
              onValueChange={(value) => updateSetting('speedUnit', value as 'mph' | 'kph')}
            />
          </View>

          <ToggleSwitch
            label="Style Preference"
            value={settings.stylePreference}
            options={[
              { value: 'masculine', label: 'Masculine' },
              { value: 'feminine', label: 'Feminine' },
              { value: 'neutral', label: 'Neutral' }
            ]}
            onValueChange={(value) => updateSetting('stylePreference', value as 'masculine' | 'feminine' | 'neutral')}
          />
        </View>

        <Button
          title="Log Out"
          onPress={handleLogout}
          variant="danger"
          size="medium"
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.lightGray,
    backgroundColor: theme.colors.white,
  },
  title: {
    ...typography.heading,
    color: theme.colors.black,
  },
  scrollContent: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
  formContainer: {
    marginBottom: theme.spacing.xl,
  },
  fieldContainer: {
    marginBottom: theme.spacing.md,
  },
  fieldLabel: {
    ...typography.label,
    marginBottom: theme.spacing.sm,
  },
  unitContainer: {
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
});