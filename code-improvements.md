# Sun Dressed App Code Improvements

After reviewing the codebase for the Sun Dressed application (formerly Climate Closet), I've identified several areas for improvement to make the code more robust, succinct, and readable.

## Joey's Suggestions:
- Add a button to the dev header that signs me in as username josephcrawford99@gmail.com with password asdfgh
- Add a button to the dev header that logs me out
- Make the button and text fields have a uniform style so that they are all either black with white text (sign in with apple for example) or white with black text (the email and password text fields for example). They are currently sometimes yellow with white text and I would like to save the yellow tertiary color for other small elements.
## 1. Weather Service Improvements

### Issue: Incomplete Implementation of `getForecast` Method
The `getForecast` method in `weatherService.ts` has an empty implementation, returning only an empty array.

```typescript
// Current implementation
export const getForecast = async (location: string): Promise<DailyForecast[]> => {
  try {
    const response = await axios.get(`${WEATHER_API.BASE_URL}/forecast`, {
      params: {
        q: location,
        appid: WEATHER_API.KEY,
        units: WEATHER_API.UNITS
      }
    });

    // Process the forecast data
    // This is a simplified example - actual implementation would be more complex
    const forecastData: DailyForecast[] = [];

    // Process the data and return formatted forecasts
    // ...

    return forecastData;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      // Error handling logic
    }
    throw new WeatherError('Failed to fetch forecast data. Please try again.', 'UNKNOWN_ERROR');
  }
};
```

### Solution:
Implement the forecast processing logic to format the OpenWeatherMap API response into the specified `DailyForecast` interface:

```typescript
export const getForecast = async (location: string): Promise<DailyForecast[]> => {
  try {
    const response = await axios.get(`${WEATHER_API.BASE_URL}/forecast`, {
      params: {
        q: location,
        appid: WEATHER_API.KEY,
        units: WEATHER_API.UNITS
      }
    });

    // Process the forecast data
    const forecastList = response.data.list;
    const forecastByDay: Record<string, any[]> = {};

    // Group forecast data by day
    forecastList.forEach((item: any) => {
      const date = new Date(item.dt * 1000);
      const dateStr = date.toISOString().split('T')[0];

      if (!forecastByDay[dateStr]) {
        forecastByDay[dateStr] = [];
      }

      forecastByDay[dateStr].push(item);
    });

    // Create DailyForecast objects for each day
    const dailyForecasts: DailyForecast[] = Object.keys(forecastByDay).map(date => {
      const dayData = forecastByDay[date];

      // Find forecast items closest to morning, afternoon, evening times
      const morning = findClosestForecast(dayData, TIME_RANGES.MORNING.start + 2); // 7 AM
      const afternoon = findClosestForecast(dayData, TIME_RANGES.AFTERNOON.start + 2); // 2 PM
      const evening = findClosestForecast(dayData, TIME_RANGES.EVENING.start + 2); // 7 PM

      return {
        date,
        morning: formatForecast(morning),
        afternoon: formatForecast(afternoon),
        evening: formatForecast(evening)
      };
    });

    return dailyForecasts.slice(0, 5); // Return 5-day forecast
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new WeatherError('Invalid API key. Please check your configuration.', 'INVALID_API_KEY');
      } else if (error.response?.status === 404) {
        throw new WeatherError(`Location "${location}" not found. Please check the city name.`, 'LOCATION_NOT_FOUND');
      }
    }
    throw new WeatherError('Failed to fetch forecast data. Please try again.', 'UNKNOWN_ERROR');
  }
};

// Helper functions for forecast processing
const findClosestForecast = (forecasts: any[], targetHour: number): any => {
  return forecasts.reduce((closest, current) => {
    const currentHour = new Date(current.dt * 1000).getHours();
    const closestHour = closest ? new Date(closest.dt * 1000).getHours() : -1;

    const currentDiff = Math.abs(currentHour - targetHour);
    const closestDiff = closest ? Math.abs(closestHour - targetHour) : Infinity;

    return currentDiff < closestDiff ? current : closest;
  }, null);
};

const formatForecast = (forecastItem: any): WeatherData => {
  if (!forecastItem) {
    // Provide a default object if no forecast is available for the time
    return {
      temperature: 0,
      feels_like: 0,
      humidity: 0,
      wind_speed: 0,
      description: 'No data',
      icon: '01d'
    };
  }

  return {
    temperature: Math.round(forecastItem.main.temp),
    feels_like: Math.round(forecastItem.main.feels_like),
    humidity: forecastItem.main.humidity,
    description: forecastItem.weather[0].description,
    icon: forecastItem.weather[0].icon,
    wind_speed: forecastItem.wind.speed
  };
};
```

