import { useState, useEffect, useCallback } from 'react';

interface UseHomeScreenStateReturn {
  isFlipped: boolean;
  isInitialized: boolean;
  setIsFlipped: (flipped: boolean) => void;
  toggleFlipped: () => void;
  markAsInitialized: () => void;
}

interface UseHomeScreenStateOptions {
  location?: string | null;
  locationLoading?: boolean;
  onLocationReady?: (location: string) => void;
}

/**
 * Hook to manage core home screen state
 * Handles initialization state and flip state for weather/outfit display
 */
export const useHomeScreenState = ({
  location,
  locationLoading,
  onLocationReady
}: UseHomeScreenStateOptions): UseHomeScreenStateReturn => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize when location is available and not loading
  useEffect(() => {
    if (!locationLoading && location && !isInitialized && onLocationReady) {
      onLocationReady(location);
      setIsInitialized(true);
    }
  }, [location, locationLoading, isInitialized, onLocationReady]);

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