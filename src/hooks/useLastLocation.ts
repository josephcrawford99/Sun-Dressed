import { useState, useEffect, useCallback } from 'react';
import { LocationStorageService } from '@/services/locationStorageService';

/**
 * useLastLocation - Hook for managing user's last selected location string persistence
 * 
 * Simple hook that loads the last location on mount and provides a save function.
 * The service layer handles default location logic automatically.
 */

interface UseLastLocationReturn {
  lastLocation: string;
  saveLastLocation: (locationString: string) => Promise<void>;
}

export const useLastLocation = (): UseLastLocationReturn => {
  const [lastLocation, setLastLocation] = useState<string>("New York, NY, USA");

  // Load the last location when hook initializes
  useEffect(() => {
    const loadLastLocation = async () => {
      try {
        const stored = await LocationStorageService.getLastLocation();
        setLastLocation(stored);
      } catch (error) {
        console.error('Error loading last location:', error);
        // Keep default location on error
      }
    };

    loadLastLocation();
  }, []);

  // Function to save a new last location
  const saveLastLocation = useCallback(async (locationString: string) => {
    try {
      await LocationStorageService.saveLastLocation(locationString);
      setLastLocation(locationString);
    } catch (error) {
      console.error('Error saving last location:', error);
      // Don't throw - allow the app to continue functioning
    }
  }, []);

  return {
    lastLocation,
    saveLastLocation,
  };
};