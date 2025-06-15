import { WeatherService } from './weather/WeatherService';

// Create and export singleton instance for backward compatibility
export const weatherService = new WeatherService();