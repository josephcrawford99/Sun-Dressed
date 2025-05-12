// API Configuration
export const WEATHER_API = {
  KEY: '55c56ace4bd5079cdbcfa7b8804a5562',
  BASE_URL: 'https://api.openweathermap.org/data/2.5',
  UNITS: 'metric' // or 'imperial' for Fahrenheit
};

// Default Location (for development)
export const DEFAULT_LOCATION = 'New York';

// Temperature thresholds for clothing recommendations
export const TEMP_THRESHOLDS = {
  VERY_COLD: 0,
  COLD: 10,
  MILD: 20,
  WARM: 25,
  HOT: 30
};

// Time of day ranges (24-hour format)
export const TIME_RANGES = {
  MORNING: { start: 5, end: 11 },
  AFTERNOON: { start: 12, end: 16 },
  EVENING: { start: 17, end: 23 },
  NIGHT: { start: 0, end: 4 }
};

// Cache durations (in milliseconds)
export const CACHE_DURATION = {
  WEATHER: 1000 * 60 * 15, // 15 minutes
  LOCATION: 1000 * 60 * 60 * 24 // 24 hours
};
