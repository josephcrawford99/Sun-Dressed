import LocationAutocomplete from '@/components/LocationAutocomplete';
import { Button } from '@/components/ui/Button';
import { useTrips } from '@/hooks/useTrips';
import { Trip } from '@/types/trip';
import { theme } from '@styles/theme';
import { typography } from '@styles/typography';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Alert, Platform, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DateTimePicker, { DateType, useDefaultStyles } from 'react-native-ui-datepicker';

export default function EditTripModal() {
  const insets = useSafeAreaInsets();
  const defaultStyles = useDefaultStyles();
  const { mode, tripId } = useLocalSearchParams<{ mode: 'create' | 'edit'; tripId?: string }>();
  const [location, setLocation] = useState('');
  const [dateRange, setDateRange] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({
    startDate: null,
    endDate: null,
  });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const { trips, addTrip, updateTrip } = useTrips();
  
  const isEditMode = mode === 'edit';
  const title = isEditMode ? 'Edit Trip' : 'Create Trip';
  const buttonText = isEditMode ? 'Update Trip' : 'Save Trip';
  const loadingText = isEditMode ? 'Updating...' : 'Saving...';

  // Load trip data when component mounts (only in edit mode)
  useEffect(() => {
    if (isEditMode && tripId && trips.length > 0) {
      const tripToEdit = trips.find(trip => trip.id === tripId);
      if (tripToEdit) {
        setLocation(tripToEdit.location);
        setDateRange({
          startDate: tripToEdit.startDate as Date,
          endDate: tripToEdit.endDate as Date,
        });
        setLoading(false);
      } else {
        // Trip not found
        Alert.alert('Error', 'Trip not found');
        router.back();
      }
    } else if (!isEditMode) {
      // In create mode, no loading needed - start with empty form
      setLoading(false);
    }
  }, [isEditMode, tripId, trips]);

  const handleSaveTrip = async () => {
    // Validation
    if (!location.trim()) {
      setTimeout(() => {
        Alert.alert('Missing Location', 'Please enter a destination for your trip.');
      }, 100);
      return;
    }

    if (!dateRange.startDate || !dateRange.endDate) {
      setTimeout(() => {
        Alert.alert('Missing Dates', 'Please select both start and end dates for your trip.');
      }, 100);
      return;
    }

    const startDate = dateRange.startDate;
    const endDate = dateRange.endDate;

    if (endDate <= startDate) {
      setTimeout(() => {
        Alert.alert('Invalid Dates', 'End date must be after start date.');
      }, 100);
      return;
    }

    try {
      setSaving(true);
      
      if (isEditMode) {
        // Edit mode: update existing trip
        const originalTrip = trips.find(trip => trip.id === tripId);
        if (!originalTrip) {
          throw new Error('Original trip not found');
        }

        const updatedTrip: Trip = {
          ...originalTrip,
          location: location.trim(),
          startDate,
          endDate,
          updatedAt: new Date(),
        };

        await updateTrip(updatedTrip);
      } else {
        // Create mode: add new trip
        const newTrip: Trip = {
          id: Date.now().toString(),
          location: location.trim(),
          startDate,
          endDate,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        await addTrip(newTrip);
      }
      
      router.back();
    } catch {
      // Error saving/updating trip
      setTimeout(() => {
        Alert.alert('Error', `Failed to ${isEditMode ? 'update' : 'save'} trip. Please try again.`);
      }, 100);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.content, { paddingTop: Platform.OS === 'ios' ? insets.top + 20 : 40 }]}>
          <Text style={styles.title}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>

      <View style={[styles.content, { paddingTop: Platform.OS === 'ios' ? insets.top + 20 : 40 }]}>
        <Text style={styles.title}>{title}</Text>
        
        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Location</Text>
            <LocationAutocomplete
              initialValue={location}
              onLocationSelect={(locationString) => {
                setLocation(locationString);
              }}
              placeholder="Enter destination"
              showLocationPin={false}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Trip Dates</Text>
            <View style={styles.datePickerContainer}>
              <DateTimePicker
                mode="range"
                startDate={dateRange.startDate as DateType}
                endDate={dateRange.endDate as DateType}
                onChange={({ startDate, endDate }: { startDate: DateType; endDate: DateType }) => {
                  setDateRange({ 
                    startDate: startDate as Date, 
                    endDate: endDate as Date 
                  });
                }}
                styles={defaultStyles}
              />
            </View>
            <View style={styles.dateDisplay}>
              <Text style={styles.dateDisplayText}>
                {dateRange.startDate && dateRange.endDate
                  ? `Selected: ${dateRange.startDate.toLocaleDateString()} - ${dateRange.endDate.toLocaleDateString()}`
                  : 'Please select your trip dates'}
              </Text>
            </View>
          </View>
        </View>
        

        <View style={[styles.buttonContainer, { marginBottom: insets.bottom + theme.spacing.xl }]}>
          <Button
            title={saving ? loadingText : buttonText}
            onPress={handleSaveTrip}
            disabled={saving}
            loading={saving}
            variant="primary"
            size="medium"
          />
        </View>
      </View>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
  },
  title: {
    ...typography.heading,
    fontSize: theme.fontSize.xxxl,
    color: theme.colors.black,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  formContainer: {
    flex: 1,
    gap: theme.spacing.lg,
  },
  inputGroup: {
    gap: theme.spacing.sm,
  },
  label: {
    ...typography.body,
    fontSize: theme.fontSize.md,
    fontWeight: '600',
    color: theme.colors.black,
  },
  buttonContainer: {
    marginHorizontal: theme.spacing.sm,
    marginBottom: theme.spacing.xl,
  },
  datePickerContainer: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.gray,
  },
  dateDisplay: {
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.small,
    marginTop: theme.spacing.xs,
  },
  dateDisplayText: {
    ...typography.body,
    fontSize: theme.fontSize.sm,
    color: theme.colors.black,
    textAlign: 'center',
  },
});