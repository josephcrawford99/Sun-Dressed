import React, { useMemo } from 'react';
import { View, TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import LocationAutocomplete from '@components/LocationAutocomplete';
import { getIoniconForWeather } from '@services/weatherIconService';
import { theme, typography } from '@styles';
import { WeatherDisplay } from '@/types/weather';

interface LocationWeatherBarProps {
  lastLocation: string;
  weatherDisplay: WeatherDisplay | null;
  isWeatherLoading: boolean;
  onLocationSelect: (locationString: string, coordinates?: { lat: number; lon: number }) => Promise<void>;
  onWeatherButtonPress: () => void;
}

export const LocationWeatherBar: React.FC<LocationWeatherBarProps> = ({
  lastLocation,
  weatherDisplay,
  isWeatherLoading,
  onLocationSelect,
  onWeatherButtonPress,
}) => {
  // Get current temperature from weatherDisplay (already in user's preferred unit)
  const currentTemp = weatherDisplay?.displayTemp.current || '--°';

  // Memoize LocationAutocomplete props to prevent unnecessary re-renders
  const locationAutocompleteProps = useMemo(() => ({
    initialValue: lastLocation,
    onLocationSelect,
    placeholder: "Enter location"
  }), [lastLocation, onLocationSelect]);

  return (
    <View style={styles.locationRow}>
      <LocationAutocomplete
        {...locationAutocompleteProps}
      />
      <TouchableOpacity style={styles.weatherButton} onPress={onWeatherButtonPress}>
        {isWeatherLoading ? (
          <ActivityIndicator size="small" color={theme.colors.white} />
        ) : (
          <View style={styles.weatherButtonContent}>
            <Ionicons
              name={getIoniconForWeather(weatherDisplay?.icon)}
              size={20}
              color={theme.colors.white}
              style={styles.weatherIcon}
            />
            <Text style={styles.weatherButtonText}>
              {currentTemp}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
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
  weatherButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  weatherIcon: {
    marginRight: theme.spacing.xs,
  },
  weatherButtonText: {
    ...typography.tempButton,
    alignSelf: 'center',
  },
});