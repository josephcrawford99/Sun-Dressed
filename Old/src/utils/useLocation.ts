import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LocationState {
  latitude: number;
  longitude: number;
}

interface UseLocationResult {
  location: LocationState | null;
  error: string | null;
}

const LOCATION_CACHE_KEY = 'user_location_cache';
const LOCATION_CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

export const useLocation = (): UseLocationResult => {
  const [location, setLocation] = useState<LocationState | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadCachedLocation = async () => {
    try {
      const cached = await AsyncStorage.getItem(LOCATION_CACHE_KEY);
      if (cached) {
        const parsedLocation: LocationState = JSON.parse(cached);
        setLocation(parsedLocation);
        return true;
      }
    } catch (err) {
      console.error('Error loading cached location:', err);
    }
    return false;
  };

  const saveLocationToCache = async (newLocation: LocationState) => {
    try {
      await AsyncStorage.setItem(LOCATION_CACHE_KEY, JSON.stringify(newLocation));
    } catch (err) {
      console.error('Error saving location to cache:', err);
    }
  };

  useEffect(() => {
    let isMounted = true;
    let locationSubscription: Location.LocationSubscription | null = null;

    const getLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== 'granted') {
          if (isMounted) {
            setError('Permission to access location was denied');
          }
          return;
        }

        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        if (isMounted) {
          const newLocation: LocationState = {
            latitude: currentLocation.coords.latitude,
            longitude: currentLocation.coords.longitude,
          };
          setLocation(newLocation);
          saveLocationToCache(newLocation);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError('Could not get your current location');
          setLocation(null);
        }
      }
    };

    // Try to load cached location first
    loadCachedLocation().then((hasCachedLocation) => {
      if (!hasCachedLocation) {
        getLocation();
      }
    });

    // Set up location updates
    Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 10000,
        distanceInterval: 10,
      },
      (position) => {
        const newLocation: LocationState = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        setLocation(newLocation);
        saveLocationToCache(newLocation);
      }
    ).then((subscription) => {
      locationSubscription = subscription;
    });

    // Cleanup
    return () => {
      isMounted = false;
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, []);

  return { location, error };
};
