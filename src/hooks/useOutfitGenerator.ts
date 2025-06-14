import { Outfit } from '@/types/Outfit';
import { Weather } from '@/types/weather';
import { useSettings } from '@/contexts/SettingsContext';
import { generateOutfitLLM } from '@services/llmService';
import { useCallback, useState } from 'react';

export const useOutfitGenerator = () => {
  const { settings } = useSettings();
  const [outfit, setOutfit] = useState<Outfit | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateOutfit = useCallback(async (weather?: Weather, activity?: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Hook automatically includes user's style preference
      const newOutfit = await generateOutfitLLM(weather, activity, settings.stylePreference);
      setOutfit(newOutfit);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate outfit');
    } finally {
      setLoading(false);
    }
  }, [settings.stylePreference]);

  return { outfit, loading, error, generateOutfit };
};