/**
 * Time-related utility functions
 */

/**
 * Get a time-based greeting message based on current hour
 * @returns A greeting string based on the current time of day
 */
export const getTimeBasedGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'good morning';
  if (hour < 18) return 'good afternoon';
  return 'good evening';
};