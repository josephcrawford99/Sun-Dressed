import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

// Theme and components
import { ThemeProvider, useTheme } from '../utils/ThemeContext';
import { getWeatherCondition } from '../styles/theme';
import WeatherDisplay from '../components/WeatherDisplay';
import ClothingSuggestions from '../components/ClothingSuggestions';

// Types
import { RootStackParamList } from '../navigation/AppNavigator';
import { getSuggestions } from '../services/clothingService';
import { WeatherData } from '../services/weatherService';

// Mock data for testing
import {
  mockSunnyWeather,
  mockRainyWeather,
  mockCloudyWeather,
  mockSnowyWeather,
  mockNightWeather
} from '../__mocks__/weatherData';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

// Main Home Screen Component
const HomeScreenContent: React.FC = () => {
  const [currentWeather, setCurrentWeather] = useState(mockSunnyWeather);
  const [clothingSuggestions, setClothingSuggestions] = useState(getSuggestions(mockSunnyWeather));
  const { theme, weatherCondition, setWeatherCondition } = useTheme();
  const { colors, spacing } = theme;
  const navigation = useNavigation<HomeScreenNavigationProp>();

  // Update clothing suggestions when weather changes
  useEffect(() => {
    setClothingSuggestions(getSuggestions(currentWeather));

    // Set theme based on weather
    const condition = getWeatherCondition(
      currentWeather.description,
      currentWeather.icon
    );
    setWeatherCondition(condition);
  }, [currentWeather, setWeatherCondition]);

  const localStyles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    gradientContainer: {
      flex: 1,
    },
    container: {
      flex: 1,
      padding: spacing.lg,
    },
    weatherControls: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: spacing.md,
    },
    weatherButtonsContainer: {
      flexDirection: 'row',
    },
    weatherButton: {
      padding: spacing.sm,
      borderRadius: 8,
      backgroundColor: colors.surface,
      marginRight: spacing.xs,
    },
    settingsButton: {
      backgroundColor: colors.accent,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: 24,
      flexDirection: 'row',
      alignItems: 'center',
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    settingsText: {
      color: 'white',
      fontSize: 14,
      marginLeft: spacing.xs,
    },
  });

  // Weather selector buttons for testing
  const WeatherSelector = () => (
    <View style={localStyles.weatherControls}>
      <View style={localStyles.weatherButtonsContainer}>
        <TouchableOpacity
          style={localStyles.weatherButton}
          onPress={() => {
            setCurrentWeather(mockSunnyWeather);
            setWeatherCondition('sunny');
          }}
        >
          <Ionicons name="sunny-outline" size={20} color={colors.text} />
        </TouchableOpacity>

        <TouchableOpacity
          style={localStyles.weatherButton}
          onPress={() => {
            setCurrentWeather(mockRainyWeather);
            setWeatherCondition('rainy');
          }}
        >
          <Ionicons name="rainy-outline" size={20} color={colors.text} />
        </TouchableOpacity>

        <TouchableOpacity
          style={localStyles.weatherButton}
          onPress={() => {
            setCurrentWeather(mockCloudyWeather);
            setWeatherCondition('cloudy');
          }}
        >
          <Ionicons name="cloud-outline" size={20} color={colors.text} />
        </TouchableOpacity>

        <TouchableOpacity
          style={localStyles.weatherButton}
          onPress={() => {
            setCurrentWeather(mockSnowyWeather);
            setWeatherCondition('snowy');
          }}
        >
          <Ionicons name="snow-outline" size={20} color={colors.text} />
        </TouchableOpacity>

        <TouchableOpacity
          style={localStyles.weatherButton}
          onPress={() => {
            setCurrentWeather(mockNightWeather);
            setWeatherCondition('night');
          }}
        >
          <Ionicons name="moon-outline" size={20} color={colors.text} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={localStyles.settingsButton}
        onPress={() => navigation.navigate('Settings')}
      >
        <Ionicons name="settings-outline" size={16} color="white" />
        <Text style={localStyles.settingsText}>Settings</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={localStyles.safeArea}>
      <StatusBar
        barStyle={colors.statusBar === 'dark' ? 'dark-content' : 'light-content'}
        backgroundColor="transparent"
        translucent
      />
      <LinearGradient
        colors={colors.gradient}
        style={localStyles.gradientContainer}
      >
        <View style={localStyles.container}>
          {/* TEST ONLY: Weather selector for different conditions */}
          <WeatherSelector />

          {/* Current Weather Display */}
          <WeatherDisplay weatherData={currentWeather} />

          {/* Clothing Suggestions */}
          <ClothingSuggestions suggestions={clothingSuggestions} />
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

// Wrapper component that provides theme
const HomeScreen: React.FC = () => {
  return (
    <ThemeProvider>
      <HomeScreenContent />
    </ThemeProvider>
  );
};

export default HomeScreen;
