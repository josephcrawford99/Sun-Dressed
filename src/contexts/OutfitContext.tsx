import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { Outfit } from '@/types/Outfit';
import { Weather } from '@/types/weather';
import { OutfitManager } from '@/services/outfit/OutfitManager';
import { DateOffset } from '@/components/CalendarBar';

interface OutfitContextValue {
  // State
  outfit: Outfit | null;
  loading: boolean;
  error: string | null;
  currentDateOffset: DateOffset;
  currentActivity: string;
  
  // Actions
  loadOutfitForDate: (dateOffset: DateOffset, weather: Weather | null, activity: string, location?: string) => Promise<void>;
  regenerateOutfit: (weather: Weather, activity: string, location?: string) => Promise<void>;
  setDateOffset: (offset: DateOffset) => void;
  setActivity: (activity: string) => void;
  clearError: () => void;
  
  // Cache info
  cacheStats: {
    hits: number;
    misses: number;
    apiCalls: number;
  };
}

const OutfitContext = createContext<OutfitContextValue | undefined>(undefined);

export const useOutfit = (): OutfitContextValue => {
  const context = useContext(OutfitContext);
  if (!context) {
    throw new Error('useOutfit must be used within an OutfitProvider');
  }
  return context;
};

interface OutfitProviderProps {
  children: React.ReactNode;
}

export const OutfitProvider: React.FC<OutfitProviderProps> = ({ children }) => {
  const [outfit, setOutfit] = useState<Outfit | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentDateOffset, setCurrentDateOffset] = useState<DateOffset>(0);
  const [currentActivity, setCurrentActivity] = useState('daily activities');
  const [cacheStats, setCacheStats] = useState({ hits: 0, misses: 0, apiCalls: 0 });
  
  const outfitManagerRef = useRef<OutfitManager>();
  
  // Initialize OutfitManager
  useEffect(() => {
    outfitManagerRef.current = new OutfitManager();
    return () => {
      // Cleanup if needed
      if (outfitManagerRef.current) {
        outfitManagerRef.current.cleanup();
      }
    };
  }, []);
  
  const loadOutfitForDate = useCallback(async (
    dateOffset: DateOffset,
    weather: Weather | null,
    activity: string,
    location?: string
  ) => {
    if (!outfitManagerRef.current) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + dateOffset);
      
      const result = await outfitManagerRef.current.getOutfit({
        date: targetDate,
        weather,
        activity,
        location,
        dateOffset
      });
      
      setOutfit(result.outfit);
      setCacheStats(result.stats);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load outfit';
      setError(errorMessage);
      setOutfit(null);
      console.error('❌ Error loading outfit:', err);
    } finally {
      setLoading(false);
    }
  }, []);
  
  const regenerateOutfit = useCallback(async (
    weather: Weather,
    activity: string,
    location?: string
  ) => {
    if (!outfitManagerRef.current) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + currentDateOffset);
      
      const result = await outfitManagerRef.current.forceRegenerate({
        date: targetDate,
        weather,
        activity,
        location,
        dateOffset: currentDateOffset
      });
      
      setOutfit(result.outfit);
      setCacheStats(result.stats);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to regenerate outfit';
      setError(errorMessage);
      console.error('❌ Error regenerating outfit:', err);
    } finally {
      setLoading(false);
    }
  }, [currentDateOffset]);
  
  const setDateOffset = useCallback((offset: DateOffset) => {
    setCurrentDateOffset(offset);
  }, []);
  
  const setActivity = useCallback((activity: string) => {
    setCurrentActivity(activity);
  }, []);
  
  const clearError = useCallback(() => {
    setError(null);
  }, []);
  
  const contextValue: OutfitContextValue = {
    outfit,
    loading,
    error,
    currentDateOffset,
    currentActivity,
    loadOutfitForDate,
    regenerateOutfit,
    setDateOffset,
    setActivity,
    clearError,
    cacheStats
  };
  
  return (
    <OutfitContext.Provider value={contextValue}>
      {children}
    </OutfitContext.Provider>
  );
};