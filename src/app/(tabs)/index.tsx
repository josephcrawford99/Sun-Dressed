import BentoBox from '@components/BentoBox';
import LocationAutocomplete from '@components/LocationAutocomplete';
import { theme, typography } from '@styles';
import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator
} from 'react-native';

export default function HomeScreen() {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.greetingRow}>
        <View>
          <Text style={typography.label}>greeting,</Text>
          <Text style={styles.name}>Name!</Text>
        </View>
      </View>

      <View style={styles.locationRow}>
        <LocationAutocomplete
          initialValue="Blue Jean, MO"
          onLocationSelect={(data, details) => {
            console.log('📍 Location selected:', { data, details });
            if (details?.formatted_address) {
              setSelectedLocation(details.formatted_address);
            } else if (data?.description) {
              setSelectedLocation(data.description);
            }
          }}
          placeholder="Enter location"
        />
        <TouchableOpacity style={styles.weatherButton}>
          <Text style={styles.weatherButtonText}>--°</Text>
        </TouchableOpacity>
      </View>
      
      {selectedLocation && (
        <View style={styles.debugContainer}>
          <Text style={styles.debugText}>Selected: {selectedLocation}</Text>
        </View>
      )}

      <ScrollView
        style={styles.mainContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <BentoBox />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  greetingRow: {
    marginHorizontal: theme.spacing.md,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  name: {
    ...typography.heading,
    fontStyle: 'italic',
    marginTop: -4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
    marginBottom: 0,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.lightGray,
  },
  weatherButton: {
    marginLeft: theme.spacing.sm,
    backgroundColor: theme.colors.black,
    borderRadius: theme.borderRadius.medium,
    paddingHorizontal: theme.spacing.sm,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 90,
  },
  weatherButtonText: {
    ...typography.tempButton,
  },
  mainContainer: {
    flex: 1,
    marginHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.large,
  },
  scrollContent: {
    padding: theme.spacing.lg,
    minHeight: 400,
  },
  contentPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  debugContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.sm,
  },
  debugText: {
    ...typography.body,
    fontSize: theme.fontSize.sm,
    color: theme.colors.black,
    textAlign: 'center',
  },
});
