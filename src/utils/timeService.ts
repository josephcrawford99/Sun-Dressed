export type TimeOfDay = 'morning' | 'afternoon' | 'evening';

/**
 * Get the time of day based on the current hour
 */
export const getTimeOfDay = async (location: string): Promise<TimeOfDay> => {
  const now = new Date();
  const hour = now.getHours();
  
  if (hour >= 5 && hour < 12) {
    return 'morning';
  } else if (hour >= 12 && hour < 17) {
    return 'afternoon';
  } else {
    return 'evening';
  }
};

/**
 * Get a greeting based on the time of day
 */
export const getGreeting = (timeOfDay: TimeOfDay): string => {
  switch (timeOfDay) {
    case 'morning':
      return 'GOOD MORNING';
    case 'afternoon':
      return 'GOOD AFTERNOON';
    case 'evening':
      return 'GOOD EVENING';
    default:
      return 'HELLO';
  }
};