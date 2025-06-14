import BentoBox from '@components/BentoBox';
import FlipComponent from '@components/FlipComponent';
import LocationAutocomplete from '@components/LocationAutocomplete';
import WeatherCard from '@components/WeatherCard';
import { Ionicons } from '@expo/vector-icons';
import { useOutfitGenerator } from '@hooks/useOutfitGenerator';
import { useWeather } from '@hooks/useWeather';
import { getIoniconForWeather } from '@services/weatherIconService';
import { theme, typography } from '@styles';
import React, { useEffect, useState } from 'react';
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
  const { weather, isLoading, currentTemp, fetchWeatherByLocationString } = useWeather();
  const { outfit, loading: outfitLoading, error: outfitError, generateOutfit } = useOutfitGenerator();
  const [isFlipped, setIsFlipped] = useState(false);

  // Generate initial outfit and regenerate when weather updates
  useEffect(() => {
    console.log('👕 Weather updated, generating new outfit:', weather);
    generateOutfit(weather, 'daily activities');
  }, [weather, generateOutfit]);

  const handleWeatherButtonPress = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.greetingRow}>
        <View>
          <Text style={typography.label}>{getTimeBasedGreeting()},</Text>
          <Text style={styles.name}>Name!</Text>
        </View>
      </View>

      <View style={styles.locationRow}>
        <LocationAutocomplete
          initialValue="New York, NY, USA"
          onLocationSelect={(locationString) => {
            console.log('📍 Location selected:', locationString);
            fetchWeatherByLocationString(locationString);
          }}
          placeholder="Enter location"
        />
        <TouchableOpacity style={styles.weatherButton} onPress={handleWeatherButtonPress}>
          {isLoading ? (
            <ActivityIndicator size="small" color={theme.colors.white} />
          ) : (
            <View style={styles.weatherButtonContent}>
              <Ionicons
                name={getIoniconForWeather(weather?.icon)}
                size={20}
                color={theme.colors.white}
                style={styles.weatherIcon}
              />
              <Text style={styles.weatherButtonText}>
                {currentTemp ? `${currentTemp}°` : '--°'}
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
              weather={weather}
              loading={isLoading}
              error={outfitError}
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
  },
  name: {
    ...typography.headingItalic,
    marginTop: -4,
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
