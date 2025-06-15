import { useOutfit } from '@/contexts/OutfitContext';
import { Weather } from '@/types/weather';
import { DateOffset } from '@/components/CalendarBar';
import { useCallback } from 'react';

/**
 * Simplified hook that uses the OutfitContext for all outfit operations
 */

export const useOutfitGenerator = () => {
  const {
    outfit,
    loading,
    error,
    loadOutfitForDate,
    regenerateOutfit: contextRegenerate,
    cacheStats
  } = useOutfit();

  // Wrapper for loadOrGenerateOutfit that converts date offset
  const loadOrGenerateOutfit = useCallback(async (
    date: Date,
    weather: Weather | null,
    activity: string = 'daily activities',
    location?: string
  ) => {
    // Calculate date offset from today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    const dateOffset = diffDays as DateOffset;
    
    console.log('🔄 Loading outfit via context:', {
      date: date.toDateString(),
      dateOffset,
      activity,
      location
    });
    
    await loadOutfitForDate(dateOffset, weather, activity, location);
  }, [loadOutfitForDate]);

  // Wrapper for regenerateOutfit
  const regenerateOutfit = useCallback(async (
    date: Date,
    weather: Weather,
    activity: string = 'daily activities',
    location?: string
  ) => {
    console.log('🔄 Manual outfit regeneration via context');
    await contextRegenerate(weather, activity, location);
  }, [contextRegenerate]);

  return { 
    outfit, 
    loading, 
    error, 
    loadOrGenerateOutfit, 
    regenerateOutfit,
    cacheStats 
  };
};