import React, { useCallback } from 'react';
import { ActivityIndicator, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';

import { TripsList } from '@components/TripsList';
import { useTrips } from '@hooks/useTrips';
import { theme, typography } from '@styles';
import { Trip } from '@/types/trip';

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
    try {
      router.push('/edit-trip?mode=create');
    } catch {
      // Failed to navigate to create trip
    }
  };

  const handleEditTrip = (trip: Trip) => {
    try {
      router.push(`/edit-trip?mode=edit&tripId=${trip.id}`);
    } catch {
      // Failed to navigate to edit trip
    }
  };

  const handleViewPackingList = (trip: Trip) => {
    try {
      router.push(`/packing-list?tripId=${trip.id}`);
    } catch {
      // Failed to navigate to packing list
    }
  };

  return (
    <PaperProvider>
      <View style={styles.container}>
      <View style={[styles.header, { paddingTop: Platform.OS === 'ios' ? insets.top : 20 }]}>
        <Text style={styles.title}>Trips</Text>
        <TouchableOpacity onPress={handleAddTrip} style={styles.addButton}>
          <Ionicons name="add-circle-outline" size={32} color={theme.colors.black} />
        </TouchableOpacity>
      </View>
      
      <TripsList
        trips={trips}
        loading={loading}
        onDelete={deleteTrip}
        onEdit={handleEditTrip}
        onViewPackingList={handleViewPackingList}
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
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.lightGray,
    backgroundColor: theme.colors.white,
  },
  title: {
    ...typography.heading,
    color: theme.colors.black,
  },
  addButton: {
    padding: theme.spacing.none,
  },

});