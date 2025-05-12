import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { navigate, isNavigationReady, getCurrentRouteName } from '../navigation/navigationRef';

const DEV_MODE = true; // Set to false before deployment

interface DevClearDataHeaderProps {
  isAuthScreen?: boolean;
}

/**
 * Development header with utilities for debugging and testing the app
 * Shows different buttons based on whether we're on the auth screen or not
 * Uses navigationRef for navigation instead of props or hooks
 */
const DevClearDataHeader: React.FC<DevClearDataHeaderProps> = ({ 
  isAuthScreen = false 
}) => {
  const [navigationAvailable, setNavigationAvailable] = useState(false);
  const [currentRoute, setCurrentRoute] = useState<string | null>(null);
  
  // Check navigation status periodically
  useEffect(() => {
    // Initial check
    checkNavigationStatus();
    
    // Set up periodic checking
    const intervalId = setInterval(checkNavigationStatus, 1000);
    
    // Clean up on component unmount
    return () => clearInterval(intervalId);
  }, []);
  
  // Function to check navigation status
  const checkNavigationStatus = () => {
    const navReady = isNavigationReady();
    setNavigationAvailable(navReady);
    
    if (navReady) {
      setCurrentRoute(getCurrentRouteName());
    }
  };

  if (!DEV_MODE) return null;

  // Use the current route to determine if we're on the auth screen
  // This overrides the prop if navigation is available
  const isActuallyAuthScreen = navigationAvailable ? 
    (currentRoute === 'Auth' || currentRoute === null) : 
    isAuthScreen;

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
  
  const handleDevLogin = () => {
    // Set a flag to auto-login with dev credentials
    AsyncStorage.setItem('@dev_auto_login', 'true')
      .then(() => {
        Alert.alert('Dev Login', 'Will auto-login as josephcrawford99@gmail.com');
      })
      .catch(err => {
        console.error('Failed to set dev login flag:', err);
      });
  };
  
  const handleDevLogout = () => {
    // Check if navigation is ready before trying to navigate
    if (navigationAvailable) {
      // Navigate to Account screen where we can trigger the logout
      const success = navigate('Account');
      
      if (!success) {
        Alert.alert('Dev Mode', 'Navigation failed. Try again in a moment.');
      }
    } else {
      // Fallback for when navigation is not available
      Alert.alert('Dev Mode', 'Navigation to Account screen not available yet. Please try again in a moment.');
    }
  };

  return (
    <View style={styles.header}>
      <Text style={styles.headerText}>
        DEV MODE {currentRoute ? `(${currentRoute})` : ''}
      </Text>
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button} onPress={handleViewData}>
          <Text style={styles.buttonText}>View Data</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleClear}>
          <Text style={styles.buttonText}>Clear Data</Text>
        </TouchableOpacity>
        
        {isActuallyAuthScreen ? (
          <TouchableOpacity 
            style={[styles.button, styles.loginButton]} 
            onPress={handleDevLogin}
          >
            <Text style={styles.buttonText}>Dev Login</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={[styles.button, styles.logoutButton]} 
            onPress={handleDevLogout}
          >
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        )}
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
  loginButton: {
    backgroundColor: '#4CAF50', // Green color for login
  },
  logoutButton: {
    backgroundColor: '#F44336', // Red color for logout
  },
});

export default DevClearDataHeader;
