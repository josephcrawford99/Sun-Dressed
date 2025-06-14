import { theme, typography } from '@styles';
import React, { useRef, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

interface LocationAutocompleteProps {
  initialValue?: string;
  onLocationSelect: (locationString: string) => void;
  onTextChange?: (text: string) => void;
  placeholder?: string;
}

export default function LocationAutocomplete({
  initialValue,
  onLocationSelect,
  onTextChange,
  placeholder = "Enter location"
}: LocationAutocompleteProps) {
  const apiKey = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY;
  const ref = useRef<any>();
  
  console.log('🏗️ LocationAutocomplete render:', { 
    initialValue, 
    apiKey: apiKey ? `EXISTS (${apiKey.substring(0, 8)}...)` : 'MISSING' 
  });

  // Set initial value using ref after component mounts
  useEffect(() => {
    if (initialValue && ref.current) {
      setTimeout(() => {
        ref.current?.setAddressText(initialValue);
      }, 100);
    }
  }, [initialValue]);

  return (
    <GooglePlacesAutocomplete
      ref={ref}
      placeholder={placeholder}
      onPress={(data, details) => {
        console.log('🎯 GooglePlacesAutocomplete onPress:', { data, details });
        const locationString = details?.formatted_address || data?.description || '';
        console.log('📍 Emitting location string:', locationString);
        onLocationSelect(locationString);
      }}
      textInputProps={{
        onChangeText: (text) => {
          console.log('⌨️ GooglePlacesAutocomplete onChangeText:', text);
          onTextChange?.(text);
        },
        style: styles.textInput,
        placeholderTextColor: theme.colors.gray,
      }}
      query={{
        key: apiKey,
        language: 'en',
        types: '(cities)',
        components: 'country:us',
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
      renderDescription={(row) => row.description}
      predefinedPlaces={[]}
      currentLocation={false}
      suppressDefaultStyles={true}
      onFail={(error) => {
        console.error('❌ GooglePlacesAutocomplete error:', error);
      }}
      onNotFound={() => {
        console.log('🔍 GooglePlacesAutocomplete no results found');
      }}
    />
  );
}

const styles = StyleSheet.create({
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
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
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
});