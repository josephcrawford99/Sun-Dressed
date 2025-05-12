import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, FlatList, TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { typography } from '../styles/typography';
import { Ionicons } from '@expo/vector-icons';

const API_KEY = process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY || '';
const API_URL = 'https://api.openweathermap.org/geo/1.0/direct';

interface LocationSuggestion {
  name: string;
  state?: string;
  country: string;
  lat: number;
  lon: number;
}

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  onSelect: (location: LocationSuggestion) => void;
  placeholder?: string;
  showHomeIcon?: boolean;
  onHomePress?: () => void;
  frequentLocations?: LocationSuggestion[];
}

const LocationAutocomplete: React.FC<Props> = ({ value, onChangeText, onSelect, placeholder, showHomeIcon, onHomePress, frequentLocations = [] }) => {
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!value || value.length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }
    setLoading(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetch(`${API_URL}?q=${encodeURIComponent(value)}&limit=5&appid=${API_KEY}`)
        .then(res => res.json())
        .then((data: any[]) => {
          setSuggestions(
            data.map(item => ({
              name: item.name,
              state: item.state,
              country: item.country,
              lat: item.lat,
              lon: item.lon,
            }))
          );
          setShowDropdown(true);
        })
        .catch(() => setSuggestions([]))
        .finally(() => setLoading(false));
    }, 400);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [value]);

  const handleSelect = (location: LocationSuggestion) => {
    onSelect(location);
    setShowDropdown(false);
  };

  // Merge frequent locations and suggestions, but don't duplicate
  const mergedSuggestions = [
    ...frequentLocations.filter(
      fl => !suggestions.some(s => s.name === fl.name && s.state === fl.state && s.country === fl.country)
    ),
    ...suggestions,
  ];

  return (
    <View style={styles.container}>
      <View style={styles.inputRow}>
        {showHomeIcon && (
          <TouchableOpacity onPress={onHomePress} style={styles.homeIcon}>
            <Ionicons name="home" size={22} color="#757575" />
          </TouchableOpacity>
        )}
        <TextInput
          style={StyleSheet.flatten([typography.body, styles.input, showHomeIcon && { paddingLeft: 40 }])}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder || 'Enter location'}
          placeholderTextColor="#757575"
          onFocus={() => value.length > 1 && setShowDropdown(true)}
          autoCapitalize="words"
        />
        {loading && <ActivityIndicator size="small" color="#000" style={styles.loading} />}
      </View>
      {showDropdown && mergedSuggestions.length > 0 && (
        <View style={styles.dropdown}>
          <FlatList
            data={mergedSuggestions}
            keyExtractor={(_, i) => i.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.suggestion} onPress={() => handleSelect(item)}>
                <Text style={typography.body}>
                  {item.name}
                  {item.state ? `, ${item.state}` : ''}
                  {item.country ? `, ${item.country}` : ''}
                </Text>
              </TouchableOpacity>
            )}
            keyboardShouldPersistTaps="handled"
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: '100%' },
  inputRow: { flexDirection: 'row', alignItems: 'center', position: 'relative' },
  homeIcon: { position: 'absolute', left: 10, zIndex: 2 },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    height: 44,
    paddingHorizontal: 16,
    marginBottom: 0,
    flex: 1,
  },
  loading: { position: 'absolute', right: 16, top: 12 },
  dropdown: {
    position: 'absolute',
    top: 48,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    zIndex: 10,
    maxHeight: 180,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  suggestion: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
});

export default LocationAutocomplete;
