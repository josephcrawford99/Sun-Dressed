import { TextInput } from '@/components/ui/TextInput';
import { useOutfit } from '@/contexts/OutfitContext';
import { useSettings } from '@/contexts/SettingsContext';
import BentoBox from '@components/BentoBox';
import CalendarBar, { DateOffset } from '@components/CalendarBar';
import FlipComponent from '@components/FlipComponent';
import LocationAutocomplete from '@components/LocationAutocomplete';
import WeatherCard from '@components/WeatherCard';
import { Ionicons } from '@expo/vector-icons';
import { useLastLocation } from '@hooks/useLastLocation';
import { useLocationWeather } from '@hooks/useLocationWeather';
import { getIoniconForWeather } from '@services/weatherIconService';
import { theme, typography } from '@styles';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
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
  const { lastLocation, saveLastLocation } = useLastLocation();
  const { weather, weatherDisplay, isLoading, error, fetchWeatherByLocationString } = useLocationWeather();
  const { 
    outfit, 
    loading: outfitLoading, 
    error: outfitError, 
    currentDateOffset,
    currentActivity,
    loadOutfitForDate,
    regenerateOutfit: regenerateOutfitContext,
    setDateOffset,
    setActivity
  } = useOutfit();

  const [isFlipped, setIsFlipped] = useState(false);
  const [activityInput, setActivityInput] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);
  const activityDebounceRef = useRef<NodeJS.Timeout>();

  // Fetch weather for the saved location on mount
  useEffect(() => {
    if (lastLocation && !isInitialized) {
      fetchWeatherByLocationString(lastLocation);
      setIsInitialized(true);
    }
  }, [lastLocation, isInitialized, fetchWeatherByLocationString]);

  // Debounce activity input and update context
  useEffect(() => {
    if (activityDebounceRef.current) {
      clearTimeout(activityDebounceRef.current);
    }

    activityDebounceRef.current = setTimeout(() => {
      const activity = activityInput || 'daily activities';
      setActivity(activity);
    }, 800); // 800ms delay

    return () => {
      if (activityDebounceRef.current) {
        clearTimeout(activityDebounceRef.current);
      }
    };
  }, [activityInput, setActivity]);

  // Load outfit when conditions change
  useEffect(() => {
    // Skip if we're still loading initial weather
    if (!isInitialized || isLoading) {
      return;
    }
    
    loadOutfitForDate(currentDateOffset, weather, currentActivity, lastLocation);
  }, [currentDateOffset, weather, currentActivity, lastLocation, isInitialized, isLoading, loadOutfitForDate]);

  const handleWeatherButtonPress = () => {
    setIsFlipped(!isFlipped);
  };

  const handleOutfitRefresh = async () => {
    // Don't allow refresh for past dates (including yesterday)
    if (currentDateOffset < 0) {
      return;
    }
    
    if (!weather || !lastLocation) {
      return;
    }
    
    await regenerateOutfitContext(weather, currentActivity, lastLocation);
  };

  const handleDateSelect = (offset: DateOffset) => {
    setDateOffset(offset);
  };

  // Get current temperature from weatherDisplay (already in user's preferred unit)
  const currentTemp = weatherDisplay?.displayTemp.current || '--°';

  // Memoize LocationAutocomplete props to prevent unnecessary re-renders
  const locationAutocompleteProps = useMemo(() => ({
    initialValue: lastLocation,
    onLocationSelect: async (locationString: string, coordinates?: { lat: number; lon: number }) => {
      await saveLastLocation(locationString);
      fetchWeatherByLocationString(locationString, coordinates);
    },
    placeholder: "Enter location"
  }), [lastLocation, saveLastLocation, fetchWeatherByLocationString]);

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

      <CalendarBar
        selectedDateOffset={currentDateOffset}
        onDateSelect={handleDateSelect}
      />
      <View style={styles.activityContainer}>
          <TextInput
            placeholder="Activity"
            size="medium"
            value={activityInput}
            onChangeText={(text) => {
              setActivityInput(text);
            }}
            editable={true}
            returnKeyType="done"
            blurOnSubmit={true}
          />
        </View>

      <ScrollView
        style={styles.mainScrollView}
        contentContainerStyle={styles.mainScrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          currentDateOffset >= 0 ? (
            <RefreshControl
              refreshing={outfitLoading}
              onRefresh={handleOutfitRefresh}
              tintColor={theme.colors.black}
              title="Pull to regenerate"
              titleColor={theme.colors.black}
            />
          ) : undefined
        }
      >
        <FlipComponent
          isFlipped={isFlipped}
          frontComponent={
            <BentoBox 
              outfit={outfit}
              loading={outfitLoading}
              error={outfitError}
              showNoOutfit={!outfitLoading && !outfit}
              noOutfitDate={
                new Date(new Date().setDate(new Date().getDate() + currentDateOffset))
                  .toISOString().split('T')[0]
              }
            />
          }
          backComponent={
            <WeatherCard 
              weatherDisplay={weatherDisplay || undefined}
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
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.md,
    paddingLeft: theme.spacing.xs,
  },
  name: {
    ...typography.headingItalic,
    marginTop: -4,
    paddingLeft: theme.spacing.xs,
    fontSize: theme.fontSize.display,
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
  mainScrollView: {
    flex: 1,
  },
  mainScrollContent: {
    flexGrow: 1,
    marginHorizontal: theme.spacing.md,
    marginTop: theme.spacing.md,
    minHeight: 450,
    paddingBottom: 100, // Account for tab bar height + safe area
  },
  activityContainer: {
    display: 'flex',
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.none,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.lightGray,
    backgroundColor: theme.colors.white,
  },
  flipContainer: {
    flex: 1,
    minHeight: 400,
    backgroundColor: 'transparent',
    borderRadius: theme.borderRadius.large,
  },
  debugStats: {
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: theme.borderRadius.small,
    marginTop: theme.spacing.sm,
  },
  debugStatsText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.gray,
    textAlign: 'center',
  },
});
