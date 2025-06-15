import { useSettings } from '@/contexts/SettingsContext';
import { Outfit } from '@/types/Outfit';
import { Weather } from '@/types/weather';
import { generateOutfitLLM } from '@services/llmService';
import { OutfitStorageService, StoredOutfitWithWeather } from '@services/outfitStorageService';
import { useCallback, useState } from 'react';

// Weather change thresholds for determining if regeneration is needed
const WEATHER_CHANGE_THRESHOLDS = {
  temperature: 10, // 10°F difference in feels-like temp
  precipitation: 25, // 25% change in rain chance
  wind: 10, // 10 mph change
  condition: true // Any condition change triggers regeneration
};

export const useOutfitGenerator = () => {
  const { settings } = useSettings();
  const [outfit, setOutfit] = useState<Outfit | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if weather has changed significantly enough to warrant regeneration
  const hasWeatherChangedSignificantly = useCallback((newWeather: Weather, oldWeather: StoredOutfitWithWeather['weather']): boolean => {
    // Temperature change
    if (Math.abs(newWeather.feelsLikeTemp - oldWeather.feelsLikeTemp) >= WEATHER_CHANGE_THRESHOLDS.temperature) {
      console.log('🌡️ Significant temperature change detected');
      return true;
    }
    
    // Precipitation change
    if (Math.abs(newWeather.highestChanceOfRain - oldWeather.highestChanceOfRain) >= WEATHER_CHANGE_THRESHOLDS.precipitation) {
      console.log('🌧️ Significant precipitation change detected');
      return true;
    }
    
    // Wind change
    if (Math.abs(newWeather.windiness - oldWeather.windiness) >= WEATHER_CHANGE_THRESHOLDS.wind) {
      console.log('💨 Significant wind change detected');
      return true;
    }
    
    // Condition change
    if (newWeather.condition !== oldWeather.condition) {
      console.log('🌦️ Weather condition change detected');
      return true;
    }
    
    return false;
  }, []);

  const loadOrGenerateOutfit = useCallback(async (
    date: Date,
    weather?: Weather, 
    activity?: string, 
    location?: string
  ) => {
    setLoading(true);
    setError(null);
    setOutfit(null); // Clear previous outfit

    try {
      const storedData = await OutfitStorageService.getOutfitByDate(date);
      let needsRegeneration = false;
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const isPastDate = date < today;

      if (storedData) {
        console.log(`👕 Found stored outfit for ${date.toDateString()}`);
        
        // For past dates, just load the stored outfit, don't regenerate
        if (isPastDate) {
          setOutfit(storedData.outfit);
          return;
        }

        // For today or future, check if regeneration is needed
        const locationChanged = location && storedData.weather.location !== location;
        if (locationChanged) {
          console.log(`🗺️ Location changed from "${storedData.weather.location}" to "${location}", regenerating.`);
          needsRegeneration = true;
        } else if (weather) {
          const weatherChanged = hasWeatherChangedSignificantly(weather, storedData.weather);
          if (weatherChanged) {
            console.log('🌦️ Weather changed significantly, regenerating.');
            needsRegeneration = true;
          }
        }
        
        if (!needsRegeneration) {
          console.log('✅ Conditions met to restore outfit from storage.');
          setOutfit(storedData.outfit);
          return;
        }
      }

      // If we are here, we need to generate an outfit.
      // This happens if there's no stored data, or if regeneration is explicitly needed.
      console.log('🧠 Generating new outfit...');

      // Cannot generate for past dates or if weather data is missing for current/future dates
      if (isPastDate) {
        console.log('ℹ️ No stored outfit for this past date. Cannot generate.');
        // Error is null, loading will be set to false, outfit is null. Component will show 'no outfit'.
        return;
      }
      if (!weather) {
        setError('Weather data is required to generate a new outfit.');
        return;
      }
      
      // Hook automatically includes user's style preference
      const newOutfit = await generateOutfitLLM(weather, activity, settings.stylePreference);
      setOutfit(newOutfit);
      
      // Auto-store outfit with weather context
      const weatherWithLocation = { ...weather, location: location || weather.location };
      await OutfitStorageService.saveOutfit(newOutfit, weatherWithLocation, date);
      console.log(`💾 Outfit with weather context auto-stored for ${date.toDateString()}`);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate outfit');
      console.error('❌ Error in loadOrGenerateOutfit:', err);
    } finally {
      setLoading(false);
    }
  }, [settings.stylePreference, hasWeatherChangedSignificantly]);

  return { outfit, loading, error, generateOutfit: loadOrGenerateOutfit };
};