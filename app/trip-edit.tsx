import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from '@/hooks/use-color-scheme';

import { ThemedBackground } from '@/components/themed-background';
import { ThemedButton } from '@/components/button';
import { ThemedText } from '@/components/themed-text';
import { ThemedTextInput } from '@/components/input';
import { ThemedView } from '@/components/themed-view';
import { Section } from '@/components/section';
import { useThemeColor } from '@/hooks/use-theme-color';
import { getTripById, useStore } from '@/store/store';
import { getTripStatus } from '@/types/trip';

export default function TripEditScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const insets = useSafeAreaInsets();
  const { tripId } = useLocalSearchParams<{ tripId: string }>();

  const addTrip = useStore((state) => state.addTrip);
  const updateTrip = useStore((state) => state.updateTrip);

  const tintColor = useThemeColor({}, 'tint');

  const isEditing = !!tripId;
  const trip = isEditing ? getTripById(tripId) : undefined;

  const [destination, setDestination] = useState(trip?.destination ?? '');
  const [startDate, setStartDate] = useState(trip?.startDate ?? new Date());
  const [endDate, setEndDate] = useState(trip?.endDate ?? new Date());
  const [activities, setActivities] = useState(trip?.activities ?? '');

  const status = trip ? getTripStatus(trip) : 'upcoming';

  if (isEditing && !trip) {
    return (
      <ThemedBackground style={styles.container}>
        <ThemedView style={styles.content}>
          <ThemedText>Trip not found.</ThemedText>
        </ThemedView>
      </ThemedBackground>
    );
  }

  if (status === 'past') {
    return (
      <ThemedBackground style={styles.container}>
        <ThemedView style={styles.content}>
          <ThemedText>This trip has ended and can no longer be edited.</ThemedText>
          <Pressable onPress={() => router.back()} style={styles.cancelButton}>
            <ThemedText style={styles.cancelText}>Go Back</ThemedText>
          </Pressable>
        </ThemedView>
      </ThemedBackground>
    );
  }

  const handleStartDateChange = (_: DateTimePickerEvent, date?: Date) => {
    if (!date) return;
    setStartDate(date);
    if (date > endDate) {
      setEndDate(date);
    }
  };

  const handleEndDateChange = (_: DateTimePickerEvent, date?: Date) => {
    if (!date) return;
    setEndDate(date);
  };

  const handleSave = () => {
    const data = {
      destination: destination.trim(),
      startDate,
      endDate,
      activities: activities.trim(),
    };

    if (isEditing) {
      updateTrip(tripId, { ...data, plan: null, planGeneratedAt: null });
      queryClient.removeQueries({ queryKey: ['trip-plan', tripId] });
      router.back();
    } else {
      const newId = addTrip(data);
      router.replace({ pathname: '/trip-detail', params: { tripId: newId } });
    }
  };

  const canSave = destination.trim().length > 0;

  return (
    <ThemedBackground style={styles.container}>
      <Stack.Screen options={{ title: isEditing ? 'Edit Trip' : 'Plan a Trip' }} />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: insets.bottom }}
        keyboardShouldPersistTaps="handled"
      >
        <ThemedView style={styles.content}>
          <Section title="Destination">
            <ThemedTextInput
              value={destination}
              onChangeText={setDestination}
              placeholder="e.g., Paris, Tokyo, New York"
              autoFocus
            />
          </Section>

          <Section title="Start Date">
            <DateTimePicker
              value={startDate}
              mode="date"
              display="inline"
              onChange={handleStartDateChange}
              minimumDate={status === 'ongoing' ? undefined : new Date()}
              accentColor={tintColor}
              themeVariant={useColorScheme()||"dark"}
              style={styles.datePicker}
            />
          </Section>

          <Section title="End Date">
            <DateTimePicker
              value={endDate}
              mode="date"
              display="inline"
              onChange={handleEndDateChange}
              minimumDate={status === 'ongoing' ? new Date() : startDate}
              accentColor={tintColor}
              themeVariant={useColorScheme()||"dark"}
              style={styles.datePicker}
            />
          </Section>

          <Section title="Activities">
            <ThemedTextInput
              value={activities}
              onChangeText={setActivities}
              placeholder="e.g., hiking, museum visits, beach days"
              multiline
              numberOfLines={3}
              style={styles.activitiesInput}
            />
          </Section>

          <ThemedButton onPress={handleSave} disabled={!canSave}>
            Save & Generate Plan
          </ThemedButton>

          <Pressable onPress={() => router.back()} style={styles.cancelButton}>
            <ThemedText style={styles.cancelText}>Cancel</ThemedText>
          </Pressable>
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
  datePicker: {
    alignSelf: 'center',
  },
  activitiesInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  cancelButton: {
    alignItems: 'center',
    marginTop: 15,
  },
  cancelText: {
    opacity: 0.6,
    fontSize: 16,
  },
});
