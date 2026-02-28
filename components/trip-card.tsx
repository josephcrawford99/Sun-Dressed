import { Pressable, StyleSheet } from 'react-native';

import { ThemedCard } from '@/components/card';
import { ThemedText } from '@/components/themed-text';
import { Trip } from '@/types/trip';

export type TripCardProps = {
  trip: Trip;
  onPress: () => void;
};

function formatDateRange(start: Date, end: Date): string {
  const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
  const startStr = start.toLocaleDateString('en-US', opts);
  const endStr = end.toLocaleDateString('en-US', opts);
  return `${startStr} – ${endStr}`;
}

export function TripCard({ trip, onPress }: TripCardProps) {
  const isPast = trip.endDate < new Date(new Date().setHours(0, 0, 0, 0));

  return (
    <Pressable onPress={onPress}>
      <ThemedCard
        variant="default"
        style={[styles.card, isPast && styles.pastCard]}
        icon={{ type: 'MaterialIcons', name: 'luggage' }}
      >
        <ThemedText type="subtitle" style={styles.destination}>
          {trip.destination}
        </ThemedText>
        <ThemedText style={styles.dateRange}>
          {formatDateRange(trip.startDate, trip.endDate)}
        </ThemedText>
        {trip.plan ? (
          <ThemedText style={styles.meta}>
            {trip.plan.packingList.length} items packed
          </ThemedText>
        ) : (
          <ThemedText style={styles.meta}>Plan pending...</ThemedText>
        )}
      </ThemedCard>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
  },
  pastCard: {
    opacity: 0.5,
  },
  destination: {
    marginBottom: 4,
  },
  dateRange: {
    fontSize: 14,
    opacity: 0.7,
  },
  meta: {
    fontSize: 13,
    opacity: 0.5,
    marginTop: 4,
  },
});
