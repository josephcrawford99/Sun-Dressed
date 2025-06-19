import { useSettings } from '@/contexts/SettingsContext';
import CalendarBar, { DateOffset } from '@components/CalendarBar';
import { HomeHeader } from '@components/home/HomeHeader';
import { LocationWeatherBar } from '@components/home/LocationWeatherBar';
import { MainContentArea } from '@components/home/MainContentArea';
import { useActivityInput } from '@hooks/home/useActivityInput';
import { useHomeScreenState } from '@hooks/home/useHomeScreenState';
import { useLocation } from '@hooks/useLocation';
import { useLocationWeather } from '@hooks/useLocationWeather';
import { useOutfitQuery, useOutfitRegeneration, useDailyOutfitLogger } from '@hooks/queries/useOutfitQuery';
import { theme } from '@styles';
import React, { useCallback, useState, useMemo, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
} from 'react-native';

export default function HomeScreen() {
  const { settings } = useSettings();
  const { location, saveLocation } = useLocation();
  const { weather, weatherDisplay, isLoading: weatherLoading, error: weatherError, fetchWeatherByLocationString } = useLocationWeather();
  
  // Outfit state management
  const [currentDateOffset, setCurrentDateOffset] = useState<DateOffset>(0);
  const [currentActivity, setCurrentActivity] = useState('daily activities');
  
  // Initialize home screen state and handle initialization
  const { isFlipped, toggleFlipped } = useHomeScreenState({
    location,
    onLocationReady: fetchWeatherByLocationString
  });

  // Handle activity input with debouncing
  useActivityInput({
    onActivityChange: setCurrentActivity
  });

  // Calculate target date
  const targetDate = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + currentDateOffset);
    return date;
  }, [currentDateOffset]);

  // Main outfit query - handles all caching automatically!
  const { 
    data: outfit, 
    isLoading: outfitLoading, 
    error: outfitError
  } = useOutfitQuery(targetDate, location, currentActivity, weather);

  // Mutation for force regenerating outfits
  const outfitRegeneration = useOutfitRegeneration();
  
  // Mutation for logging worn outfits
  const dailyOutfitLogger = useDailyOutfitLogger();

  // Log current outfit as "worn" when navigating away from today
  useEffect(() => {
    // Only log if we're navigating away from today and have an outfit
    if (currentDateOffset !== 0 && outfit && location) {
      const today = new Date();
      dailyOutfitLogger.mutate({
        date: today,
        outfit,
        location
      });
    }
  }, [currentDateOffset, outfit, location, dailyOutfitLogger]); // Include all dependencies

  // Handle outfit refresh with date validation
  const handleOutfitRefresh = useCallback(async () => {
    // Don't allow refresh for past dates (including yesterday)
    if (currentDateOffset < 0) {
      return;
    }
    
    if (!weather || !location) {
      return;
    }
    
    // Use the mutation for force regeneration
    outfitRegeneration.mutate({
      date: targetDate,
      location,
      activity: currentActivity,
      weather
    });
  }, [currentDateOffset, weather, location, currentActivity, targetDate, outfitRegeneration]);

  // Handle date selection
  const handleDateSelect = useCallback((offset: DateOffset) => {
    setCurrentDateOffset(offset);
  }, []);

  // Handle location selection - now much simpler!
  const handleLocationSelect = useCallback(async (locationString: string, coordinates?: { lat: number; lon: number }) => {
    await saveLocation(locationString);
    fetchWeatherByLocationString(locationString, coordinates);
    // No need to manually handle outfit loading - useOutfitQuery will automatically
    // refetch when location changes thanks to its query key dependency!
  }, [saveLocation, fetchWeatherByLocationString]);

  // Combine loading states
  const isLoading = weatherLoading || outfitLoading || outfitRegeneration.isPending;
  
  // Combine errors - convert to string for component compatibility
  const error = (outfitError?.message || outfitError) || 
                weatherError || 
                (outfitRegeneration.error?.message || outfitRegeneration.error?.toString());

  return (
    <SafeAreaView style={styles.container}>
      <HomeHeader userName={settings.name} />
      
      <LocationWeatherBar
        location={location}
        weatherDisplay={weatherDisplay}
        isWeatherLoading={weatherLoading}
        onLocationSelect={handleLocationSelect}
        onWeatherButtonPress={toggleFlipped}
      />

      <CalendarBar
        selectedDateOffset={currentDateOffset}
        onDateSelect={handleDateSelect}
      />

      <MainContentArea
        isFlipped={isFlipped}
        outfit={outfit || null}
        outfitLoading={isLoading}
        outfitError={(error as string) || null}
        weatherDisplay={weatherDisplay}
        isWeatherLoading={weatherLoading}
        weatherError={weatherError}
        currentDateOffset={currentDateOffset}
        onRefresh={handleOutfitRefresh}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
});