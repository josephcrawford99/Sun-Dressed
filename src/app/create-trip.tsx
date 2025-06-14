import LocationAutocomplete from '@/components/LocationAutocomplete';
import { Button } from '@/components/ui/Button';
import { Trip } from '@/types/trip';
import { useTrips } from '@hooks/useTrips';
import { theme } from '@styles/theme';
import { typography } from '@styles/typography';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Alert, Platform, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DateTimePicker, { DateType, useDefaultStyles } from 'react-native-ui-datepicker';

export default function CreateTripModal() {
  const insets = useSafeAreaInsets();
  const defaultStyles = useDefaultStyles();
  const [location, setLocation] = useState('');
  const [dateRange, setDateRange] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({
    startDate: null,
    endDate: null,
  });
  const [saving, setSaving] = useState(false);
  const { addTrip } = useTrips();

  console.log('CreateTripModal - Current state:', {
    location,
    dateRange,
    saving
  });

  const handleSaveTrip = async () => {
    console.log('handleSaveTrip called with:', {
      location: location.trim(),
      dateRange
    });

    // Validation
    if (!location.trim()) {
      console.log('Validation failed: Missing location');
      setTimeout(() => {
        Alert.alert('Missing Location', 'Please enter a destination for your trip.');
      }, 100);
      return;
    }

    if (!dateRange.startDate || !dateRange.endDate) {
      console.log('Validation failed: Missing date range');
      setTimeout(() => {
        Alert.alert('Missing Dates', 'Please select both start and end dates for your trip.');
      }, 100);
      return;
    }

    const startDate = dateRange.startDate;
    const endDate = dateRange.endDate;

    if (endDate <= startDate) {
      console.log('Validation failed: Invalid dates');
      setTimeout(() => {
        Alert.alert('Invalid Dates', 'End date must be after start date.');
      }, 100);
      return;
    }

    try {
      setSaving(true);
      console.log('Creating new trip...');
      
      const newTrip: Trip = {
        id: Date.now().toString(),
        location: location.trim(),
        startDate,
        endDate,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      console.log('Adding trip:', newTrip);
      await addTrip(newTrip);
      console.log('Trip saved successfully');
      
      router.back();
    } catch (error) {
      console.error('Error saving trip:', error);
      setTimeout(() => {
        Alert.alert('Error', 'Failed to save trip. Please try again.');
      }, 100);
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>

      <View style={[styles.content, { paddingTop: Platform.OS === 'ios' ? insets.top + 20 : 40 }]}>
        <Text style={styles.title}>Create Trip</Text>
        
        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Location</Text>
            <LocationAutocomplete
              initialValue={location}
              onLocationSelect={(locationString) => {
                console.log('📍 Location selected:', locationString);
                setLocation(locationString);
              }}
              placeholder="Enter destination"
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
                  console.log('DateTimePicker onChange called with:', { startDate, endDate });
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
            title={saving ? 'Saving...' : 'Save Trip'}
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
  container: {
    flex: 1,
    justifyContent: 'flex-end',
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