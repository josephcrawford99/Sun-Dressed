import { ActivityIndicator, Alert, ScrollView, StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedBackground } from '@/components/themed-background';
import { ThemedButton } from '@/components/button';
import { ThemedDestructiveButton } from '@/components/destructive-button';
import { ThemedCard } from '@/components/card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { PackingItemCard } from '@/components/packing-item-card';
import { ScreenHeader } from '@/components/screen-header';
import { Section } from '@/components/section';
import { CATEGORY_ORDER, CATEGORY_LABELS, ClothingCategory } from '@/constants/clothing-items';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useTripPlan } from '@/hooks/use-trip-plan';
import { useStore } from '@/store/store';
import { PackingItem, getTripStatus } from '@/types/trip';

function groupByCategory(items: PackingItem[]): Map<ClothingCategory, PackingItem[]> {
  const grouped = new Map<ClothingCategory, PackingItem[]>();
  for (const item of items) {
    const list = grouped.get(item.category) ?? [];
    list.push(item);
    grouped.set(item.category, list);
  }
  return grouped;
}

function formatDateRange(start: Date, end: Date): string {
  const opts: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric', year: 'numeric' };
  const startStr = start.toLocaleDateString('en-US', opts);
  const endStr = end.toLocaleDateString('en-US', opts);
  return `${startStr} – ${endStr}`;
}

export default function TripDetailScreen() {
  const router = useRouter();
  const { tripId } = useLocalSearchParams<{ tripId: string }>();
  const insets = useSafeAreaInsets();
  const trip = useStore((state) => state.trips.find((t) => t.id === tripId));
  const deleteTrip = useStore((state) => state.deleteTrip);
  const { data: plan, isFetching, error } = useTripPlan(tripId);
  const tintColor = useThemeColor({}, 'tint');

  const confirmDelete = () => {
    Alert.alert(
      'Delete Trip',
      `Delete your trip to ${trip?.destination}? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteTrip(tripId!);
            router.back();
          },
        },
      ],
    );
  };

  if (!trip) {
    return (
      <ThemedBackground style={styles.container}>
        <ThemedView style={styles.content}>
          <ThemedText>Trip not found.</ThemedText>
        </ThemedView>
      </ThemedBackground>
    );
  }

  const grouped = plan ? groupByCategory(plan.packingList) : null;

  return (
    <ThemedBackground style={styles.container}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: insets.bottom }}
        stickyHeaderIndices={[0]}
      >
        <ScreenHeader title="Trip Details" showBack showSettings={false} />
        <ThemedView style={styles.content}>
          <ThemedText type="title" style={styles.destination}>
            {trip.destination}
          </ThemedText>
          <ThemedText style={styles.dateRange}>
            {formatDateRange(trip.startDate, trip.endDate)}
          </ThemedText>
          {trip.activities ? (
            <ThemedText style={styles.activities}>{trip.activities}</ThemedText>
          ) : null}

          {error && (
            <ThemedCard variant="error" style={styles.errorCard}>
              <ThemedText style={styles.errorText}>
                Failed to generate packing plan: {error.message}
              </ThemedText>
            </ThemedCard>
          )}

          {isFetching && (
            <ThemedView style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={tintColor} />
              <ThemedText style={styles.loadingText}>
                Generating your packing plan...
              </ThemedText>
            </ThemedView>
          )}

          {plan && (
            <>
              {/* Weather Tags */}
              <View style={styles.tagsRow}>
                {plan.weatherTags.map((tag) => (
                  <ThemedCard key={tag} variant="warning" style={styles.weatherTag}>
                    <ThemedText style={styles.weatherTagText}>{tag}</ThemedText>
                  </ThemedCard>
                ))}
              </View>

              {/* Packing List grouped by category */}
              {CATEGORY_ORDER.map((category) => {
                const items = grouped?.get(category);
                if (!items?.length) return null;
                return (
                  <Section key={category} title={CATEGORY_LABELS[category]}>
                    <ThemedView style={styles.itemsContainer}>
                      {items.map((item) => (
                        <PackingItemCard key={item.iconName} item={item} />
                      ))}
                    </ThemedView>
                  </Section>
                );
              })}

              {/* Packing Summary */}
              <ThemedCard variant="info" style={styles.summaryCard}>
                <ThemedText style={styles.summaryText}>
                  {plan.packingSummary}
                </ThemedText>
              </ThemedCard>
            </>
          )}

          {trip && getTripStatus(trip) !== 'past' && (
            <ThemedButton
              onPress={() => router.push({ pathname: '/trip-edit', params: { tripId } })}
              style={styles.editButton}
            >
              Edit Trip
            </ThemedButton>
          )}

          <ThemedDestructiveButton onPress={confirmDelete} style={styles.deleteButton}>
            Delete Trip
          </ThemedDestructiveButton>
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
  destination: {
    paddingVertical: 8
  },
  dateRange: {
    fontSize: 15,
    opacity: 0.7,
    marginBottom: 4,
  },
  activities: {
    fontSize: 14,
    opacity: 0.5,
    fontStyle: 'italic',
    marginBottom: 8,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
    marginTop: 12,
  },
  weatherTag: {
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  weatherTagText: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  errorCard: {
    marginTop: 20,
  },
  errorText: {
    color: '#ff6b6b',
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: 40,
    gap: 12,
  },
  loadingText: {
    opacity: 0.6,
  },
  itemsContainer: {
    gap: 12,
  },
  summaryCard: {
    marginTop: 10,
    marginBottom: 10,
  },
  summaryText: {
    fontSize: 15,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  editButton: {
    marginTop: 10,
  },
  deleteButton: {
    marginTop: 10,
  },
});
