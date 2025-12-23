/**
 * Unified weather data interface used throughout the app
 * Represents the app's internal weather model, independent of API source
 */
export interface WeatherData {
  lat: number;
  lon: number;
  name: string;
  temp: {
    current: number;
    min: number;
    max: number;
    feels_like: number;
  };
  pop: number;
  wind: {
    speed: number;
    gust?: number;
  };
  description: string;
  icon: string;
}