### Issue: Duplicate Time of Day Logic
There are two implementations of time of day logic: one in `weatherService.ts` and another in `timeService.ts`.

### Solution:
Remove the `getTimeOfDay` function from `weatherService.ts` and only use the implementation from `timeService.ts` for consistency.

## 2. API Key Security Concerns

### Issue: Hardcoded API Key
The OpenWeatherMap API key is hardcoded in `constants.ts`, which is a security risk, especially for a version-controlled repository.

```typescript
export const WEATHER_API = {
  KEY: '55c56ace4bd5079cdbcfa7b8804a5562',
  BASE_URL: 'https://api.openweathermap.org/data/2.5',
  UNITS: 'metric' // or 'imperial' for Fahrenheit
};
```

### Solution:
Move the API key to an environment variable or configuration file that is not tracked in version control:

1. Create a `.env` file in the project root (and add it to `.gitignore`)
2. Install the `react-native-dotenv` package
3. Update `constants.ts` to read from environment:

```typescript
// In .env file (not in version control)
OPENWEATHER_API_KEY=55c56ace4bd5079cdbcfa7b8804a5562

// In constants.ts
import { OPENWEATHER_API_KEY } from '@env';

export const WEATHER_API = {
  KEY: OPENWEATHER_API_KEY,
  BASE_URL: 'https://api.openweathermap.org/data/2.5',
  UNITS: 'metric' // or 'imperial' for Fahrenheit
};
```

## 3. Error Handling and Offline Resilience

### Issue: Limited Error Handling in Weather Hooks
The current error handling in `useWeather.ts` is basic and only shows a generic error message.

### Solution:
Enhance error handling with more descriptive error states and user-friendly messages:

```typescript
// Add to the UseWeatherResult interface
interface UseWeatherResult {
  // ...existing properties
  errorType?: 'network' | 'location' | 'api' | 'rate_limit' | 'unknown';
}

// In the fetchWeather function
try {
  // ...existing code
} catch (err: any) {
  let errorType: UseWeatherResult['errorType'] = 'unknown';
  let errorMessage = 'Failed to fetch weather data';

  if (err.code === 'NETWORK_ERROR') {
    errorType = 'network';
    errorMessage = 'Network error. Please check your connection.';
  } else if (err.code === 'LOCATION_NOT_FOUND') {
    errorType = 'location';
    errorMessage = `Location "${location}" not found. Please check the city name.`;
  } else if (err.code === 'INVALID_API_KEY') {
    errorType = 'api';
    errorMessage = 'API configuration error. Please contact support.';
  } else if (err.code === 'RATE_LIMIT') {
    errorType = 'rate_limit';
    errorMessage = 'Too many requests. Please try again later.';
  }

  // Use cached data if available
  const cached = await getCachedWeather(location);
  if (cached) {
    setWeatherData(cached.data);
    setLastUpdated(new Date(cached.timestamp));
    setError(`${errorMessage} (showing cached data)`);
  } else {
    setError(errorMessage);
  }

  setErrorType(errorType);
}
```

### Issue: Missing Indicator for Cached Data
Users aren't clearly informed when they're viewing cached data.

### Solution:
Add a visual indicator in the UI when displaying cached data:

```typescript
// In HomeScreen.tsx, add to the weatherData section
{weatherData && (
  <View style={styles.weatherDetails}>
    {lastUpdated && Date.now() - lastUpdated.getTime() > 10 * 60 * 1000 && (
      <Text style={styles.cachedDataNotice}>
        <Ionicons name="time-outline" size={14} color="#888" />
        {" "}Data last updated {formatTimeAgo(lastUpdated)}
      </Text>
    )}
    {/* Rest of weather display */}
  </View>
)}

// Add a helper function to format time ago
const formatTimeAgo = (date: Date): string => {
  const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
  if (minutes < 1) return 'just now';
  if (minutes === 1) return '1 minute ago';
  if (minutes < 60) return `${minutes} minutes ago`;

  const hours = Math.floor(minutes / 60);
  if (hours === 1) return '1 hour ago';
  return `${hours} hours ago`;
};
```

