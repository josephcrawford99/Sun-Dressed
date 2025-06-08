import { TripCard } from '@/components/TripCard';
import { useTrips } from '@/hooks/useTrips';
import { theme, typography } from '@/styles';
import { Trip } from '@/types/trip';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback } from 'react';
import { FlatList, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TripsScreen() {
  const insets = useSafeAreaInsets();
  const { trips, loading, refreshTrips, deleteTrip } = useTrips();

  // Refresh trips when screen comes into focus (e.g., after returning from create-trip modal)
  useFocusEffect(
    useCallback(() => {
      refreshTrips();
    }, [refreshTrips])
  );

  const handleAddTrip = () => {
    router.push('/create-trip');
  };

  const renderTripCard = ({ item }: { item: Trip }) => (
    <TripCard trip={item} onDelete={deleteTrip} />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.placeholderText}>Try adding a trip!</Text>
    </View>
  );

  return (
    <PaperProvider>
      <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Trips</Text>
        <TouchableOpacity onPress={handleAddTrip} style={styles.addButton}>
          <Ionicons name="add-circle-outline" size={32} color={theme.colors.black} />
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={trips}
        renderItem={renderTripCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={trips.length === 0 ? styles.emptyListContainer : styles.listContainer}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    ...typography.heading,
    color: theme.colors.black,
  },
  addButton: {
    padding: 5,
  },
  listContainer: {
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    ...typography.placeholderText,
    color: theme.colors.gray,
    textAlign: 'center',
  },
});