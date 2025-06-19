import { Ionicons } from '@expo/vector-icons';
import { useDeviceLocation } from '@hooks/useDeviceLocation';
import { geocodeService } from '@services/geocodeService';
import { theme, typography } from '@styles';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

interface LocationAutocompleteProps {
  initialValue?: string;
  onLocationSelect: (locationString: string, coordinates?: { lat: number; lon: number }) => void;
  onTextChange?: (text: string) => void;
  placeholder?: string;
  showLocationPin?: boolean;
}

const LocationAutocomplete = React.memo(function LocationAutocomplete({
  initialValue,
  onLocationSelect,
  onTextChange,
  placeholder = "Enter location",
  showLocationPin = true
}: LocationAutocompleteProps) {
  const apiKey = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY;
  const ref = useRef<any>(null);
  const { location: deviceLocation, requestLocation, hasPermission } = useDeviceLocation();
  const [isReverseGeocoding, setIsReverseGeocoding] = useState(false);

  // Set initial value using ref after component mounts
  useEffect(() => {
    if (initialValue && ref.current) {
      setTimeout(() => {
        ref.current?.setAddressText(initialValue);
      }, 100);
    }
  }, [initialValue]);

  // Handle device location button press
  const handleDeviceLocationPress = useCallback(async () => {
    if (isReverseGeocoding) return; // Prevent multiple requests
    
    try {
      setIsReverseGeocoding(true);
      
      // Get fresh device location
      await requestLocation();
      
      if (!deviceLocation) {
        // Device location not available
        return;
      }
      
      // Reverse geocode the coordinates using OpenWeather API
      const formattedAddress = await geocodeService.reverseGeocode(
        deviceLocation.latitude, 
        deviceLocation.longitude
      );
      
      // Set the text in the autocomplete field
      if (ref.current) {
        ref.current.setAddressText(formattedAddress);
      }
      
      // Trigger the onLocationSelect callback with both string and coordinates
      onLocationSelect(formattedAddress, {
        lat: deviceLocation.latitude,
        lon: deviceLocation.longitude
      });
      
    } catch {
      // Device location error
      
      // Fallback: use device coordinates with generic name if reverse geocoding fails
      if (deviceLocation) {
        const fallbackLocation = "Current Location";
        if (ref.current) {
          ref.current.setAddressText(fallbackLocation);
        }
        onLocationSelect(fallbackLocation, {
          lat: deviceLocation.latitude,
          lon: deviceLocation.longitude
        });
      }
    } finally {
      setIsReverseGeocoding(false);
    }
  }, [deviceLocation, requestLocation, onLocationSelect, isReverseGeocoding]);

  // Note: Auto-trigger removed to prevent race conditions with location persistence
  // The parent component should handle initial weather fetching based on saved location

  return (
    <View style={styles.inputContainer}>
    <GooglePlacesAutocomplete
      ref={ref}
      placeholder={placeholder}
      onPress={(data, details) => {
        // Use the same formatting logic as renderDescription for consistency
        let locationString = '';
        
        if (data.terms && data.terms.length >= 2) {
          const city = data.terms[0].value;
          const stateOrCountry = data.terms[1].value;
          locationString = `${city}, ${stateOrCountry}`;
        } else {
          // Fallback: parse the description string
          const parts = data.description.split(', ');
          if (parts.length >= 2) {
            locationString = `${parts[0]}, ${parts[1]}`;
          } else {
            locationString = data.description;
          }
        }
        
        // Extract coordinates from Google Places response
        const coordinates = details?.geometry?.location ? {
          lat: details.geometry.location.lat,
          lon: details.geometry.location.lng
        } : undefined;
        
        onLocationSelect(locationString, coordinates);
      }}
      textInputProps={{
        onChangeText: (text) => {
          onTextChange?.(text);
        },
        style: styles.textInput,
        placeholderTextColor: theme.colors.gray,
      }}
      query={{
        key: apiKey,
        language: 'en',
        types: '(cities)',
        // Location biasing - prioritize results near device location or US center
        location: deviceLocation ? 
          `${deviceLocation.latitude},${deviceLocation.longitude}` : 
          '39.8283,-98.5795', // US center fallback
        radius: 50000, // 50km radius for better local biasing
      }}
      fetchDetails={true}
      enablePoweredByContainer={false}
      keepResultsAfterBlur={false}
      keyboardShouldPersistTaps="handled"
      styles={{
        container: styles.container,
        listView: styles.listView,
        row: styles.row,
        description: styles.description,
      }}
      debounce={500}
      minLength={2}
      listViewDisplayed="auto"
      renderDescription={(row) => {
        // Extract only city and state/country from the description
        // e.g. "Washington, D.C., USA" becomes "Washington, DC"
        if (row.terms && row.terms.length >= 2) {
          const city = row.terms[0].value;
          const stateOrCountry = row.terms[1].value;
          return `${city}, ${stateOrCountry}`;
        }
        
        // Fallback: parse the description string
        const parts = row.description.split(', ');
        if (parts.length >= 2) {
          return `${parts[0]}, ${parts[1]}`;
        }
        
        return row.description;
      }}
      predefinedPlaces={[]}
      currentLocation={false}
      suppressDefaultStyles={true}
      onFail={() => {
        // GooglePlacesAutocomplete error
      }}
      onNotFound={() => {
        // No results found - silent handling
      }}
    />
      {showLocationPin && (
        <TouchableOpacity 
          style={[
            styles.locationButton,
            (hasPermission === false || isReverseGeocoding) && styles.locationButtonDisabled
          ]}
          onPress={handleDeviceLocationPress}
          disabled={hasPermission === false || isReverseGeocoding}
        >
          {isReverseGeocoding ? (
            <ActivityIndicator size="small" color={theme.colors.gray} />
          ) : (
            <Ionicons 
              name="location" 
              size={20} 
              color={hasPermission === false ? theme.colors.lightGray : theme.colors.gray} 
            />
          )}
        </TouchableOpacity>
      )}
    </View>
  );
});

export default LocationAutocomplete;

const styles = StyleSheet.create({
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    zIndex: 1000,
  },
  container: {
    flex: 1,
    zIndex: 1000,
  },
  textInput: {
    height: 48,
    borderWidth: 1,
    borderColor: theme.colors.gray,
    borderRadius: theme.borderRadius.medium,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.white,
    ...typography.body,
  },
  listView: {
    position: 'absolute',
    top: 52,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.medium,
    ...theme.shadows.medium,
    maxHeight: 200,
    zIndex: 1001,
    borderWidth: 1,
    borderColor: theme.colors.lightGray,
  },
  row: {
    backgroundColor: theme.colors.white,
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.lightGray,
  },
  description: {
    ...typography.body,
    color: theme.colors.black,
  },
  locationButton: {
    marginLeft: theme.spacing.xs,
    height: 48,
    width: 48,
    borderWidth: 1,
    borderColor: theme.colors.gray,
    borderRadius: theme.borderRadius.medium,
    backgroundColor: theme.colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationButtonDisabled: {
    borderColor: theme.colors.lightGray,
    backgroundColor: theme.colors.lightGray,
  },
});