import { useState, useEffect, useCallback } from 'react';
import * as Location from 'expo-location';

interface DeviceLocation {
  latitude: number;
  longitude: number;
}

interface UseDeviceLocationReturn {
  location: DeviceLocation | null;
  isLoading: boolean;
  error: string | null;
  requestLocation: () => Promise<void>;
  hasPermission: boolean | null;
}

const US_CENTER_COORDINATES = {
  latitude: 39.8283,
  longitude: -98.5795
};

export function useDeviceLocation(): UseDeviceLocationReturn {
  const [location, setLocation] = useState<DeviceLocation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const requestLocation = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Request permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      setHasPermission(status === 'granted');
      
      if (status !== 'granted') {
        console.log('📍 Location permission denied, using US center fallback');
        setLocation(US_CENTER_COORDINATES);
        return;
      }

      // Get current position
      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 10000, // 10 seconds timeout
      });

      const deviceLocation = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      };

      console.log('📍 Device location obtained:', deviceLocation);
      setLocation(deviceLocation);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get device location';
      console.warn('⚠️ Device location failed, using US center fallback:', errorMessage);
      setError(errorMessage);
      setLocation(US_CENTER_COORDINATES);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Auto-request location on mount
  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  return {
    location,
    isLoading,
    error,
    requestLocation,
    hasPermission
  };
}