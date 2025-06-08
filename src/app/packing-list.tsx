import { theme } from '@styles/theme';
import { typography } from '@styles/typography';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { ActivityIndicator, FlatList, Platform, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { usePackingList } from '@hooks/usePackingList';
import { useTrips } from '@hooks/useTrips';

export default function PackingListModal() {
  const insets = useSafeAreaInsets();
  const { tripId } = useLocalSearchParams();
  const { getTrip, updateTripPackingList } = useTrips();
  const { packingList, loading, error, generatePackingList, setStoredPackingList } = usePackingList(updateTripPackingList);
  
  console.log('PackingListModal - tripId:', tripId);

  const trip = tripId ? getTrip(tripId as string) : null;
  
  // Load stored packing list when component mounts or trip changes
  useEffect(() => {
    if (trip?.packingList && trip.packingList.length > 0) {
      console.log('🧳 Loading stored packing list:', trip.packingList);
      setStoredPackingList(trip.packingList);
    }
  }, [trip?.packingList, setStoredPackingList]);
  
  const handleGeneratePackingList = async () => {
    if (!trip) {
      console.error('No trip found for ID:', tripId);
      return;
    }
    
    console.log('Generate Packing List pressed for trip:', trip.location);
    await generatePackingList(trip.location, trip.startDate, trip.endDate, trip.id);
  };

  const renderPackingItem = ({ item }: { item: string }) => (
    <View style={styles.packingItem}>
      <Text style={styles.packingItemText}>{item}</Text>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <TouchableOpacity
        style={styles.generateButton}
        onPress={handleGeneratePackingList}
        disabled={loading || !trip}
      >
        {loading ? (
          <ActivityIndicator size="small" color={theme.colors.white} />
        ) : (
          <Text style={styles.generateButtonText}>Generate Packing List</Text>
        )}
      </TouchableOpacity>
    </View>
  );

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
          <View style={styles.spacer} />
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
    width: 40, // Same width as back button for centering
  },
  listContainer: {
    flex: 1,
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
    borderRadius: 8,
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