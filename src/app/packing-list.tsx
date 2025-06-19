import FlipComponent from '@components/FlipComponent';
import WeatherForecastCard from '@components/WeatherForecastCard';
import { Ionicons } from '@expo/vector-icons';
import { usePackingList } from '@hooks/usePackingList';
import { useTrips } from '@hooks/useTrips';
import { useWeatherDisplayArray } from '@hooks/useWeatherDisplayArray';
import { theme } from '@styles/theme';
import { typography } from '@styles/typography';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { ActivityIndicator, FlatList, Platform, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function PackingListModal() {
  const insets = useSafeAreaInsets();
  const { tripId } = useLocalSearchParams();
  const { getTrip } = useTrips();
  const { 
    packingList, 
    weatherForecast,
    loading, 
    error, 
    generatePackingList, 
    refetch
  } = usePackingList(tripId as string);
  const { convertToDisplayArray } = useWeatherDisplayArray();
  const [isFlipped, setIsFlipped] = useState(false);

  const trip = tripId ? getTrip(tripId as string) : null;
  
  // TanStack Query automatically handles loading stored data
  
  const handleGeneratePackingList = async () => {
    if (!trip) {
      // No trip found for ID
      return;
    }
    
    try {
      await generatePackingList(trip.location, trip.startDate, trip.endDate, trip.id);
    } catch {
      // Error generating packing list
    }
  };

  const handleWeatherButtonPress = () => {
    setIsFlipped(!isFlipped);
  };

  // Get weather display data
  const weatherDisplayArray = weatherForecast.length > 0 ? convertToDisplayArray(weatherForecast) : [];

  const renderPackingItem = ({ item }: { item: string }) => (
    <View style={styles.packingItem}>
      <Text style={styles.packingItemText}>{item}</Text>
    </View>
  );

  const renderPackingList = () => (
    <FlatList
      data={packingList}
      renderItem={renderPackingItem}
      keyExtractor={(item, index) => `${index}-${item}`}
      contentContainerStyle={styles.listContentContainer}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={loading}
          onRefresh={() => {
            refetch();
            if (trip) {
              handleGeneratePackingList();
            }
          }}
          tintColor={theme.colors.black}
          title="Pull to regenerate"
          titleColor={theme.colors.black}
        />
      }
    />
  );

  const renderEmptyState = () => {
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
      <FlipComponent
        isFlipped={isFlipped}
        frontComponent={renderPackingList()}
        backComponent={
          <WeatherForecastCard
            weatherDisplayArray={weatherDisplayArray}
            loading={loading}
            error={error}
            location={trip?.location}
            startDate={trip?.startDate}
          />
        }
        style={styles.flipContainer}
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
          {trip && packingList.length > 0 ? (
            <TouchableOpacity style={styles.weatherButton} onPress={handleWeatherButtonPress}>
              <Text style={styles.weatherButtonText}>
                {isFlipped ? 'List' : 'Weather'}
              </Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.spacer} />
          )}
        </View>
        
        <View style={styles.listContainer}>
          {renderContent()}
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
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
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
    paddingHorizontal: theme.spacing.md,
    minHeight: 40,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 80,
  },
  weatherButtonText: {
    ...typography.body,
    fontSize: theme.fontSize.sm,
    fontWeight: '600',
    color: theme.colors.white,
  },
  listContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  flipContainer: {
    flex: 1,
    minHeight: 400,
    backgroundColor: 'transparent',
    borderRadius: theme.borderRadius.large,
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