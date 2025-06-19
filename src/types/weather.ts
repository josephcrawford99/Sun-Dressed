export interface Weather {
  currentTemp: number; // Fahrenheit - actual current temperature
  dailyHighTemp: number; // Fahrenheit
  dailyLowTemp: number; // Fahrenheit
  highestChanceOfRain: number; // Percentage (0-100) or precipitation volume (mm)
  precipitationUnit: 'percentage' | 'mm'; // Unit for highestChanceOfRain
  windiness: number; // mph
  windDirection: number; // degrees (0-360)
  sunniness: number; // Percentage (0-100)
  feelsLikeTemp: number; // Fahrenheit
  humidity: number; // Percentage (0-100)
  uvIndex: number; // 0-11 scale
  pressure: number; // hPa (hectopascals)
  sunrise: number; // Unix timestamp
  sunset: number; // Unix timestamp
  condition: 'sunny' | 'partly-cloudy' | 'cloudy' | 'rainy' | 'stormy' | 'snowy' | 'foggy';
  description?: string; // Detailed weather description
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
  currentTemp: 52,
  dailyHighTemp: 55,
  dailyLowTemp: 42,
  highestChanceOfRain: 75,
  precipitationUnit: 'percentage',
  windiness: 12,
  windDirection: 225, // SW
  sunniness: 25,
  feelsLikeTemp: 48,
  humidity: 85,
  uvIndex: 2,
  pressure: 1012,
  sunrise: Date.now() - 8 * 60 * 60 * 1000, // 8 hours ago
  sunset: Date.now() + 10 * 60 * 60 * 1000, // 10 hours from now
  condition: 'rainy',
  description: 'light rain',
  location: 'Current Location',
  icon: '10d' // Mock rain icon
};