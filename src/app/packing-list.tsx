import FlipComponent from '@components/FlipComponent';
import WeatherForecastCard from '@components/WeatherForecastCard';
import { useSettings } from '@contexts/SettingsContext';
import { Ionicons } from '@expo/vector-icons';
import { usePackingList } from '@hooks/usePackingList';
import { useTrips } from '@hooks/useTrips';
import { useWeatherDisplayArray } from '@hooks/useWeatherDisplayArray';
import { getIoniconForWeather } from '@services/weatherIconService';
import { theme } from '@styles/theme';
import { typography } from '@styles/typography';
import { convertTemperature, getTemperatureSymbol } from '@utils/unitConversions';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Platform, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function PackingListModal() {
  const insets = useSafeAreaInsets();
  const { tripId } = useLocalSearchParams();
  const { getTrip, updateTripPackingList, updateTripWeatherForecast } = useTrips();
  const { 
    packingList, 
    weatherForecast,
    loading, 
    error, 
    generatePackingList, 
    setStoredPackingList,
    setStoredWeatherForecast
  } = usePackingList(updateTripPackingList, updateTripWeatherForecast);
  const { convertToDisplayArray } = useWeatherDisplayArray();
  const { settings } = useSettings();
  const [isFlipped, setIsFlipped] = useState(false);
  
  console.log('PackingListModal - tripId:', tripId);

  const trip = tripId ? getTrip(tripId as string) : null;
  
  // Load stored packing list and weather when component mounts or trip changes
  useEffect(() => {
    if (trip?.packingList && trip.packingList.length > 0) {
      console.log('🧳 Loading stored packing list:', trip.packingList);
      setStoredPackingList(trip.packingList);
    }
    if (trip?.weatherForecast && trip.weatherForecast.length > 0) {
      console.log('🌤️ Loading stored weather forecast:', trip.weatherForecast);
      setStoredWeatherForecast(trip.weatherForecast);
    }
  }, [trip?.packingList, trip?.weatherForecast, setStoredPackingList, setStoredWeatherForecast]);
  
  const handleGeneratePackingList = async () => {
    console.log('Button pressed - checking trip:', { trip, tripId, loading });
    if (!trip) {
      console.error('No trip found for ID:', tripId);
      return;
    }
    
    console.log('Generate Packing List pressed for trip:', trip.location);
    try {
      await generatePackingList(trip.location, trip.startDate, trip.endDate, trip.id);
    } catch (error) {
      console.error('Error generating packing list:', error);
    }
  };

  const handleWeatherButtonPress = () => {
    setIsFlipped(!isFlipped);
  };

  // Get weather display data
  const weatherDisplayArray = weatherForecast.length > 0 ? convertToDisplayArray(weatherForecast) : [];
  const firstDayWeather = weatherDisplayArray[0];
  const tempSymbol = getTemperatureSymbol(settings.temperatureUnit);
  const currentTemp = firstDayWeather 
    ? `${convertTemperature(firstDayWeather.feelsLikeTemp, settings.temperatureUnit)}${tempSymbol}`
    : '--°';

  const renderPackingItem = ({ item }: { item: string }) => (
    <View style={styles.packingItem}>
      <Text style={styles.packingItemText}>{item}</Text>
    </View>
  );

  const renderEmptyState = () => {
    console.log('Rendering empty state. Is loading:', loading, 'Is trip available:', !!trip);
    return (
      <View style={styles.emptyContainer}>
        <TouchableOpacity
          style={[styles.generateButton, (loading || !trip) && styles.disabledButton]}
          onPress={handleGeneratePackingList}
          disabled={loading || !trip}
          activeOpacity={0.7}
        >
          {loading ? (
            <ActivityIndicator size="small" color={theme.colors.white} />
        ) : (
          <Text style={styles.generateButtonText}>Generate Packing List</Text>
        )}
      </TouchableOpacity>
      {!trip && <Text style={styles.debugText}>No trip data available</Text>}
    </View>
    );
  };

  const renderContent = () => {
    if (!trip) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Trip not found</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={handleGeneratePackingList}
          >
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (packingList.length === 0) {
      return renderEmptyState();
    }

    return (
      <FlatList
        data={packingList}
        renderItem={renderPackingItem}
        keyExtractor={(item, index) => `${index}-${item}`}
        contentContainerStyle={styles.listContentContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={handleGeneratePackingList}
            tintColor={theme.colors.black}
            title="Pull to regenerate"
            titleColor={theme.colors.black}
          />
        }
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={[styles.content, { paddingTop: Platform.OS === 'ios' ? insets.top + 20 : 40 }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.black} />
          </TouchableOpacity>
          <Text style={styles.title}>Packing List</Text>
          {weatherForecast.length > 0 ? (
            <TouchableOpacity style={styles.weatherButton} onPress={handleWeatherButtonPress}>
              {loading ? (
                <ActivityIndicator size="small" color={theme.colors.white} />
              ) : (
                <View style={styles.weatherButtonContent}>
                  <Ionicons
                    name={getIoniconForWeather(firstDayWeather?.icon)}
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
          ) : (
            <View style={styles.spacer} />
          )}
        </View>
        
        <View style={styles.listContainer}>
          {weatherForecast.length > 0 ? (
            <FlipComponent
              isFlipped={isFlipped}
              frontComponent={
                <View style={styles.flipContent}>
                  {renderContent()}
                </View>
              }
              backComponent={
                <WeatherForecastCard
                  weatherDisplayArray={weatherDisplayArray}
                  loading={loading}
                  error={error}
                  location={trip?.location}
                />
              }
              style={styles.flipContainer}
            />
          ) : (
            renderContent()
          )}
        </View>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
  },
  backButton: {
    padding: theme.spacing.sm,
  },
  title: {
    ...typography.heading,
    fontSize: theme.fontSize.xxxl,
    color: theme.colors.black,
    flex: 1,
    textAlign: 'center',
  },
  spacer: {
    width: theme.spacing.xl + theme.spacing.sm, // Same width as back button for centering
  },
  weatherButton: {
    backgroundColor: theme.colors.black,
    borderRadius: theme.borderRadius.medium,
    paddingHorizontal: theme.spacing.sm,
    minHeight: 40,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 80,
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
    fontSize: theme.fontSize.sm,
    alignSelf: 'center',
  },
  listContainer: {
    flex: 1,
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    overflow: 'hidden',
  },
  flipContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  flipContent: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.large,
    overflow: 'hidden',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  generateButton: {
    backgroundColor: theme.colors.black,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.medium,
    alignItems: 'center',
    minHeight: 48,
    justifyContent: 'center',
  },
  generateButtonText: {
    ...typography.body,
    fontSize: theme.fontSize.md,
    fontWeight: '600',
    color: theme.colors.white,
  },
  disabledButton: {
    opacity: 0.5,
  },
  debugText: {
    ...typography.caption,
    color: theme.colors.gray,
    marginTop: theme.spacing.sm,
  },
  listContentContainer: {
    paddingVertical: theme.spacing.md,
  },
  packingItem: {
    backgroundColor: theme.colors.surface,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.xs,
    borderRadius: theme.borderRadius.small,
  },
  packingItemText: {
    ...typography.body,
    fontSize: theme.fontSize.md,
    color: theme.colors.black,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  errorText: {
    ...typography.body,
    fontSize: theme.fontSize.md,
    color: theme.colors.error,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: theme.colors.black,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.small,
  },
  retryButtonText: {
    ...typography.body,
    fontSize: theme.fontSize.sm,
    fontWeight: '600',
    color: theme.colors.white,
  },
});