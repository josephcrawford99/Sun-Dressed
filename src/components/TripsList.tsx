import React from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';

import { TripCard } from '@components/TripCard';
import { theme, typography } from '@styles';
import { Trip } from '@/types/trip';

interface TripsListProps {
  trips: Trip[];
  loading?: boolean;
  onDelete: (tripId: string) => Promise<void>;
  onEdit: (trip: Trip) => void;
  onViewPackingList: (trip: Trip) => void;
}

export const TripsList: React.FC<TripsListProps> = ({
  trips,
  loading = false,
  onDelete,
  onEdit,
  onViewPackingList,
}) => {
  const renderTripCard = ({ item }: { item: Trip }) => {
    return (
      <TripCard 
        trip={item} 
        onDelete={onDelete} 
        onEdit={onEdit}
        onViewPackingList={onViewPackingList}
      />
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.placeholderText}>Try adding a trip!</Text>
    </View>
  );

  const renderLoadingState = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={theme.colors.black} />
      <Text style={styles.loadingText}>Loading trips...</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.listContainer, styles.emptyState]}>
        {renderLoadingState()}
      </View>
    );
  }

  return (
    <FlatList
      data={trips}
      renderItem={renderTripCard}
      keyExtractor={(item) => item.id}
      contentContainerStyle={[styles.listContainer, trips.length === 0 && styles.emptyState]}
      ListEmptyComponent={renderEmptyState}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
    gap: theme.spacing.md,
    paddingBottom: theme.spacing.lg,
    flexGrow: 1,
  },
  emptyState: {
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
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  loadingText: {
    ...typography.placeholderText,
    color: theme.colors.gray,
    textAlign: 'center',
  },
});