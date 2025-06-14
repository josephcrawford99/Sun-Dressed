import { useSettings } from '@/contexts/SettingsContext';
import BentoBox from '@components/BentoBox';
import FlipComponent from '@components/FlipComponent';
import LocationAutocomplete from '@components/LocationAutocomplete';
import WeatherCard from '@components/WeatherCard';
import { Ionicons } from '@expo/vector-icons';
import { useLocationWeather } from '@hooks/useLocationWeather';
import { useOutfitGenerator } from '@hooks/useOutfitGenerator';
import { getIoniconForWeather } from '@services/weatherIconService';
import { theme, typography } from '@styles';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const getTimeBasedGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'good morning';
  if (hour < 18) return 'good afternoon';
  return 'good evening';
};

export default function HomeScreen() {
  const { settings } = useSettings();
  const { outfit, loading: outfitLoading, error: outfitError, generateOutfit } = useOutfitGenerator();
  const { weather, weatherDisplay, isLoading, error, fetchWeatherByLocationString } = useLocationWeather();
  const [isFlipped, setIsFlipped] = useState(false);


  // Generate initial outfit and regenerate when weather updates
  useEffect(() => {
    if (weather) {
      console.log('👕 Weather updated, generating new outfit:', weather);
      generateOutfit(weather, 'daily activities');
    }
  }, [weather, generateOutfit]);

  const handleWeatherButtonPress = () => {
    setIsFlipped(!isFlipped);
  };

  // Get current temperature from weatherDisplay (already in user's preferred unit)
  const currentTemp = weatherDisplay?.displayTemp.current || '--°';

  // Memoize LocationAutocomplete props to prevent unnecessary re-renders
  const locationAutocompleteProps = useMemo(() => ({
    initialValue: "New York, NY, USA",
    onLocationSelect: (locationString: string, coordinates?: { lat: number; lon: number }) => {
      console.log('📍 Location selected:', locationString);
      fetchWeatherByLocationString(locationString, coordinates);
    },
    placeholder: "Enter location"
  }), [fetchWeatherByLocationString]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.greetingRow}>
        <View>
          <Text style={typography.label}>{getTimeBasedGreeting()},</Text>
          <Text style={styles.name}>{settings.name || 'Name!'}</Text>
        </View>
      </View>

      <View style={styles.locationRow}>
        <LocationAutocomplete
          {...locationAutocompleteProps}
        />
        <TouchableOpacity style={styles.weatherButton} onPress={handleWeatherButtonPress}>
          {isLoading ? (
            <ActivityIndicator size="small" color={theme.colors.white} />
          ) : (
            <View style={styles.weatherButtonContent}>
              <Ionicons
                name={getIoniconForWeather(weatherDisplay?.icon)}
                size={20}
                color={theme.colors.white}
                style={styles.weatherIcon}
              />
              <Text style={styles.weatherButtonText}>
                {currentTemp}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.mainContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <FlipComponent
          isFlipped={isFlipped}
          frontComponent={
            <BentoBox 
              weather={weather}
              activity="daily activities"
              outfit={outfit}
              loading={outfitLoading}
              error={outfitError}
            />
          }
          backComponent={
            <WeatherCard 
              weatherDisplay={weatherDisplay}
              loading={isLoading}
              error={error}
            />
          }
          style={styles.flipContainer}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  greetingRow: {
    marginHorizontal: theme.spacing.md,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.md,
    paddingLeft: theme.spacing.xs,
  },
  name: {
    ...typography.headingItalic,
    marginTop: -4,
    paddingLeft: theme.spacing.xs,
    fontSize: 32,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
    marginBottom: 0,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.lightGray,
  },
  weatherButton: {
    marginLeft: theme.spacing.sm,
    backgroundColor: theme.colors.black,
    borderRadius: theme.borderRadius.medium,
    paddingHorizontal: theme.spacing.sm,
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 90,
  },
  weatherButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  weatherIcon: {
    marginRight: theme.spacing.xs,
  },
  weatherButtonText: {
    ...typography.tempButton,
    alignSelf: 'center',
  },
  mainContainer: {
    flex: 1,
    marginHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.large,
  },
  scrollContent: {
    padding: theme.spacing.lg,
    minHeight: 400,
  },
  flipContainer: {
    minHeight: 400,
  },
  contentPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  debugContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.sm,
  },
  debugText: {
    ...typography.body,
    fontSize: theme.fontSize.sm,
    color: theme.colors.black,
    textAlign: 'center',
  },
});
