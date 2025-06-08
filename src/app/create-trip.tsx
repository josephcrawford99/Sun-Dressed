import { useTrips } from '@/hooks/useTrips';
import { theme } from '@/styles/theme';
import { typography } from '@/styles/typography';
import { Trip } from '@/types/trip';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Alert, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DateTimePicker, { useDefaultStyles } from 'react-native-ui-datepicker';

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
    <View style={styles.container}>
      <View style={[styles.content, { paddingTop: Platform.OS === 'ios' ? insets.top + 20 : 40 }]}>
        <Text style={styles.title}>Create Trip</Text>
        
        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Location</Text>
            <TextInput
              style={styles.textInput}
              value={location}
              onChangeText={setLocation}
              placeholder="Enter destination"
              placeholderTextColor={theme.colors.gray}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Trip Dates</Text>
            <View style={styles.datePickerContainer}>
              <DateTimePicker
                mode="range"
                startDate={dateRange.startDate}
                endDate={dateRange.endDate}
                onChange={({ startDate, endDate }: { startDate?: Date; endDate?: Date }) => {
                  console.log('DateTimePicker onChange called with:', { startDate, endDate });
                  setDateRange({ 
                    startDate: startDate || null, 
                    endDate: endDate || null 
                  });
                }}
                styles={defaultStyles}
                selectedItemColor={theme.colors.black}
                selectedTextStyle={{
                  fontWeight: '600',
                  color: theme.colors.white,
                }}
                todayContainerStyle={{
                  borderWidth: 1,
                }}
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

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.saveButton, saving && styles.saveButtonDisabled]}
            onPress={handleSaveTrip}
            disabled={saving}
          >
            <Text style={styles.saveButtonText}>
              {saving ? 'Saving...' : 'Save Trip'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
  },
  title: {
    ...typography.heading,
    fontSize: 28,
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
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.black,
  },
  textInput: {
    borderWidth: 1,
    borderColor: theme.colors.gray,
    borderRadius: 8,
    padding: theme.spacing.md,
    fontSize: 16,
    backgroundColor: theme.colors.white,
  },
  buttonContainer: {
    paddingBottom: theme.spacing.lg,
  },
  saveButton: {
    backgroundColor: theme.colors.black,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: theme.colors.gray,
  },
  saveButtonText: {
    ...typography.body,
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.white,
  },
  datePickerContainer: {
    backgroundColor: theme.colors.white,
    borderRadius: 8,
    padding: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.gray,
  },
  dateDisplay: {
    padding: theme.spacing.sm,
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
    marginTop: theme.spacing.xs,
  },
  dateDisplayText: {
    ...typography.body,
    fontSize: 14,
    color: theme.colors.black,
    textAlign: 'center',
  },
});