import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Keyboard,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { searchLocations, LocationSuggestion, formatLocation, formatDistance, getNearestCity } from '../services/locationService';
import { getFrequentLocations, addFrequentLocation } from '../utils/storage';
import { useLocation } from '../utils/useLocation';
import { useSettings } from '../utils/SettingsContext';
import { debounce } from 'lodash';
import { typography } from '../styles/typography';

interface LocationInputProps {
  value: string;
  onLocationSelect: (location: string) => void;
  onPinPress?: () => void;
}

export const LocationInput: React.FC<LocationInputProps> = ({
  value,
  onLocationSelect,
  onPinPress,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [frequentLocations, setFrequentLocations] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { location: userLocation, error: locationError } = useLocation();
  const { windSpeedUnit } = useSettings();

  // Load frequent locations on mount
  useEffect(() => {
    const loadFrequentLocations = async () => {
      const locations = await getFrequentLocations();
      setFrequentLocations(locations);
    };
    loadFrequentLocations();
  }, []);

  // Cleanup function for search state
  const cleanupSearch = () => {
    setSearchQuery('');
    setIsEditing(false);
    setSuggestions([]);
    setError(null);
    setIsLoading(false);
  };

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      if (!query.trim()) {
        setSuggestions([]);
        setIsLoading(false);
        return;
      }

      try {
        const results = await searchLocations(query, userLocation);
        setSuggestions(results);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 300),
    [userLocation]
  );

  // Handle search input changes
  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    setError(null);
    setIsLoading(true);
    debouncedSearch(text);
  };

  // Handle location selection
  const handleLocationSelect = async (location: LocationSuggestion | string) => {
    let formattedLocation: string;

    if (typeof location === 'string') {
      formattedLocation = location;
    } else {
      formattedLocation = formatLocation(location);
      await addFrequentLocation(formattedLocation);
      const locations = await getFrequentLocations();
      setFrequentLocations(locations);
    }

    cleanupSearch();
    Keyboard.dismiss();
    onLocationSelect(formattedLocation);
  };

  const handleFocus = () => {
    setIsEditing(true);
    setSearchQuery('');
  };

  const handleBlur = () => {
    // Use setTimeout to allow tap events on suggestions to fire before closing
    setTimeout(() => {
      if (isEditing) {
        cleanupSearch();
      }
    }, 200);
  };

  const handleCurrentLocation = async () => {
    if (!userLocation) {
      Alert.alert(
        'Location Unavailable',
        locationError || 'Please enable location services to use this feature.'
      );
      return;
    }

    try {
      setIsLoading(true);
      const nearestCity = await getNearestCity(userLocation.latitude, userLocation.longitude);
      const formattedLocation = formatLocation(nearestCity);
      await addFrequentLocation(formattedLocation);
      onLocationSelect(formattedLocation);
    } catch (err) {
      Alert.alert(
        'Error',
        err instanceof Error ? err.message : 'Failed to get your current location'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.inputContainer, isEditing && styles.inputContainerActive]}>
        <Ionicons name="location-outline" size={16} color="#757575" style={styles.icon} />
        {isEditing ? (
          <TextInput
            style={[typography.body, styles.input]}
            value={searchQuery}
            onChangeText={handleSearchChange}
            placeholder="Search for a city..."
            autoFocus
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        ) : (
          <TouchableOpacity style={styles.displayContainer} onPress={() => setIsEditing(true)}>
            <Text style={typography.body} numberOfLines={1}>
              {value}
            </Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={handleCurrentLocation}
          style={styles.pinButton}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#757575" />
          ) : (
            <Ionicons name="navigate" size={16} color="#757575" />
          )}
        </TouchableOpacity>
      </View>

      {isEditing && (suggestions.length > 0 || frequentLocations.length > 0 || isLoading || error) && (
        <View style={styles.dropdown}>
          <ScrollView keyboardShouldPersistTaps="handled" style={styles.scrollView}>
            {isLoading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#000" />
              </View>
            )}

            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {!isLoading && !error && suggestions.length === 0 && frequentLocations.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>Recent Locations</Text>
                {frequentLocations.map((location, index) => (
                  <TouchableOpacity
                    key={`${location}-${index}`}
                    style={styles.suggestion}
                    onPress={() => handleLocationSelect(location)}
                  >
                    <Ionicons name="time-outline" size={16} color="#757575" style={styles.suggestionIcon} />
                    <Text style={typography.body}>{location}</Text>
                  </TouchableOpacity>
                ))}
              </>
            )}

            {suggestions.map((suggestion, index) => (
              <TouchableOpacity
                key={`${suggestion.name}-${index}`}
                style={styles.suggestion}
                onPress={() => handleLocationSelect(suggestion)}
              >
                <View style={styles.suggestionContent}>
                  <View style={styles.suggestionMain}>
                    <Ionicons name="location-outline" size={16} color="#757575" style={styles.suggestionIcon} />
                    <Text style={typography.body}>
                      {suggestion.name}
                      {suggestion.state && `, ${suggestion.state}`}
                      {suggestion.country && `, ${suggestion.country}`}
                    </Text>
                  </View>
                  {suggestion.distance !== undefined && (
                    <Text style={styles.distanceText}>
                      {formatDistance(suggestion.distance, windSpeedUnit === 'mph')}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 1,
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderColor: '#757575',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 36,
  },
  inputContainerActive: {
    borderWidth: 2,
    borderColor: '#000',
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    padding: 0,
  },
  displayContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  pinButton: {
    padding: 4,
  },
  dropdown: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    maxHeight: 200,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scrollView: {
    padding: 8,
  },
  suggestion: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  suggestionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  suggestionMain: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  suggestionIcon: {
    marginRight: 8,
  },
  distanceText: {
    ...typography.caption,
    color: '#757575',
    fontSize: 12,
  },
  loadingContainer: {
    padding: 16,
    alignItems: 'center',
  },
  errorContainer: {
    padding: 16,
  },
  errorText: {
    color: '#E53935',
    ...typography.caption,
  },
  sectionTitle: {
    ...typography.caption,
    color: '#757575',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
});