## 4. Performance Optimizations

### Issue: Inefficient Rendering in HomeScreen
The HomeScreen component is large and does not memoize components or values, which could lead to unnecessary rerenders.

### Solution:
Break down the HomeScreen into smaller components and use React.memo and useMemo:

```typescript
// Extract the outfit display section to a separate component
const OutfitDisplay = React.memo(({ outfit }: { outfit: typeof mockOutfit }) => {
  return (
    <View style={styles.outfitContent}>
      {/* Outfit content here */}
    </View>
  );
});

// Use useMemo for computed values
const temperature = useMemo(() => {
  return weatherData ? convertTemperature(weatherData.temperature, temperatureUnit) : '--';
}, [weatherData, temperatureUnit]);
```

### Issue: Rate Limiting Logic Uses In-Memory Array
The rate limiting in `useWeather.ts` uses an in-memory array that resets when the app restarts.

```typescript
// Keep track of API calls
let apiCallsTimestamps: number[] = [];

const isRateLimited = () => {
  const now = Date.now();
  // Remove timestamps older than 1 minute
  apiCallsTimestamps = apiCallsTimestamps.filter(
    timestamp => now - timestamp < RATE_LIMIT_WINDOW
  );
  return apiCallsTimestamps.length >= MAX_CALLS_PER_MINUTE;
};
```

### Solution:
Use AsyncStorage to persist rate limiting information across app restarts:

```typescript
const RATE_LIMIT_KEY = '@weather_rate_limit';

const isRateLimited = async (): Promise<boolean> => {
  try {
    const now = Date.now();
    const storedData = await AsyncStorage.getItem(RATE_LIMIT_KEY);
    let timestamps: number[] = storedData ? JSON.parse(storedData) : [];

    // Remove timestamps older than the rate limit window
    timestamps = timestamps.filter(timestamp => now - timestamp < RATE_LIMIT_WINDOW);

    // Update storage with current timestamps
    await AsyncStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(timestamps));

    return timestamps.length >= MAX_CALLS_PER_MINUTE;
  } catch (error) {
    console.warn('Error checking rate limit:', error);
    return false; // Default to not rate limited on error
  }
};

// Modify the fetchWeather function to use this async version
// ...
if (await isRateLimited()) {
  // Handle rate limiting
}
// ...
```

## 5. Code Organization and Style

### Issue: Inconsistent File Structure
Some files have multiple exports while others have a single default export, making imports inconsistent.

### Solution:
Standardize on a consistent export pattern:

```typescript
// Prefer named exports for utility functions and types
export interface WeatherData { /* ... */ }
export const getCurrentWeather = async () => { /* ... */ };

// Use default exports for React components and hooks
const useWeather = () => { /* ... */ };
export default useWeather;
```

### Issue: Inline Styles in HomeScreen
The HomeScreen has a large StyleSheet object with over 80 styles, making it hard to maintain.

### Solution:
Extract styles into separate themed style files:

1. Create component-specific style files:
```typescript
// src/styles/homeScreenStyles.ts
import { StyleSheet } from 'react-native';
import { Theme } from './theme';

export const createHomeScreenStyles = (theme: Theme) => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.colors.background },
  // Other styles...
});
```

2. Use the styles in the component:
```typescript
// In HomeScreen.tsx
const HomeScreen: React.FC = () => {
  const { theme } = useTheme();
  const styles = useMemo(() => createHomeScreenStyles(theme), [theme]);

  // Component logic...
};
```

## 6. Navigation and UX Improvements

### Issue: Limited Typed Navigation
The navigation is using a basic stack navigator without fully utilizing React Navigation's type safety.

### Solution:
Enhance the navigation types and use them consistently:

```typescript
// In AppNavigator.tsx
export type RootStackParamList = {
  Home: undefined;
  Settings: undefined;
  Location: { returnTo?: keyof RootStackParamList };
  Account: undefined;
  WeatherDetails: { date: string };
};

// Using the typed navigation in components
const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

// Navigate with type checking
navigation.navigate('Location', { returnTo: 'Home' });
```

