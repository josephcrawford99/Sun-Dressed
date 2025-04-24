import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  Switch
} from 'react-native';
import { useTheme } from '../utils/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { saveLocation, getLocation, savePreferences, getPreferences, UserPreferences } from '../utils/storage';

const SettingsScreen: React.FC = () => {
  const [location, setLocation] = useState('');
  const [preferences, setPreferences] = useState<UserPreferences>({
    temperatureUnit: 'celsius',
    notificationsEnabled: false
  });
  const { theme } = useTheme();
  const { colors, typography, spacing, effects } = theme;

  // Load saved settings
  useEffect(() => {
    const loadSettings = async () => {
      const savedLocation = await getLocation();
      if (savedLocation) {
        setLocation(savedLocation);
      }

      const savedPreferences = await getPreferences();
      setPreferences(savedPreferences);
    };

    loadSettings();
  }, []);

  const handleSaveSettings = async () => {
    try {
      if (location.trim()) {
        await saveLocation(location.trim());
      }

      await savePreferences(preferences);
      Alert.alert('Success', 'Settings saved successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to save settings. Please try again.');
    }
  };

  const toggleTemperatureUnit = () => {
    setPreferences(prev => ({
      ...prev,
      temperatureUnit: prev.temperatureUnit === 'celsius' ? 'fahrenheit' : 'celsius'
    }));
  };

  const toggleNotifications = () => {
    setPreferences(prev => ({
      ...prev,
      notificationsEnabled: !prev.notificationsEnabled
    }));
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    gradientContainer: {
      flex: 1,
    },
    contentContainer: {
      padding: spacing.lg,
      paddingBottom: spacing.xxl,
    },
    section: {
      backgroundColor: colors.surface,
      borderRadius: effects.borderRadius.medium,
      padding: spacing.lg,
      marginBottom: spacing.lg,
      ...effects.shadow.light,
    },
    sectionTitle: {
      ...typography.subtitle,
      color: colors.text,
      marginBottom: spacing.md,
    },
    label: {
      ...typography.body,
      color: colors.text,
      marginBottom: spacing.xs,
    },
    input: {
      borderWidth: 1,
      borderColor: 'rgba(0,0,0,0.1)',
      borderRadius: effects.borderRadius.small,
      padding: spacing.md,
      fontSize: 16,
      color: colors.text,
      backgroundColor: 'rgba(255,255,255,0.5)',
      marginBottom: spacing.md,
    },
    infoText: {
      ...typography.caption,
      color: colors.textSecondary,
      marginTop: spacing.xs,
      marginBottom: spacing.md,
    },
    switchRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: spacing.md,
    },
    saveButton: {
      backgroundColor: colors.accent,
      borderRadius: effects.borderRadius.large,
      padding: spacing.md,
      alignItems: 'center',
      marginTop: spacing.xl,
      ...effects.shadow.light,
    },
    saveText: {
      ...typography.subtitle,
      color: 'white',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.lg,
    },
    headerIcon: {
      marginRight: spacing.sm,
    },
    headerTitle: {
      ...typography.title,
      color: colors.text,
    }
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={colors.gradient}
        style={styles.gradientContainer}
      >
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
        >
          <View style={styles.header}>
            <Ionicons
              name="settings-outline"
              size={28}
              color={colors.text}
              style={styles.headerIcon}
            />
            <Text style={styles.headerTitle}>Settings</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Location</Text>
            <Text style={styles.label}>City or Postal Code</Text>
            <TextInput
              style={styles.input}
              value={location}
              onChangeText={setLocation}
              placeholder="E.g., New York or 10001"
              placeholderTextColor="rgba(0,0,0,0.3)"
              autoCapitalize="words"
            />
            <Text style={styles.infoText}>
              Your location is used to fetch accurate weather forecasts.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Preferences</Text>

            <View style={styles.switchRow}>
              <Text style={styles.label}>
                Temperature Unit ({preferences.temperatureUnit === 'celsius' ? '°C' : '°F'})
              </Text>
              <Switch
                value={preferences.temperatureUnit === 'fahrenheit'}
                onValueChange={toggleTemperatureUnit}
                trackColor={{ false: 'rgba(0,0,0,0.1)', true: colors.primary }}
                thumbColor="white"
              />
            </View>

            <View style={styles.switchRow}>
              <Text style={styles.label}>Enable Notifications</Text>
              <Switch
                value={preferences.notificationsEnabled}
                onValueChange={toggleNotifications}
                trackColor={{ false: 'rgba(0,0,0,0.1)', true: colors.primary }}
                thumbColor="white"
              />
            </View>

            <Text style={styles.infoText}>
              Get daily clothing suggestions based on the weather forecast.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About Climate Closet</Text>
            <Text style={styles.infoText}>
              Climate Closet helps you dress appropriately for the weather. We provide clothing recommendations based on current weather and forecast data throughout the day.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSaveSettings}
          >
            <Text style={styles.saveText}>Save Settings</Text>
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>
    </View>
  );
};

export default SettingsScreen;
