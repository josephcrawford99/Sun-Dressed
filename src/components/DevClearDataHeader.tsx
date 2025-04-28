import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { typography } from '../styles/typography';

const DEV_MODE = true; // Set to false before deployment

const DevClearDataHeader: React.FC = () => {
  if (!DEV_MODE) return null;

  const handleClear = async () => {
    try {
      await AsyncStorage.clear();
      Alert.alert('Data Cleared', 'All user data has been cleared. The app will reload.', [
        {
          text: 'OK',
          onPress: () => {
            if (typeof window !== 'undefined') {
              window.location.reload();
            } else {
              // For native, reload via Expo Updates if available
              try {
                const Updates = require('expo-updates');
                if (Updates.reloadAsync) Updates.reloadAsync();
              } catch {}
            }
          },
        },
      ]);
    } catch (e) {
      Alert.alert('Error', 'Failed to clear AsyncStorage');
    }
  };

  const handleViewData = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const stores = await AsyncStorage.multiGet(keys);
      const data = stores.map(([key, value]) => `${key}: ${value}`).join('\n\n');
      console.log('AsyncStorage data:', data);
      Alert.alert('Stored Data', data || 'No data found');
    } catch (e) {
      Alert.alert('Error', 'Failed to read AsyncStorage');
    }
  };

  return (
    <View style={styles.header}>
      <Text style={styles.headerText}>DEV MODE</Text>
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button} onPress={handleViewData}>
          <Text style={styles.buttonText}>View All Data</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleClear}>
          <Text style={styles.buttonText}>Clear All Data</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    width: '100%',
    backgroundColor: '#222',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    zIndex: 1000,
  },
  headerText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    letterSpacing: 1,
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginLeft: 8,
  },
  buttonText: {
    color: '#222',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default DevClearDataHeader;