### Issue: Missing Loading and Error States
The UI doesn't always clearly communicate loading and error states.

### Solution:
Add consistent loading and error components:

```typescript
// Create a LoadingOverlay component
const LoadingOverlay: React.FC = () => (
  <View style={styles.loadingOverlay}>
    <ActivityIndicator size="large" color="#000" />
    <Text style={styles.loadingText}>Loading weather data...</Text>
  </View>
);

// Create an ErrorMessage component
const ErrorMessage: React.FC<{ message: string; onRetry?: () => void }> = ({ message, onRetry }) => (
  <View style={styles.errorContainer}>
    <Ionicons name="alert-circle-outline" size={40} color="#e74c3c" />
    <Text style={styles.errorText}>{message}</Text>
    {onRetry && (
      <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
        <Text style={styles.retryButtonText}>Try Again</Text>
      </TouchableOpacity>
    )}
  </View>
);

// Use in screens
{isLoading && <LoadingOverlay />}
{error && <ErrorMessage message={error} onRetry={() => refetch()} />}
```

## 7. Type Definitions and TypeScript Improvements

### Issue: Missing Types for Some Objects
Some objects like `mockOutfit` lack proper TypeScript interfaces.

### Solution:
Create comprehensive type definitions:

```typescript
// In types/clothing.ts
export interface ClothingItem {
  id: string;
  name: string;
  category: 'top' | 'bottoms' | 'outerwear' | 'shoes' | 'accessory';
  imageUri: string;
  weather_min_temp?: number;
  weather_max_temp?: number;
  weather_conditions?: string[];
}

export interface Outfit {
  top: any;  // Replace 'any' with proper image type
  bottoms: any;
  outerwear: any;
  shoes: any;
  accessory: any;
}

// In HomeScreen.tsx
import { Outfit } from '../types/clothing';

const mockOutfit: Outfit = {
  top: require('../assets/mock/top.png'),
  outerwear: require('../assets/mock/outerwear.png'),
  bottoms: require('../assets/mock/bottoms.png'),
  shoes: require('../assets/mock/shoes.png'),
  accessory: require('../assets/mock/accessory.png'),
};
```

### Issue: Inconsistent Type Usage
Some functions return `any` or don't fully utilize TypeScript features.

### Solution:
Use more precise types and avoid `any` where possible:

```typescript
// Before
const loadSavedLocation = async () => {
  const savedLocation = await getLocation();
  if (savedLocation) {
    setLocation(savedLocation);
  }
};

// After
const loadSavedLocation = async (): Promise<void> => {
  const savedLocation = await getLocation();
  if (savedLocation) {
    setLocation(savedLocation);
  }
};
```

## 8. Clothing Recommendation Algorithm

### Issue: Missing Clothing Recommendation Logic
The app currently displays mock clothing data but lacks an actual recommendation algorithm based on weather.

### Solution:
Implement a basic temperature-based clothing recommendation algorithm:

```typescript
// In src/services/clothingService.ts
import { ClothingItem, Outfit } from '../types/clothing';
import { TEMP_THRESHOLDS } from '../utils/constants';
import { WeatherData } from './weatherService';

export const recommendOutfit = (
  weatherData: WeatherData,
  availableClothing: ClothingItem[] = []
): Outfit => {
  const { temperature } = weatherData;

  // Default to mock images if no clothing is available
  const defaultOutfit: Outfit = {
    top: require('../assets/mock/top.png'),
    bottoms: require('../assets/mock/bottoms.png'),
    outerwear: require('../assets/mock/outerwear.png'),
    shoes: require('../assets/mock/shoes.png'),
    accessory: require('../assets/mock/accessory.png'),
  };

  if (!availableClothing.length) {
    return defaultOutfit;
  }

  // Simple temperature-based filtering
  const recommendedClothing: Partial<Record<keyof Outfit, ClothingItem>> = {};

  // Filter by temperature range and choose one item from each category
  ['top', 'bottoms', 'outerwear', 'shoes', 'accessory'].forEach(category => {
    const suitable = availableClothing.filter(item =>
      item.category === category &&
      (item.weather_min_temp === undefined || temperature >= item.weather_min_temp) &&
      (item.weather_max_temp === undefined || temperature <= item.weather_max_temp)
    );

    if (suitable.length) {
      // Choose a random item from suitable options
      // In a real app, this would have more sophisticated selection logic
      const randomIndex = Math.floor(Math.random() * suitable.length);
      recommendedClothing[category as keyof Outfit] = suitable[randomIndex];
    }
  });

  // Convert to the expected outfit format
  const outfit: Outfit = {
    top: recommendedClothing.top?.imageUri || defaultOutfit.top,
    bottoms: recommendedClothing.bottoms?.imageUri || defaultOutfit.bottoms,
    outerwear: recommendedClothing.outerwear?.imageUri || defaultOutfit.outerwear,
    shoes: recommendedClothing.shoes?.imageUri || defaultOutfit.shoes,
    accessory: recommendedClothing.accessory?.imageUri || defaultOutfit.accessory,
  };

  return outfit;
};
```

