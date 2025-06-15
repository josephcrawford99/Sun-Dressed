import { StoredOutfitWithWeather } from '@services/outfitStorageService';
import { OutfitContext } from './OutfitManager';

// Weather change thresholds
const WEATHER_THRESHOLDS = {
  temperature: 10, // °F change
  precipitation: 25, // % change
  wind: 10, // mph change
};

/**
 * Intelligent change detection engine to determine when outfit regeneration is needed
 */
export class ChangeDetectionEngine {
  /**
   * Determine if outfit should be regenerated based on context changes
   */
  shouldRegenerate(
    storedData: StoredOutfitWithWeather,
    currentContext: OutfitContext
  ): boolean {
    console.log('🔍 Analyzing context changes...');
    
    // Check location change
    if (this.hasLocationChanged(storedData, currentContext)) {
      console.log('📍 Location changed - regeneration needed');
      return true;
    }
    
    // Check activity change
    if (this.hasActivityChanged(storedData, currentContext)) {
      console.log('🎯 Activity changed - regeneration needed');
      return true;
    }
    
    // Check weather changes
    if (currentContext.weather && this.hasSignificantWeatherChange(storedData, currentContext)) {
      console.log('🌡️ Significant weather change - regeneration needed');
      return true;
    }
    
    // Check time-based expiration (outfits older than 24 hours)
    if (this.isOutfitExpired(storedData)) {
      console.log('⏰ Outfit expired - regeneration needed');
      return true;
    }
    
    console.log('✅ No significant changes detected');
    return false;
  }
  
  /**
   * Check if location has changed
   */
  private hasLocationChanged(
    storedData: StoredOutfitWithWeather,
    currentContext: OutfitContext
  ): boolean {
    const storedLocation = storedData.weather.location;
    const currentLocation = currentContext.location || currentContext.weather?.location || 'Unknown Location';
    
    const changed = storedLocation !== currentLocation;
    
    console.log('📍 Location comparison:', {
      stored: storedLocation,
      current: currentLocation,
      changed
    });
    
    return changed;
  }
  
  /**
   * Check if activity has changed
   */
  private hasActivityChanged(
    storedData: StoredOutfitWithWeather,
    currentContext: OutfitContext
  ): boolean {
    const changed = storedData.activity !== currentContext.activity;
    
    console.log('🎯 Activity comparison:', {
      stored: storedData.activity,
      current: currentContext.activity,
      changed
    });
    
    return changed;
  }
  
  /**
   * Check if weather has changed significantly
   */
  private hasSignificantWeatherChange(
    storedData: StoredOutfitWithWeather,
    currentContext: OutfitContext
  ): boolean {
    if (!currentContext.weather) {
      return false;
    }
    
    const currentWeather = currentContext.weather;
    const storedWeather = storedData.weather;
    
    // Calculate differences
    const tempDiff = Math.abs(currentWeather.feelsLikeTemp - storedWeather.feelsLikeTemp);
    const precipDiff = Math.abs(currentWeather.highestChanceOfRain - storedWeather.highestChanceOfRain);
    const windDiff = Math.abs(currentWeather.windiness - storedWeather.windiness);
    const conditionChanged = currentWeather.condition !== storedWeather.condition;
    
    console.log('🌡️ Weather comparison:', {
      temperature: {
        stored: storedWeather.feelsLikeTemp,
        current: currentWeather.feelsLikeTemp,
        diff: `${tempDiff}°F`,
        threshold: `${WEATHER_THRESHOLDS.temperature}°F`,
        exceeds: tempDiff > WEATHER_THRESHOLDS.temperature
      },
      precipitation: {
        stored: storedWeather.highestChanceOfRain,
        current: currentWeather.highestChanceOfRain,
        diff: `${precipDiff}%`,
        threshold: `${WEATHER_THRESHOLDS.precipitation}%`,
        exceeds: precipDiff > WEATHER_THRESHOLDS.precipitation
      },
      wind: {
        stored: storedWeather.windiness,
        current: currentWeather.windiness,
        diff: `${windDiff}mph`,
        threshold: `${WEATHER_THRESHOLDS.wind}mph`,
        exceeds: windDiff > WEATHER_THRESHOLDS.wind
      },
      condition: {
        stored: storedWeather.condition,
        current: currentWeather.condition,
        changed: conditionChanged
      }
    });
    
    // Return true if any threshold is exceeded
    return (
      tempDiff > WEATHER_THRESHOLDS.temperature ||
      precipDiff > WEATHER_THRESHOLDS.precipitation ||
      windDiff > WEATHER_THRESHOLDS.wind ||
      conditionChanged
    );
  }
  
  /**
   * Check if outfit is expired (older than 24 hours)
   */
  private isOutfitExpired(storedData: StoredOutfitWithWeather): boolean {
    const now = new Date();
    const createdAt = new Date(storedData.createdAt);
    const hoursOld = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);
    
    const expired = hoursOld > 24;
    
    console.log('⏰ Outfit age check:', {
      createdAt: createdAt.toISOString(),
      hoursOld: hoursOld.toFixed(1),
      expired
    });
    
    return expired;
  }
  
  /**
   * Get weather thresholds for display/configuration
   */
  getThresholds() {
    return { ...WEATHER_THRESHOLDS };
  }
}