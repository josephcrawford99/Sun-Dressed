import { Ionicons } from '@expo/vector-icons';

export type WeatherCode =
  | '01d' | '01n' // clear sky
  | '02d' | '02n' // few clouds
  | '03d' | '03n' // scattered clouds
  | '04d' | '04n' // broken clouds
  | '09d' | '09n' // shower rain
  | '10d' | '10n' // rain
  | '11d' | '11n' // thunderstorm
  | '13d' | '13n' // snow
  | '50d' | '50n'; // mist

export type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

// Map OpenWeather codes to Ionicons
export const weatherIconMap: Record<WeatherCode, IoniconsName> = {
  // Clear
  '01d': 'sunny-outline',
  '01n': 'moon-outline',

  // Few clouds
  '02d': 'partly-sunny-outline',
  '02n': 'cloudy-night-outline',

  // Scattered clouds
  '03d': 'cloud-outline',
  '03n': 'cloud-outline',

  // Broken clouds
  '04d': 'cloudy-outline',
  '04n': 'cloudy-outline',

  // Shower rain
  '09d': 'rainy-outline',
  '09n': 'rainy-outline',

  // Rain
  '10d': 'thunderstorm-outline',
  '10n': 'thunderstorm-outline',

  // Thunderstorm
  '11d': 'thunderstorm-outline',
  '11n': 'thunderstorm-outline',

  // Snow
  '13d': 'snow-outline',
  '13n': 'snow-outline',

  // Mist
  '50d': 'water-outline',
  '50n': 'water-outline',
};

// Helper function to determine if it's day or night
export const isDayTime = (iconCode: string): boolean => {
  return iconCode.endsWith('d');
};

// Type guard to check if a string is a valid weather code
export const isValidWeatherCode = (code: string): code is WeatherCode => {
  return Object.keys(weatherIconMap).includes(code);
};