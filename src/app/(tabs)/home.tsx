import BentoBox from '@components/BentoBox';
import LocationAutocomplete from '@components/LocationAutocomplete';
import { useWeather } from '@hooks/useWeather';
import { theme, typography } from '@styles';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

export default function HomeScreen() {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const { weather, isLoading, currentTemp, fetchWeatherByCoordinates } = useWeather();

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
            
            // Extract location name for display
            const locationName = details?.formatted_address || data?.description || '';
            setSelectedLocation(locationName);
            
            // Extract coordinates and fetch weather
            const coordinates = details?.geometry?.location;
            if (coordinates && locationName) {
              console.log('🌤️ Fetching weather for coordinates:', { 
                lat: coordinates.lat, 
                lng: coordinates.lng, 
                location: locationName 
              });
              
              fetchWeatherByCoordinates(coordinates.lat, coordinates.lng, locationName);
            } else {
              console.warn('❌ No coordinates found in location selection');
            }
          }}
          placeholder="Enter location"
        />
        <TouchableOpacity style={styles.weatherButton}>
          {isLoading ? (
            <ActivityIndicator size="small" color={theme.colors.white} />
          ) : (
            <Text style={styles.weatherButtonText}>
              {currentTemp ? `${currentTemp}°` : '--°'}
            </Text>
          )}
        </TouchableOpacity>
      </View>

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
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 90,
  },
  weatherButtonText: {
    ...typography.tempButton,
    alignSelf: 'center',
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
