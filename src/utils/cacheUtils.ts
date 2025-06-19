/**
 * Cache utility functions for TanStack Query outfit caching
 */

/**
 * Calculate milliseconds until end of day for cache expiration
 */
export const getTimeUntilEndOfDay = (date: Date): number => {
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  return Math.max(0, endOfDay.getTime() - Date.now());
};

/**
 * Convert date to YYYY-MM-DD string for consistent query keys
 */
export const getDateString = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

/**
 * Generate outfit query key for TanStack Query caching
 */
export const getOutfitQueryKey = (
  date: Date, 
  location: string, 
  activity: string
): string[] => {
  const dateString = getDateString(date);
  return ['outfit', dateString, location, activity];
};

/**
 * Check if a date is in the past (before today)
 */
export const isPastDate = (date: Date): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const targetDate = new Date(date);
  targetDate.setHours(0, 0, 0, 0);
  return targetDate < today;
};

/**
 * Cache configuration constants
 */
export const OUTFIT_CACHE_CONFIG = {
  // Keep outfit data for 3 days after last use
  gcTime: 1000 * 60 * 60 * 24 * 3, // 3 days
  // Retry failed requests only once to avoid spamming LLM
  retry: 1,
  // Don't automatically refetch on window focus for outfits
  refetchOnWindowFocus: false,
  // Don't automatically refetch when coming back online
  refetchOnReconnect: false,
};