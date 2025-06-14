import { Ionicons } from '@expo/vector-icons';

// Map OpenWeatherMap icon codes to Ionicons
const WEATHER_ICON_MAPPING: Record<string, keyof typeof Ionicons.glyphMap> = {
  // Clear sky
  '01d': 'sunny',
  '01n': 'moon',
  
  // Few clouds
  '02d': 'partly-sunny',
  '02n': 'cloudy-night',
  
  // Scattered clouds
  '03d': 'cloudy',
  '03n': 'cloudy',
  
  // Broken clouds
  '04d': 'cloudy',
  '04n': 'cloudy',
  
  // Shower rain
  '09d': 'rainy',
  '09n': 'rainy',
  
  // Rain
  '10d': 'rainy',
  '10n': 'rainy',
  
  // Thunderstorm
  '11d': 'thunderstorm',
  '11n': 'thunderstorm',
  
  // Snow
  '13d': 'snow',
  '13n': 'snow',
  
  // Mist/Fog
  '50d': 'cloudy',
  '50n': 'cloudy',
};

/**
 * Maps OpenWeatherMap icon codes to Ionicons
 * @param iconCode - OpenWeatherMap icon code (e.g., "10d", "01n")
 * @returns Ionicons name or default icon if not found
 */
export const getIoniconForWeather = (iconCode?: string): keyof typeof Ionicons.glyphMap => {
  if (!iconCode) return 'cloudy';
  
  return WEATHER_ICON_MAPPING[iconCode] || 'cloudy';
};

/**
 * Gets the fallback OpenWeatherMap icon URL
 * @param iconCode - OpenWeatherMap icon code
 * @returns URL for OpenWeatherMap icon
 */
export const getOpenWeatherIconUrl = (iconCode: string): string => {
  return `http://openweathermap.org/img/w/${iconCode}.png`;
};