## 9. Miscellaneous Improvements

### Issue: Time of Day Range Error
The `TIME_RANGES` constants have an error where the EVENING range extends to hour 4, which overlaps with MORNING:

```typescript
export const TIME_RANGES = {
  MORNING: { start: 5, end: 11 },
  AFTERNOON: { start: 12, end: 16 },
  EVENING: { start: 17, end: 4 }
};
```

### Solution:
Fix the time ranges to properly represent 24-hour periods:

```typescript
export const TIME_RANGES = {
  MORNING: { start: 5, end: 11 },
  AFTERNOON: { start: 12, end: 16 },
  EVENING: { start: 17, end: 23 },
  NIGHT: { start: 0, end: 4 }
};

// Then update the getTimeOfDay function to include NIGHT
const getTimeOfDay = (): 'morning' | 'afternoon' | 'evening' | 'night' => {
  const hour = new Date().getHours();

  if (hour >= TIME_RANGES.MORNING.start && hour <= TIME_RANGES.MORNING.end) {
    return 'morning';
  } else if (hour >= TIME_RANGES.AFTERNOON.start && hour <= TIME_RANGES.AFTERNOON.end) {
    return 'afternoon';
  } else if (hour >= TIME_RANGES.EVENING.start && hour <= TIME_RANGES.EVENING.end) {
    return 'evening';
  } else {
    return 'night';
  }
};
```

### Issue: Unused Web Platform Polyfill
In App.tsx, there's a web platform polyfill that doesn't seem to do anything:

```typescript
// Web platform polyfill for AsyncStorage
if (Platform.OS === 'web') {
  require('react-native-web');
}
```

### Solution:
Either properly implement the web polyfill or remove the unnecessary code:

```typescript
// Web platform polyfill for AsyncStorage
if (Platform.OS === 'web') {
  // Import the actual AsyncStorage polyfill for web
  require('@react-native-async-storage/async-storage/lib/commonjs/web/index');
}
```

### Issue: Mock Data Usage in Production Code
The app uses mock data in production code paths, which should be replaced with real implementations.

### Solution:
Move all mock data to the `__mocks__` directory and only use it during development:

```typescript
// In weatherService.ts
export const getWeatherData = async (location: string): Promise<WeatherData> => {
  if (__DEV__ && process.env.USE_MOCK_DATA === 'true') {
    // Only use mock data in development when explicitly enabled
    return require('../__mocks__/weatherData').mockWeatherData;
  }

  // Otherwise use the real API
  return getCurrentWeather(location);
};
```

## Next Steps for Implementation

1. **Short-term fixes:**
   - Fix the `TIME_RANGES` constants and `getTimeOfDay` function
   - Implement proper error handling in the weather hook
   - Add cached data indicators to the UI
   - Extract large components into smaller, more manageable pieces

2. **Medium-term improvements:**
   - Create the outfit recommendation algorithm
   - Implement the forecast processing logic
   - Move API keys to environment variables
   - Improve TypeScript types throughout the app

3. **Long-term enhancements:**
   - Refactor styles into themed style files
   - Add comprehensive loading and error states
   - Implement proper AsyncStorage persistence for rate limiting
   - Set up more robust test coverage
