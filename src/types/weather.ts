export interface Weather {
  dailyHighTemp: number; // Fahrenheit
  dailyLowTemp: number; // Fahrenheit
  highestChanceOfRain: number; // Percentage (0-100) or precipitation volume (mm)
  precipitationUnit: 'percentage' | 'mm'; // Unit for highestChanceOfRain
  windiness: number; // mph
  sunniness: number; // Percentage (0-100)
  feelsLikeTemp: number; // Fahrenheit
  humidity: number; // Percentage (0-100)
  uvIndex: number; // 0-11 scale
  condition: 'sunny' | 'partly-cloudy' | 'cloudy' | 'rainy' | 'stormy' | 'snowy' | 'foggy';
  location?: string; // Optional location info
  icon?: string; // OpenWeatherMap icon code (e.g., "10d", "01n")
}

export interface WeatherDisplay extends Weather {
  displayTemp: {
    feelsLike: string;
    high: string;
    low: string;
    current: string;
  };
  displayWind: {
    speed: string;
    unit: string;
  };
  temperatureUnit: string;
  coordinates?: {
    lat: number;
    lon: number;
  };
}

export const mockWeather: Weather = {
  dailyHighTemp: 55,
  dailyLowTemp: 42,
  highestChanceOfRain: 75,
  precipitationUnit: 'percentage',
  windiness: 12,
  sunniness: 25,
  feelsLikeTemp: 48,
  humidity: 85,
  uvIndex: 2,
  condition: 'rainy',
  location: 'Current Location',
  icon: '10d' // Mock rain icon
};