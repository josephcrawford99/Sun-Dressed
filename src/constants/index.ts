/**
 * App-wide constants for Sun Dressed
 * Centralized configuration for cache durations, API settings, and other constants
 */

// Cache durations (in milliseconds)
export const CACHE_DURATION = {
  WEATHER: 10 * 60 * 1000, // 10 minutes
  LOCATION: 5 * 60 * 1000,  // 5 minutes
  USER_SESSION: 24 * 60 * 60 * 1000, // 24 hours
  TRIPS: Infinity, // Local data doesn't expire automatically
  OUTFITS: 24 * 60 * 60 * 1000, // 24 hours
  SETTINGS: Infinity, // User preferences persist indefinitely
} as const;

// Storage keys for AsyncStorage (used internally by TanStack Query)
export const STORAGE_KEYS = {
  QUERY_CACHE: 'SUN_DRESSED_QUERY_CACHE',
  USER_TRIPS: 'user_trips',
  USER_SETTINGS: 'user_settings',
} as const;

// API Configuration
export const API_CONFIG = {
  WEATHER_FORECAST_DAYS: 8,
  LOCATION_SEARCH_DELAY: 300, // ms
  RATE_LIMIT_WINDOW: 60 * 1000, // 1 minute
  MAX_REQUESTS_PER_WINDOW: 50,
} as const;

// Authentication
export const AUTH = {
  SESSION_REFRESH_THRESHOLD: 5 * 60 * 1000, // 5 minutes before expiry
  MAX_LOGIN_ATTEMPTS: 3,
  LOGIN_LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
} as const;

// UI Constants
export const UI = {
  ANIMATION_DURATION: 300,
  DEBOUNCE_DELAY: 500,
  MAX_TOUCH_TARGET_SIZE: 44,
  MIN_TOUCH_TARGET_SIZE: 32,
} as const;