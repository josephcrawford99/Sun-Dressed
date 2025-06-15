import { useState, useEffect, useCallback } from 'react';

interface UseHomeScreenStateReturn {
  isFlipped: boolean;
  isInitialized: boolean;
  setIsFlipped: (flipped: boolean) => void;
  toggleFlipped: () => void;
  markAsInitialized: () => void;
}

interface UseHomeScreenStateOptions {
  lastLocation?: string;
  onLocationReady?: (location: string) => void;
}

/**
 * Hook to manage core home screen state
 * Handles initialization state and flip state for weather/outfit display
 */
export const useHomeScreenState = ({
  lastLocation,
  onLocationReady
}: UseHomeScreenStateOptions): UseHomeScreenStateReturn => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize when location is available
  useEffect(() => {
    if (lastLocation && !isInitialized && onLocationReady) {
      onLocationReady(lastLocation);
      setIsInitialized(true);
    }
  }, [lastLocation, isInitialized, onLocationReady]);

  const toggleFlipped = useCallback(() => {
    setIsFlipped(prev => !prev);
  }, []);

  const markAsInitialized = useCallback(() => {
    setIsInitialized(true);
  }, []);

  return {
    isFlipped,
    isInitialized,
    setIsFlipped,
    toggleFlipped,
    markAsInitialized,
  };
};