import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useTheme } from '../utils/ThemeContext';
import { saveLocation, getLocation } from '../utils/storage';
import { RootStackParamList } from '../navigation/AppNavigator';
import InputField from '../components/InputField';
import Button from '../components/Button';

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
    },
    gradientContainer: {
      flex: 1,
    },
    contentContainer: {
      padding: 24,
      paddingBottom: 48,
    },
    headerSection: {
      marginBottom: 32,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: '#757575',
      marginBottom: 24,
    },
    section: {
      backgroundColor: '#fff',
      borderRadius: 12,
      padding: 24,
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 16,
    },
    buttonRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 16,
    },
    button: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      height: 48,
      borderRadius: 12,
      backgroundColor: '#FFDE82',
    },
    buttonAccent: {
      backgroundColor: '#5591A9',
    },
    buttonText: {
      color: 'white',
      marginLeft: 8,
      fontSize: 16,
      fontWeight: '600',
    },
    buttonSpacing: {
      width: 16,
    },
    savedLocationContainer: {
      marginTop: 16,
      padding: 16,
      backgroundColor: 'rgba(255,255,255,0.3)',
      borderRadius: 8,
      flexDirection: 'row',
      alignItems: 'center',
    },
    savedLocationText: {
      fontSize: 16,
      color: '#222',
      marginLeft: 8,
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
            <Button onPress={getDeviceLocation} disabled={isLoading} style={[styles.button, styles.buttonAccent]}>
              {isLoading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <>
                  <Ionicons name="locate-outline" size={18} color="white" />
                  <Text style={styles.buttonText}>Get Current Location</Text>
                </>
              )}
            </Button>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Enter Manually</Text>
            <InputField
              value={manualLocation}
              onChangeText={setManualLocation}
              placeholder="Enter city name or postal code"
              autoCapitalize="words"
              error={locationError || undefined}
            />
            <View style={styles.buttonRow}>
              <Button onPress={() => navigation.goBack()} disabled={isLoading} style={styles.button}>
                <Ionicons name="arrow-back-outline" size={18} color="white" />
                <Text style={styles.buttonText}>Back</Text>
              </Button>
              <View style={styles.buttonSpacing} />
              <Button onPress={saveManualLocation} disabled={isLoading} style={[styles.button, styles.buttonAccent]}>
                <Ionicons name="save-outline" size={18} color="white" />
                <Text style={styles.buttonText}>Save</Text>
              </Button>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
};

export default LocationScreen;
