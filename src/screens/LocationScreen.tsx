import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';

// Theme and storage
import { useTheme } from '../utils/ThemeContext';
import { saveLocation, getLocation } from '../utils/storage';

// Navigation types
import { RootStackParamList } from '../navigation/AppNavigator';

type LocationScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Location'>;

const LocationScreen: React.FC = () => {
  const [manualLocation, setManualLocation] = useState('');
  const [savedLocation, setSavedLocation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const { theme } = useTheme();
  const { colors, typography, spacing, effects } = theme;
  const navigation = useNavigation<LocationScreenNavigationProp>();

  // Load saved location on component mount
  useEffect(() => {
    const loadSavedLocation = async () => {
      const location = await getLocation();
      if (location) {
        setSavedLocation(location);
        setManualLocation(location);
      }
    };

    loadSavedLocation();
  }, []);

  // Request device location
  const getDeviceLocation = async () => {
    setIsLoading(true);
    setLocationError(null);

    try {
      // Request location permissions
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        setLocationError('Permission to access location was denied');
        setIsLoading(false);
        return;
      }

      // Get current location
      const location = await Location.getCurrentPositionAsync({});

      // Get location name from coordinates
      const geocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      });

      if (geocode && geocode.length > 0) {
        const { city, region, country } = geocode[0];
        const locationName = city || region || country || '';

        if (locationName) {
          setManualLocation(locationName);
          await saveLocation(locationName);
          setSavedLocation(locationName);
          Alert.alert('Success', `Location set to ${locationName}`);
        } else {
          setLocationError('Could not determine your location name');
        }
      } else {
        setLocationError('Could not determine your location');
      }
    } catch (error) {
      setLocationError('Error getting location. Please try again or enter manually.');
      console.error('Location error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Save manually entered location
  const saveManualLocation = async () => {
    if (!manualLocation.trim()) {
      setLocationError('Please enter a location');
      return;
    }

    setIsLoading(true);
    setLocationError(null);

    try {
      await saveLocation(manualLocation.trim());
      setSavedLocation(manualLocation.trim());
      Alert.alert('Success', `Location set to ${manualLocation.trim()}`);
      navigation.goBack();
    } catch (error) {
      setLocationError('Error saving location. Please try again.');
      console.error('Save location error:', error);
    } finally {
      setIsLoading(false);
    }
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
    headerSection: {
      marginBottom: spacing.xl,
    },
    title: {
      ...typography.title,
      color: colors.text,
      marginBottom: spacing.xs,
    },
    subtitle: {
      ...typography.body,
      color: colors.textSecondary,
      marginBottom: spacing.lg,
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
    buttonRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: spacing.md,
    },
    button: {
      flex: 1,
      backgroundColor: colors.primary,
      borderRadius: effects.borderRadius.medium,
      padding: spacing.md,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      ...effects.shadow.light,
    },
    buttonAccent: {
      backgroundColor: colors.accent,
    },
    buttonText: {
      ...typography.subtitle,
      color: 'white',
      marginLeft: spacing.xs,
    },
    buttonSpacing: {
      width: spacing.md,
    },
    errorText: {
      ...typography.caption,
      color: '#e74c3c',
      marginTop: spacing.xs,
      marginBottom: spacing.md,
    },
    savedLocationContainer: {
      marginTop: spacing.md,
      padding: spacing.md,
      backgroundColor: 'rgba(255,255,255,0.3)',
      borderRadius: effects.borderRadius.small,
      flexDirection: 'row',
      alignItems: 'center',
    },
    savedLocationText: {
      ...typography.body,
      color: colors.text,
      marginLeft: spacing.sm,
      flex: 1,
    },
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
          <View style={styles.headerSection}>
            <Text style={styles.title}>Set Your Location</Text>
            <Text style={styles.subtitle}>
              Your location helps us provide accurate weather forecasts and clothing suggestions
            </Text>

            {savedLocation ? (
              <View style={styles.savedLocationContainer}>
                <Ionicons name="location" size={20} color={colors.accent} />
                <Text style={styles.savedLocationText}>
                  Current location: {savedLocation}
                </Text>
              </View>
            ) : null}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Use Device Location</Text>
            <TouchableOpacity
              style={[styles.button, styles.buttonAccent]}
              onPress={getDeviceLocation}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <>
                  <Ionicons name="locate-outline" size={18} color="white" />
                  <Text style={styles.buttonText}>Get Current Location</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Enter Manually</Text>
            <TextInput
              style={styles.input}
              value={manualLocation}
              onChangeText={setManualLocation}
              placeholder="Enter city name or postal code"
              placeholderTextColor="rgba(0,0,0,0.3)"
              autoCapitalize="words"
            />

            {locationError ? (
              <Text style={styles.errorText}>{locationError}</Text>
            ) : null}

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.goBack()}
                disabled={isLoading}
              >
                <Ionicons name="arrow-back-outline" size={18} color="white" />
                <Text style={styles.buttonText}>Back</Text>
              </TouchableOpacity>

              <View style={styles.buttonSpacing} />

              <TouchableOpacity
                style={[styles.button, styles.buttonAccent]}
                onPress={saveManualLocation}
                disabled={isLoading}
              >
                <Ionicons name="save-outline" size={18} color="white" />
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
};

export default LocationScreen;
