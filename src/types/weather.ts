export interface Weather {
  dailyHighTemp: number; // Fahrenheit
  dailyLowTemp: number; // Fahrenheit
  highestChanceOfRain: number; // Percentage (0-100)
  windiness: number; // mph
  sunniness: number; // Percentage (0-100)
  feelsLikeTemp: number; // Fahrenheit
  humidity: number; // Percentage (0-100)
  uvIndex: number; // 0-11 scale
  condition: 'sunny' | 'partly-cloudy' | 'cloudy' | 'rainy' | 'stormy' | 'snowy' | 'foggy';
  location?: string; // Optional location info
}

export const mockWeather: Weather = {
  dailyHighTemp: 55,
  dailyLowTemp: 42,
  highestChanceOfRain: 75,
  windiness: 12,
  sunniness: 25,
  feelsLikeTemp: 48,
  humidity: 85,
  uvIndex: 2,
  condition: 'rainy',
  location: 'Current Location'
};