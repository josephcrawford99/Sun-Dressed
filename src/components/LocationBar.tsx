import React from 'react';
import { 
  View, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../styles/theme';
import { typography, fonts } from '../styles/typography';

interface LocationBarProps {
  value: string;
  onLocationSelect: (location: string) => void;
}

const LocationBar: React.FC<LocationBarProps> = ({
  value,
  onLocationSelect
}) => {
  // For Phase 1, we'll just create a simple UI
  // In later phases, this will be enhanced with autocomplete and functionality
  
  return (
    <View style={styles.container}>
      <Ionicons name="location-outline" size={18} color="#000" style={styles.icon} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={(text) => onLocationSelect(text)}
        placeholder="Enter location"
        placeholderTextColor="#757575"
      />
      <TouchableOpacity 
        style={styles.pinButton}
        onPress={() => {
          // This will be implemented in later phases
          console.log('Get current location');
        }}
      >
        <Ionicons name="navigate-outline" size={18} color="#000" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: theme.borderRadius.medium,
    paddingHorizontal: theme.spacing.sm,
    height: 36,
    flex: 1,
  },
  icon: {
    marginRight: theme.spacing.xs,
  },
  input: {
    flex: 1,
    fontFamily: fonts.secondary,
    fontSize: 14,
    color: theme.colors.black,
    paddingVertical: 0,
  },
  pinButton: {
    padding: theme.spacing.xs,
  }
});

export default LocationBar;