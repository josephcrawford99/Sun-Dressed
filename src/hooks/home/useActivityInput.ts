import { useState, useEffect, useRef, useCallback } from 'react';

interface UseActivityInputReturn {
  activityInput: string;
  setActivityInput: (input: string) => void;
}

interface UseActivityInputOptions {
  onActivityChange: (activity: string) => void;
  debounceMs?: number;
}

/**
 * Hook to manage activity input with debouncing
 * Handles local input state and debounced updates to the parent
 */
export const useActivityInput = ({
  onActivityChange,
  debounceMs = 800
}: UseActivityInputOptions): UseActivityInputReturn => {
  const [activityInput, setActivityInput] = useState('');
  const debounceRef = useRef<NodeJS.Timeout>();

  // Debounce activity input and update parent
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      const activity = activityInput || 'daily activities';
      onActivityChange(activity);
    }, debounceMs);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [activityInput, onActivityChange, debounceMs]);

  const handleSetActivityInput = useCallback((input: string) => {
    setActivityInput(input);
  }, []);

  return {
    activityInput,
    setActivityInput: handleSetActivityInput,
  };
};