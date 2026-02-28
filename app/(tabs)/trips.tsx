import { useMemo } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

import { ScreenHeader } from '@/components/screen-header';
import { ThemedBackground } from '@/components/themed-background';
import { ThemedButton } from '@/components/button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { TripCard } from '@/components/trip-card';
import { useStore } from '@/store/store';
import { Trip } from '@/types/trip';

function sortTrips(trips: Trip[]): { upcoming: Trip[]; past: Trip[] } {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcoming = trips
    .filter((t) => t.endDate >= today)
    .sort((a, b) => a.startDate.getTime() - b.startDate.getTime());

  const past = trips
    .filter((t) => t.endDate < today)
    .sort((a, b) => b.endDate.getTime() - a.endDate.getTime());

  return { upcoming, past };
}

export default function TripsScreen() {
  const router = useRouter();
  const trips = useStore((state) => state.trips);

  const handleNewTrip = () => {
    router.push('/trip-edit');
  };

  const { upcoming, past } = useMemo(() => sortTrips(trips), [trips]);

  const isEmpty = trips.length === 0;

  return (
    <ThemedBackground style={styles.container}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        stickyHeaderIndices={[0]}
      >
        <ScreenHeader title="Trips" />
        <ThemedView style={styles.content}>
          {isEmpty ? (
            <ThemedView style={styles.emptyState}>
              <ThemedText style={styles.emptyText}>No trips planned yet</ThemedText>
              <ThemedButton onPress={handleNewTrip}>
                Plan a Trip
              </ThemedButton>
            </ThemedView>
          ) : (
            <>
              {upcoming.map((trip) => (
                <TripCard
                  key={trip.id}
                  trip={trip}
                  onPress={() => router.push({ pathname: '/trip-detail', params: { tripId: trip.id } })}
                />
              ))}

              {past.length > 0 && (
                <>
                  <ThemedText style={styles.separator}>Past Trips</ThemedText>
                  {past.map((trip) => (
                    <TripCard
                      key={trip.id}
                      trip={trip}
                      onPress={() => router.push({ pathname: '/trip-detail', params: { tripId: trip.id } })}
                    />
                  ))}
                </>
              )}

              <ThemedButton
                onPress={handleNewTrip}
                style={styles.addButton}
              >
                Plan a New Trip
              </ThemedButton>
            </>
          )}
        </ThemedView>
      </ScrollView>
    </ThemedBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingTop: 15,
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  emptyText: {
    opacity: 0.6,
    fontSize: 16,
  },
  separator: {
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.5,
    marginTop: 10,
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  addButton: {
    marginTop: 10,
  },
});
