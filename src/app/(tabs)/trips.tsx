import { TripCard } from '@components/TripCard';
import { Ionicons } from '@expo/vector-icons';
import { useTrips } from '@hooks/useTrips';
import { theme, typography } from '@styles';
import { Trip } from '@/types/trip';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
console.log('TripCard import:', TripCard);

export default function TripsScreen() {
  const insets = useSafeAreaInsets();
  const { trips, loading, refreshTrips, deleteTrip } = useTrips();
  
  console.log('TripsScreen rendered - trips.length:', trips.length, 'trips:', trips);

  // Refresh trips when screen comes into focus (e.g., after returning from create-trip modal)
  useFocusEffect(
    useCallback(() => {
      refreshTrips();
    }, [refreshTrips])
  );

  const handleAddTrip = () => {
    router.push('/create-trip');
  };

  const handleEditTrip = (trip: Trip) => {
    console.log('TripsScreen handleEditTrip called for trip:', trip.id, trip.location);
    router.push(`/edit-trip?tripId=${trip.id}`);
  };

  const TestCard = ({ item }: { item: Trip }) => {
    console.log('TestCard rendering for:', item.id, item.location);
    return (
      <View style={{
        backgroundColor: 'white',
        padding: 16,
        marginBottom: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ccc'
      }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.location}</Text>
        <Text style={{ fontSize: 14, color: '#666' }}>Test Card - ID: {item.id}</Text>
        <TouchableOpacity 
          style={{
            backgroundColor: '#007AFF',
            padding: 8,
            borderRadius: 4,
            marginTop: 8
          }}
          onPress={() => console.log('Test button pressed for:', item.id)}
        >
          <Text style={{ color: 'white', textAlign: 'center' }}>Test Button</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderTripCard = ({ item }: { item: Trip }) => {
    console.log('renderTripCard called for item:', item.id, item.location);
    return (
      <TripCard 
        trip={item} 
        onDelete={deleteTrip} 
        onEdit={handleEditTrip} 
      />
    );
  };

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
    paddingHorizontal: theme.spacing.md,
    gap: theme.spacing.md,
    paddingBottom: theme.spacing.lg,
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