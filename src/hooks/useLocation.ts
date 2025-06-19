import { useState, useEffect, useCallback } from 'react';
import { LocationStorageService } from '@/services/locationStorageService';

/**
 * useLocation - Hook for managing user's current location string persistence
 * 
 * Simple hook that loads the current location on mount and provides a save function.
 * The service layer handles default location logic automatically.
 */

interface UseLocationReturn {
  location: string;
  saveLocation: (locationString: string) => Promise<void>;
}

export const useLocation = (): UseLocationReturn => {
  const [location, setLocation] = useState<string>("New York, NY, USA");

  // Load the current location when hook initializes
  useEffect(() => {
    const loadLocation = async () => {
      try {
        const stored = await LocationStorageService.getLastLocation();
        setLocation(stored);
      } catch (error) {
        // Error loading location, keep default
      }
    };

    loadLocation();
  }, []);

  // Function to save a new location
  const saveLocation = useCallback(async (locationString: string) => {
    try {
      await LocationStorageService.saveLastLocation(locationString);
      setLocation(locationString);
    } catch (error) {
      // Error saving location
      // Don't throw - allow the app to continue functioning
    }
  }, []);

  return {
    location,
    saveLocation,
  };
};