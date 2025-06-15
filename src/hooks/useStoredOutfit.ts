import { useState, useCallback } from 'react';
import { Outfit } from '@/types/Outfit';
import { OutfitStorageService } from '@/services/outfitStorageService';
import { DateOffset } from '@/components/CalendarBar';

/**
 * Custom hook for managing stored outfit retrieval by date
 */
export const useStoredOutfit = () => {
  const [outfit, setOutfit] = useState<Outfit | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Get date from DateOffset
   */
  const getDateFromOffset = (offset: DateOffset): Date => {
    const date = new Date();
    date.setDate(date.getDate() + offset);
    return date;
  };

  /**
   * Load stored outfit for a specific date offset
   */
  const loadStoredOutfit = useCallback(async (dateOffset: DateOffset) => {
    setLoading(true);
    setError(null);
    
    try {
      const targetDate = getDateFromOffset(dateOffset);
      const storedOutfit = await OutfitStorageService.getOutfitByDate(targetDate);
      setOutfit(storedOutfit);
      
    } catch (err) {
      setError('Failed to load stored outfit');
      // Error loading stored outfit
      setOutfit(null);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Check if an outfit exists for a specific date offset without loading it
   */
  const hasStoredOutfit = useCallback(async (dateOffset: DateOffset): Promise<boolean> => {
    try {
      const targetDate = getDateFromOffset(dateOffset);
      const outfitItems = await OutfitStorageService.getOutfitItemsByDate(targetDate);
      return outfitItems !== null && outfitItems.length > 0;
    } catch (err) {
      // Error checking stored outfit
      return false;
    }
  }, []);

  /**
   * Clear current stored outfit state
   */
  const clearStoredOutfit = useCallback(() => {
    setOutfit(null);
    setError(null);
    setLoading(false);
  }, []);

  /**
   * Get formatted date string for display
   */
  const getDateString = useCallback((dateOffset: DateOffset): string => {
    const date = getDateFromOffset(dateOffset);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  }, []);

  return {
    outfit,
    loading,
    error,
    loadStoredOutfit,
    hasStoredOutfit,
    clearStoredOutfit,
    getDateString,
  };
};