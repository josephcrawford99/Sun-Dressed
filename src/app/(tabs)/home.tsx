import { useOutfit } from '@/contexts/OutfitContext';
import { useSettings } from '@/contexts/SettingsContext';
import CalendarBar, { DateOffset } from '@components/CalendarBar';
import { useLastLocation } from '@hooks/useLastLocation';
import { useLocationWeather } from '@hooks/useLocationWeather';
import { useActivityInput } from '@hooks/home/useActivityInput';
import { useHomeScreenState } from '@hooks/home/useHomeScreenState';
import { HomeHeader } from '@components/home/HomeHeader';
import { LocationWeatherBar } from '@components/home/LocationWeatherBar';
import { ActivityInputSection } from '@components/home/ActivityInputSection';
import { MainContentArea } from '@components/home/MainContentArea';
import { theme } from '@styles';
import React, { useEffect, useCallback, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useShouldShowDailyFeedback, useSaveDailyFeedbackMutation } from '@/hooks/queries/useDailyFeedbackQuery';
import { DailyFeedbackModal } from '@/components/DailyFeedbackModal';
import { OutfitFeedback } from '@/types/Outfit';


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
  
  // Daily feedback modal state
  const [modalVisible, setModalVisible] = useState(false);
  const { data: feedbackData, refetch: refetchShouldShow } = useShouldShowDailyFeedback();
  const saveFeedback = useSaveDailyFeedbackMutation();

  // Initialize home screen state and handle initialization
  const { isFlipped, isInitialized, toggleFlipped } = useHomeScreenState({
    lastLocation,
    onLocationReady: fetchWeatherByLocationString
  });

  // Handle activity input with debouncing
  const { activityInput, setActivityInput } = useActivityInput({
    onActivityChange: setActivity
  });
  
  // Check if we should show daily feedback modal on screen focus
  useFocusEffect(
    useCallback(() => {
      if (feedbackData?.shouldShow) {
        setModalVisible(true);
      }
    }, [feedbackData])
  );
  
  // Handle feedback submission
  const handleFeedbackSubmit = useCallback(async (feedback: Partial<OutfitFeedback>) => {
    await saveFeedback.mutateAsync(feedback);
    setModalVisible(false);
    refetchShouldShow(); // Ensure state is updated
  }, [saveFeedback, refetchShouldShow]);


  // Load outfit when conditions change
  useEffect(() => {
    // Skip if we're still loading initial weather
    if (!isInitialized || isLoading) {
      return;
    }
    
    loadOutfitForDate(currentDateOffset, weather, currentActivity, lastLocation);
  }, [currentDateOffset, weather, currentActivity, lastLocation, isInitialized, isLoading, loadOutfitForDate]);


  // Handle outfit refresh with date validation
  const handleOutfitRefresh = useCallback(async () => {
    // Don't allow refresh for past dates (including yesterday)
    if (currentDateOffset < 0) {
      return;
    }
    
    if (!weather || !lastLocation) {
      return;
    }
    
    await regenerateOutfitContext(weather, currentActivity, lastLocation);
  }, [currentDateOffset, weather, lastLocation, regenerateOutfitContext, currentActivity]);

  // Handle date selection
  const handleDateSelect = useCallback((offset: DateOffset) => {
    setDateOffset(offset);
  }, [setDateOffset]);

  // Handle location selection
  const handleLocationSelect = useCallback(async (locationString: string, coordinates?: { lat: number; lon: number }) => {
    await saveLastLocation(locationString);
    fetchWeatherByLocationString(locationString, coordinates);
  }, [saveLastLocation, fetchWeatherByLocationString]);

  return (
    <SafeAreaView style={styles.container}>
      <HomeHeader userName={settings.name} />
      
      <LocationWeatherBar
        lastLocation={lastLocation}
        weatherDisplay={weatherDisplay}
        isWeatherLoading={isLoading}
        onLocationSelect={handleLocationSelect}
        onWeatherButtonPress={toggleFlipped}
      />

      <CalendarBar
        selectedDateOffset={currentDateOffset}
        onDateSelect={handleDateSelect}
      />
      
      <ActivityInputSection
        value={activityInput}
        onChangeText={setActivityInput}
      />

      <MainContentArea
        isFlipped={isFlipped}
        outfit={outfit}
        outfitLoading={outfitLoading}
        outfitError={outfitError}
        weatherDisplay={weatherDisplay}
        isWeatherLoading={isLoading}
        weatherError={error}
        currentDateOffset={currentDateOffset}
        onRefresh={handleOutfitRefresh}
      />
      
      <DailyFeedbackModal
        visible={modalVisible && feedbackData?.shouldShow}
        outfit={feedbackData?.outfit || null}
        date={feedbackData?.date || ''}
        onClose={() => setModalVisible(false)}
        onSubmit={handleFeedbackSubmit}
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
