import { getWeatherData } from './weatherService';

export type TimeOfDay = 'morning' | 'afternoon' | 'evening';

export const getTimeOfDay = async (location: string): Promise<TimeOfDay> => {
  const now = new Date();
  const hours = now.getHours();

  // Get sunset time from weather data for more accurate evening detection
  try {
    const weatherData = await getWeatherData(location);
    if (weatherData?.sunset) {
      const sunsetTime = new Date(weatherData.sunset * 1000);
      if (now >= sunsetTime) {
        return 'evening';
      }
    }
  } catch (error) {
    console.warn('Could not fetch sunset time, falling back to time-based logic');
  }

  // Fallback to time-based logic if weather data is unavailable
  if (hours < 12) {
    return 'morning';
  } else if (hours < 17) {
    return 'afternoon';
  } else {
    return 'evening';
  }
};

export const getGreeting = (timeOfDay: TimeOfDay): string => {
  switch (timeOfDay) {
    case 'morning':
      return 'GOOD MORNING';
    case 'afternoon':
      return 'GOOD AFTERNOON';
    case 'evening':
      return 'GOOD EVENING';
    default:
      return 'HELLO'; // Fallback greeting
  }
};
