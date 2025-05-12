import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { useTheme } from '../utils/ThemeContext';
import { useSettings } from '../utils/SettingsContext';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { saveLocation, getLocation } from '../utils/storage';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import InputField from '../components/InputField';
import Button from '../components/Button';

type SettingsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Settings'>;

const SettingsScreen: React.FC = () => {
  const [location, setLocation] = useState('');
  const { theme } = useTheme();
  const { colors, typography, spacing, effects } = theme;
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const { temperatureUnit, windSpeedUnit, toggleTemperatureUnit, toggleWindSpeedUnit } = useSettings();

  // Load saved location
  useEffect(() => {
    const loadSettings = async () => {
      const savedLocation = await getLocation();
      if (savedLocation) {
        setLocation(savedLocation);
      }
    };

    loadSettings();
  }, []);

  const handleSaveSettings = async () => {
    try {
      if (location.trim()) {
        await saveLocation(location.trim());
      }
      Alert.alert('Success', 'Settings saved successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to save settings. Please try again.');
    }
  };

  const navigateToLocationScreen = () => {
    navigation.navigate('Location');
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
    label: {
      fontSize: 16,
      marginBottom: 8,
    },
    infoText: {
      fontSize: 12,
      color: '#757575',
      marginTop: 8,
      marginBottom: 16,
    },
    switchRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 24,
    },
    headerIcon: {
      marginRight: 8,
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: 'bold',
    },
    locationRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    locationButton: {
      backgroundColor: '#FFDE82',
      borderRadius: 8,
      paddingVertical: 8,
      paddingHorizontal: 16,
      flexDirection: 'row',
      alignItems: 'center',
    },
    locationButtonText: {
      color: 'white',
      marginLeft: 8,
    },
    locationDisplay: {
      flex: 1,
      marginRight: 16,
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
            <View style={styles.locationRow}>
              <View style={styles.locationDisplay}>
                <Text style={styles.label}>Current Location</Text>
                <Text>{location || 'Not set'}</Text>
              </View>
              <Button onPress={navigateToLocationScreen} style={styles.locationButton}>
                <Ionicons name="location-outline" size={16} color="white" />
                <Text style={styles.locationButtonText}>Change</Text>
              </Button>
            </View>
            <Text style={styles.infoText}>
              Your location is used to fetch accurate weather forecasts.
            </Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Preferences</Text>
            <View style={styles.switchRow}>
              <Text style={styles.label}>
                Temperature Unit ({temperatureUnit === 'C' ? '°C' : '°F'})
              </Text>
              <Switch
                value={temperatureUnit === 'F'}
                onValueChange={toggleTemperatureUnit}
                trackColor={{ false: 'rgba(0,0,0,0.1)', true: colors.primary }}
                thumbColor="white"
              />
            </View>
            <View style={styles.switchRow}>
              <Text style={styles.label}>
                Wind Speed Unit ({windSpeedUnit === 'ms' ? 'm/s' : 'mph'})
              </Text>
              <Switch
                value={windSpeedUnit === 'mph'}
                onValueChange={toggleWindSpeedUnit}
                trackColor={{ false: 'rgba(0,0,0,0.1)', true: colors.primary }}
                thumbColor="white"
              />
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
};

export default SettingsScreen;
