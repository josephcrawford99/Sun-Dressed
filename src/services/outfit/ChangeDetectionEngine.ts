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
    
    // Check location change
    if (this.hasLocationChanged(storedData, currentContext)) {
      return true;
    }
    
    // Check activity change
    if (this.hasActivityChanged(storedData, currentContext)) {
      return true;
    }
    
    // Check weather changes
    if (currentContext.weather && this.hasSignificantWeatherChange(storedData, currentContext)) {
      return true;
    }
    
    // Check time-based expiration (outfits older than 24 hours)
    if (this.isOutfitExpired(storedData)) {
      return true;
    }
    
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
    
    
    return expired;
  }
  
  /**
   * Get weather thresholds for display/configuration
   */
  getThresholds() {
    return { ...WEATHER_THRESHOLDS };
  }
}