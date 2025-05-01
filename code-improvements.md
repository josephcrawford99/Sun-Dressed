# Sun Dressed App Code Improvements

## Project Overview
Sun Dressed (formerly Climate Closet) is a React Native application built with Expo that provides weather-based clothing recommendations. The app currently functions with `npm run web` but has several areas for improvement.

## Implementation Priority
1. **Critical Issues** - Joey's suggestions (Dev header login/logout, uniform styling)
2. **Core Functionality** - Weather Service implementation
3. **Code Quality** - Organization, TypeScript, and error handling
4. **Performance** - Optimizations and improved loading states

## File Structure Reference
Key files referenced in these improvements:
- `/src/components/DevClearDataHeader.tsx` - Dev header component
- `/src/styles/theme.ts` - Theme and styling constants
- `/src/services/weatherService.ts` - Weather API integration
- `/src/utils/constants.ts` - Application constants including TIME_RANGES

For complete structure, see STRUCTURE.md

## Joey's Suggestions (P0 - Critical)

### 1. Dev Header Authentication Buttons
**File path:** `/src/components/DevClearDataHeader.tsx`

Extend the existing DevClearDataHeader to include login/logout functionality:

```
// Add these imports
import { signIn, signOut } from '../services/authService';

// Add these buttons to the DevClearDataHeader component

  {/* Existing clear data button */}

  {/* Add dev login button */}
   signIn('josephcrawford99@gmail.com', 'asdfgh')}
  >
    Dev Login


  {/* Add logout button */}
   signOut()}
  >
    Logout


```

Implement the required auth service functions:

**File path:** `/src/services/authService.ts`
```
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../contexts/AuthContext'; // Ensure this exists

export const signIn = async (email: string, password: string) => {
  // Normally would validate credentials with API
  // For dev purposes, just simulate successful login
  const userData = {
    email,
    isAuthenticated: true,
    lastLogin: new Date().toISOString()
  };

  await AsyncStorage.setItem('@auth_data', JSON.stringify(userData));

  // If using AuthContext, update the context
  const { setUser } = useAuth();
  if (setUser) {
    setUser(userData);
  }

  return userData;
};

export const signOut = async () => {
  await AsyncStorage.removeItem('@auth_data');

  // If using AuthContext, update the context
  const { setUser } = useAuth();
  if (setUser) {
    setUser(null);
  }
};
```

### 2. Uniform Button and Text Field Styling
**File path:** `/src/styles/theme.ts` and component files

#### Step 1: Define consistent button styles in theme.ts
```
// Add to theme.ts
export const buttonStyles = {
  primary: {
    backgroundColor: colors.primary,
    textColor: colors.white,
  },
  secondary: {
    backgroundColor: colors.white,
    textColor: colors.black,
  },
  tertiary: {
    backgroundColor: colors.yellow, // Use sparingly for small elements only
    textColor: colors.white,
  },
};

export const inputStyles = {
  standard: {
    backgroundColor: colors.white,
    textColor: colors.black,
    borderColor: colors.lightGray,
  },
};
```

#### Step 2: Create reusable button component
**File path:** `/src/components/Button.tsx`
```
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { buttonStyles, colors } from '../styles/theme';

type ButtonType = 'primary' | 'secondary' | 'tertiary';

interface ButtonProps {
  title: string;
  onPress: () => void;
  type?: ButtonType;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
}

const Button: React.FC = ({
  title,
  onPress,
  type = 'primary',
  style,
  textStyle,
  disabled = false,
}) => {
  const buttonStyle = buttonStyles[type];

  return (


        {title}


  );
};

const styles = StyleSheet.create({
  button: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
  },
  text: {
    fontWeight: '600',
    fontSize: 16,
  },
  disabled: {
    opacity: 0.6,
  },
});

export default Button;
```

#### Step 3: Standardize input components
**File path:** `/src/components/TextInput.tsx`
```
import React from 'react';
import { TextInput as RNTextInput, StyleSheet, View, Text, ViewStyle } from 'react-native';
import { inputStyles, colors } from '../styles/theme';

interface TextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  label?: string;
  secureTextEntry?: boolean;
  style?: ViewStyle;
  error?: string;
}

const TextInput: React.FC = ({
  value,
  onChangeText,
  placeholder,
  label,
  secureTextEntry = false,
  style,
  error,
}) => {
  return (

      {label && {label}}

      {error && {error}}

  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  label: {
    marginBottom: 5,
    fontWeight: '500',
    color: colors.black,
  },
  input: {
    backgroundColor: inputStyles.standard.backgroundColor,
    color: inputStyles.standard.textColor,
    borderColor: inputStyles.standard.borderColor,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: 5,
  },
});

export default TextInput;
```

#### Step 4: Update all instances in codebase
**Testing steps to verify implementation:**
1. Identify all button implementations
2. Replace custom buttons with the standardized Button component
3. Replace input fields with the standardized TextInput component
4. Confirm visual consistency across login, settings, and main screens

### 3. Expo Tunnel Configuration for iOS Testing
**File path:** `package.json`

Update the package.json scripts to include tunnel options:

```
"scripts": {
  "start": "expo start",
  "web": "expo start --web",
  "tunnel": "expo start --tunnel",
  "android": "expo start --android",
  "ios": "expo start --ios"
}
```

**Additional configuration:**
- Ensure the Expo SDK is at a compatible version (SDK 46+)
- Verify expo-cli is installed globally: `npm install -g expo-cli`
- For more reliable tunneling, install ngrok: `npm install ngrok`

**Testing steps:**
1. Run `npm run tunnel`
2. Scan the QR code with Expo Go app on iOS
3. Verify app loads correctly on device
```

## Weather Service Improvements (High Priority)

```markdown
## Weather Service Improvements (P1 - High Priority)

### 1. Complete Weather Service Implementation
**File path:** `/src/services/weatherService.ts`

Fix the incomplete implementation of the `getForecast` method:

```
export const getForecast = async (location: string): Promise => {
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
    const forecastByDay: Record = {};

    // Group forecast data by day
    forecastList.forEach((item: any) => {
      const date = new Date(item.dt * 1000);
      const dateStr = date.toISOString().split('T');

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

// Add helper functions for forecast processing
const findClosestForecast = (forecasts: any[], targetHour: number): any => {
  return forecasts.reduce((closest, current) => {
    const currentHour = new Date(current.dt * 1000).getHours();
    const closestHour = closest ? new Date(closest.dt * 1000).getHours() : -1;

    const currentDiff = Math.abs(currentHour - targetHour);
    const closestDiff = closest ? Math.abs(closestHour - targetHour) : Infinity;

    return currentDiff  {
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
    description: forecastItem.weather.description,
    icon: forecastItem.weather.icon,
    wind_speed: forecastItem.wind.speed
  };
};
```

### 2. Fix TIME_RANGES constant
**File path:** `/src/utils/constants.ts`

The current TIME_RANGES has a logical error where EVENING extends to hour 4, overlapping with MORNING:

```
// Current problematic implementation
export const TIME_RANGES = {
  MORNING: { start: 5, end: 11 },
  AFTERNOON: { start: 12, end: 16 },
  EVENING: { start: 17, end: 4 }
};

// Corrected implementation
export const TIME_RANGES = {
  MORNING: { start: 5, end: 11 },
  AFTERNOON: { start: 12, end: 16 },
  EVENING: { start: 17, end: 23 },
  NIGHT: { start: 0, end: 4 }
};

// Update getTimeOfDay function in timeService.ts
export const getTimeOfDay = (): 'morning' | 'afternoon' | 'evening' | 'night' => {
  const hour = new Date().getHours();

  if (hour >= TIME_RANGES.MORNING.start && hour = TIME_RANGES.AFTERNOON.start && hour = TIME_RANGES.EVENING.start && hour  => {
  try {
    // Try to get from cache first
    const cachedData = await getCachedWeather(location);
    const now = Date.now();

    // If we have valid cached data that's not expired, use it
    if (cachedData && (now - cachedData.timestamp)  => {
  try {
    const cacheData = {
      data,
      timestamp: Date.now()
    };
    await AsyncStorage.setItem(`${WEATHER_CACHE_KEY}${location}`, JSON.stringify(cacheData));
  } catch (error) {
    console.error('Failed to cache weather data', error);
  }
};

const getCachedWeather = async (location: string): Promise => {
  try {
    const cachedData = await AsyncStorage.getItem(`${WEATHER_CACHE_KEY}${location}`);
    if (cachedData) {
      return JSON.parse(cachedData);
    }
    return null;
  } catch (error) {
    console.error('Failed to get cached weather data', error);
    return null;
  }
};

// Implement similar caching for forecast data
// ...
```

**Testing steps:**
1. Call getCurrentWeatherWithCache with a valid location
2. Verify API call is made and data is returned
3. Call again with same location and verify no API call is made
4. Turn on airplane mode and call again to verify cached data is returned
```

## Code Organization and Style (High Priority)

```markdown
## Code Organization and Style (P1 - High Priority)

### 1. Extract Styles to Themed Style Files
**File path:** Create `/src/styles/componentStyles/` directory for component-specific styles

#### Step 1: Create base style creator function
**File path:** `/src/styles/styleCreator.ts`
```
import { StyleSheet } from 'react-native';
import { Theme } from './theme';

export const createStyles = >(
  theme: Theme,
  styleFunction: (theme: Theme) => T
): T => {
  return StyleSheet.create(styleFunction(theme));
};
```

#### Step 2: Create component-specific style files
**File path:** `/src/styles/componentStyles/homeScreenStyles.ts`
```
import { StyleSheet } from 'react-native';
import { Theme } from '../theme';
import { createStyles } from '../styleCreator';

export const createHomeScreenStyles = (theme: Theme) =>
  createStyles(theme, (theme) => ({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      paddingHorizontal: 20,
      paddingTop: theme.spacing.large,
      paddingBottom: theme.spacing.medium,
    },
    weatherDisplay: {
      marginVertical: theme.spacing.medium,
    },
    // Additional styles...
  }));
```

#### Step 3: Use the styles in components
**File path:** Update component files to use the themed styles
```
// In HomeScreen.tsx
import { createHomeScreenStyles } from '../styles/componentStyles/homeScreenStyles';
import { useTheme } from '../utils/ThemeContext';

const HomeScreen: React.FC = () => {
  const { theme } = useTheme();
  const styles = useMemo(() => createHomeScreenStyles(theme), [theme]);

  return (

      {/* Component JSX */}

  );
};
```

### 2. Standardize Export Patterns
**File path:** All service and utility files

Follow this export pattern across the codebase:

```
// For utility functions and types - use named exports
export interface WeatherData { /* ... */ }
export const getCurrentWeather = async () => { /* ... */ };

// For React components and hooks - use default exports
const useWeather = () => { /* ... */ };
export default useWeather;
```

Create a lint rule or document this pattern for consistency.

### 3. Break Down Large Components
**File path:** `/src/screens/HomeScreen.tsx`

Extract sections of HomeScreen into separate components:

```
// In separate files in /src/components/
export const WeatherSummary: React.FC = ({ weatherData }) => {
  // Weather summary section
};

export const ClothingRecommendation: React.FC = ({ outfit }) => {
  // Clothing recommendation section
};

// In HomeScreen.tsx
import { WeatherSummary } from '../components/WeatherSummary';
import { ClothingRecommendation } from '../components/ClothingRecommendation';

const HomeScreen: React.FC = () => {
  // State and hooks...

  return (



      {isLoading ? (

      ) : error ? (

      ) : (
        <>




      )}

  );
};
```

**Testing steps:**
1. Verify HomeScreen renders all extracted components
2. Test each component in isolation
3. Verify screen behavior is unchanged after refactoring
```

## Type Definitions and TypeScript Improvements (High Priority)

```markdown
## Type Definitions and TypeScript Improvements (P1 - High Priority)

### 1. Create Comprehensive Type Definitions
**File path:** Create `/src/types/` directory with domain-specific type files

#### Step 1: Create clothing.ts types
**File path:** `/src/types/clothing.ts`
```
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
```

#### Step 2: Create weather.ts types
**File path:** `/src/types/weather.ts`
```
export interface WeatherData {
  temperature: number;
  feels_like: number;
  humidity: number;
  wind_speed: number;
  description: string;
  icon: string;
}

export interface DailyForecast {
  date: string;
  morning: WeatherData;
  afternoon: WeatherData;
  evening: WeatherData;
}

export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

export type WeatherErrorCode =
  | 'NETWORK_ERROR'
  | 'INVALID_API_KEY'
  | 'LOCATION_NOT_FOUND'
  | 'RATE_LIMIT'
  | 'UNKNOWN_ERROR';

export class WeatherError extends Error {
  code: WeatherErrorCode;

  constructor(message: string, code: WeatherErrorCode) {
    super(message);
    this.code = code;
    this.name = 'WeatherError';
  }
}
```

#### Step 3: Create navigation types
**File path:** `/src/types/navigation.ts`
```
export type RootStackParamList = {
  Home: undefined;
  Settings: undefined;
  Location: { returnTo?: keyof RootStackParamList };
  Account: undefined;
  WeatherDetails: { date: string };
};
```

### 2. Replace 'any' Types
**File paths:** Throughout the codebase

Create a systematic approach to eliminate 'any' types:

1. Identify 'any' types with a search: `grep -r "any" --include="*.ts" --include="*.tsx" ./src`
2. Replace with proper types, starting with API response handling:

```
// Before
const response = await axios.get(`${WEATHER_API.BASE_URL}/weather`);

// After
interface OpenWeatherResponse {
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  weather: Array;
  wind: {
    speed: number;
  };
  dt: number;
  name: string;
}

const response = await axios.get(`${WEATHER_API.BASE_URL}/weather`);
```

### 3. Use TypeScript Utility Types

Apply TypeScript utility types for more precise type definitions:

```
// Use Partial for optional updates
function updateUserPreferences(userId: string, updates: Partial): Promise {
  // Implementation
}

// Use Pick to create derived types
type LocationFields = Pick;

// Use Omit to exclude properties
type PublicUserData = Omit;

// Use Record for object maps
const weatherIconMap: Record = {
  '01d': require('../assets/weather/clear-day.png'),
  '01n': require('../assets/weather/clear-night.png'),
  // More mappings...
};
```

### 4. Add Type Guards
**File path:** Various service files

Implement type guards for API responses and error handling:

```
// In weatherService.ts
function isWeatherResponse(data: any): data is OpenWeatherResponse {
  return (
    data &&
    typeof data === 'object' &&
    'main' in data &&
    'weather' in data &&
    Array.isArray(data.weather)
  );
}

// In error handling
export function isWeatherError(error: unknown): error is WeatherError {
  return error instanceof WeatherError;
}

// Usage
try {
  // API call
} catch (error: unknown) {
  if (isWeatherError(error)) {
    // Handle weather-specific errors
    if (error.code === 'LOCATION_NOT_FOUND') {
      // Handle location error
    }
  } else if (axios.isAxiosError(error)) {
    // Handle network errors
  } else {
    // Handle unknown errors
  }
}
```

**Testing steps:**
1. Run TypeScript compiler to verify no type errors
2. Verify intellisense/autocomplete works correctly with new types
3. Test error handling with various error scenarios
```

## Industry-Standard Error Handling (Medium Priority)

```markdown
## Industry-Standard Error Handling (P2 - Medium Priority)

### 1. Implement Toast Notifications
**File path:** Create `/src/components/ToastNotification.tsx`

```
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../styles/theme';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose?: () => void;
  visible: boolean;
}

const ToastNotification: React.FC = ({
  message,
  type = 'info',
  duration = 3000,
  onClose,
  visible,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const getIconName = () => {
    switch (type) {
      case 'success': return 'checkmark-circle';
      case 'error': return 'alert-circle';
      case 'warning': return 'warning';
      default: return 'information-circle';
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'success': return colors.success;
      case 'error': return colors.error;
      case 'warning': return colors.warning;
      default: return colors.info;
    }
  };

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      timeout = setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          if (onClose) onClose();
        });
      }, duration);
    }

    return () => clearTimeout(timeout);
  }, [visible, duration, fadeAnim, onClose]);

  if (!visible) return null;

  return (


      {message}




  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  message: {
    color: 'white',
    fontSize: 16,
    flex: 1,
    marginHorizontal: 10,
  },
});

export default ToastNotification;
```

### 2. Create Toast Context Provider
**File path:** Create `/src/contexts/ToastContext.tsx`

```
import React, { createContext, useContext, useState, ReactNode } from 'react';
import ToastNotification from '../components/ToastNotification';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastContextProps {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
  hideToast: () => void;
}

const ToastContext = createContext(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC = ({ children }) => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState('info');
  const [duration, setDuration] = useState(3000);

  const showToast = (newMessage: string, newType: ToastType = 'info', newDuration: number = 3000) => {
    setMessage(newMessage);
    setType(newType);
    setDuration(newDuration);
    setVisible(true);
  };

  const hideToast = () => {
    setVisible(false);
  };

  return (

      {children}


  );
};
```

### 3. Create Error Boundary Component
**File path:** Create `/src/components/ErrorBoundary.tsx`

```
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../styles/theme';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to error reporting service
    console.error('Error boundary caught error:', error, errorInfo);

    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (


          Something went wrong

            {this.state.error?.message || 'An unexpected error occurred'}


            Try Again


      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: colors.text,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: colors.textSecondary,
  },
  button: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ErrorBoundary;
```

### 4. Implement Centralized Error Handling
**File path:** Create `/src/utils/errorHandler.ts`

```
import { AxiosError } from 'axios';
import { WeatherError } from '../types/weather';

// Error types
export type NetworkErrorType =
  | 'NETWORK_ERROR'
  | 'TIMEOUT_ERROR'
  | 'SERVER_ERROR'
  | 'CONNECTION_ERROR';

export type AppErrorType =
  | 'AUTH_ERROR'
  | 'VALIDATION_ERROR'
  | 'PERMISSION_ERROR'
  | 'NOT_FOUND_ERROR';

export interface AppError {
  message: string;
  code: string;
  originalError?: unknown;
  userFriendlyMessage: string;
}

// Error mappers
export function mapNetworkError(error: unknown): AppError {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return {
        message: 'Network error. Please check your connection.',
        code: 'NETWORK_ERROR',
        originalError: error,
        userFriendlyMessage: 'Unable to connect to the server. Please check your internet connection and try again.',
      };
    }

    const status = error.response.status;

    if (status >= 500) {
      return {
        message: `Server error: ${status}`,
        code: 'SERVER_ERROR',
        originalError: error,
        userFriendlyMessage: 'Our server is experiencing issues. Please try again later.',
      };
    }

    if (status === 404) {
      return {
        message: 'Resource not found',
        code: 'NOT_FOUND_ERROR',
        originalError: error,
        userFriendlyMessage: 'The requested information could not be found.',
      };
    }

    if (status === 401 || status === 403) {
      return {
        message: 'Authentication failed',
        code: 'AUTH_ERROR',
        originalError: error,
        userFriendlyMessage: 'Please log in again to continue.',
      };
    }
  }

  // Default generic error
  return {
    message: error instanceof Error ? error.message : 'Unknown error',
    code: 'UNKNOWN_ERROR',
    originalError: error,
    userFriendlyMessage: 'Something went wrong. Please try again.',
  };
}

export function mapWeatherError(error: unknown): AppError {
  if (error instanceof WeatherError) {
    switch (error.code) {
      case 'INVALID_API_KEY':
        return {
          message: 'Invalid weather API key',
          code: error.code,
          originalError: error,
          userFriendlyMessage: 'We\'re having trouble connecting to our weather service. Please try again later.',
        };
      case 'LOCATION_NOT_FOUND':
        return {
          message: error.message,
          code: error.code,
          originalError: error,
          userFriendlyMessage: 'We couldn\'t find that location. Please check the spelling and try again.',
        };
      case 'RATE_LIMIT':
        return {
          message: 'Too many weather requests',
          code: error.code,
          originalError: error,
          userFriendlyMessage: 'You\'ve made too many requests. Please wait a moment and try again.',
        };
      default:
        return {
          message: error.message,
          code: error.code,
          originalError: error,
          userFriendlyMessage: 'We\'re having trouble getting the weather right now. Please try again later.',
        };
    }
  }

  return mapNetworkError(error);
}

// Usage examples
export function handleError(error: unknown, errorMapper = mapNetworkError): AppError {
  const appError = errorMapper(error);

  // Log the error (could be sent to a service like Sentry)
  console.error(`[ERROR] ${appError.code}: ${appError.message}`, appError.originalError);

  return appError;
}
```

### 5. Implement in App Component
**File path:** Update `App.tsx` to include error handling providers

```
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { ThemeProvider } from './src/utils/ThemeContext';
import { SettingsProvider } from './src/contexts/SettingsContext';
import { ToastProvider } from './src/contexts/ToastContext';
import ErrorBoundary from './src/components/ErrorBoundary';

export default function App() {
  return (













  );
}
```

**Testing steps:**
1. Test error boundary by intentionally causing errors
2. Verify toast notifications work for API errors
3. Test offline behavior with error handling
4. Verify user-friendly messages are displayed
```

## Testing Framework (Medium Priority)

```markdown
## Testing Framework (P2 - Medium Priority)

### 1. Set Up Jest Testing Environment
**File path:** Update or create `jest.config.js` in the project root

```
module.exports = {
  preset: 'jest-expo',
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native|react-clone-referenced-element|@react-navigation|expo(nent)?|@expo(nent)?/.*|react-navigation|@react-navigation/.*|@unimodules/.*|sentry-expo|native-base)'
  ],
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect', './jest.setup.js'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/__tests__/**',
    '!src/__mocks__/**',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};
```

### 2. Create Jest Setup File
**File path:** Create `jest.setup.js` in the project root

```
import 'react-native-gesture-handler/jestSetup';
import { NativeModules } from 'react-native';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
}));

// Mock Expo components
jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  getCurrentPositionAsync: jest.fn(() =>
    Promise.resolve({ coords: { latitude: 37.7749, longitude: -122.4194 } })
  ),
}));

// Mock navigation
jest.mock('@react-navigation/native', () => {
  return {
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
    }),
    useRoute: () => ({
      params: {},
    }),
  };
});

// Silence console.error for React Navigation
console.error = jest.fn();
```

### 3. Create Example Tests for Components
**File path:** Create `/src/__tests__/components/WeatherDisplay.test.tsx`

```
import React from 'react';
import { render, screen } from '@testing-library/react-native';
import WeatherDisplay from '../../components/WeatherDisplay';
import { WeatherData } from '../../types/weather';

// Mock data
const mockWeatherData: WeatherData = {
  temperature: 25,
  feels_like: 27,
  humidity: 60,
  wind_speed: 5,
  description: 'clear sky',
  icon: '01d',
};

describe('WeatherDisplay', () => {
  it('renders correctly with weather data', () => {
    render();

    expect(screen.getByText('25°')).toBeTruthy();
    expect(screen.getByText('clear sky')).toBeTruthy();
    expect(screen.getByText('Feels like: 27°')).toBeTruthy();
  });

  it('displays the correct weather icon', () => {
    render();

    const icon = screen.getByTestId('weather-icon');
    expect(icon.props.source).toBeDefined();
  });

  it('shows loading state when no data provided', () => {
    render();

    expect(screen.getByTestId('loading-indicator')).toBeTruthy();
  });

  it('shows error message when error occurs', () => {
    render(

    );

    expect(screen.getByText('Failed to load weather data')).toBeTruthy();
  });
});
```

### 4. Create Example Tests for Services
**File path:** Create `/src/__tests__/services/weatherService.test.ts`

```
import axios from 'axios';
import { getCurrentWeather, WeatherError } from '../../services/weatherService';
import { WEATHER_API } from '../../utils/constants';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked;

describe('weatherService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch current weather successfully', async () => {
    // Mock successful response
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        main: {
          temp: 25,
          feels_like: 27,
          humidity: 60,
        },
        weather: [
          {
            description: 'clear sky',
            icon: '01d',
          },
        ],
        wind: {
          speed: 5,
        },
        dt: 1620000000,
        name: 'New York',
      },
    });

    const result = await getCurrentWeather('New York');

    expect(mockedAxios.get).toHaveBeenCalledWith(
      `${WEATHER_API.BASE_URL}/weather`,
      {
        params: {
          q: 'New York',
          appid: WEATHER_API.KEY,
          units: WEATHER_API.UNITS,
        },
      }
    );

    expect(result).toEqual({
      temperature: 25,
      feels_like: 27,
      humidity: 60,
      description: 'clear sky',
      icon: '01d',
      wind_speed: 5,
    });
  });

  it('should handle location not found error', async () => {
    // Mock 404 error
    mockedAxios.get.mockRejectedValueOnce({
      response: {
        status: 404,
        data: {
          message: 'city not found',
        },
      },
      isAxiosError: true,
    });

    await expect(getCurrentWeather('NonexistentCity')).rejects.toThrow(WeatherError);

    try {
      await getCurrentWeather('NonexistentCity');
    } catch (error) {
      expect(error).toBeInstanceOf(WeatherError);
      expect((error as WeatherError).code).toBe('LOCATION_NOT_FOUND');
    }
  });
});
```

### 5. Create Example Tests for Hooks
**File path:** Create `/src/__tests__/hooks/useWeather.test.tsx`

```
import { renderHook, act } from '@testing-library/react-hooks';
import useWeather from '../../hooks/useWeather';
import * as weatherService from '../../services/weatherService';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock the weatherService
jest.mock('../../services/weatherService');
const mockedWeatherService = weatherService as jest.Mocked;

describe('useWeather', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch weather data on mount', async () => {
    // Mock the getCurrentWeather function
    mockedWeatherService.getCurrentWeather.mockResolvedValueOnce({
      temperature: 25,
      feels_like: 27,
      humidity: 60,
      description: 'clear sky',
      icon: '01d',
      wind_speed: 5,
    });

    // Mock AsyncStorage to return a location
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify({ name: 'New York' }));

    const { result, waitForNextUpdate } = renderHook(() => useWeather());

    // Initial state
    expect(result.current.isLoading).toBe(true);
    expect(result.current.weatherData).toBeUndefined();
    expect(result.current.error).toBeUndefined();

    await waitForNextUpdate();

    // After data is loaded
    expect(result.current.isLoading).toBe(false);
    expect(result.current.weatherData).toEqual({
      temperature: 25,
      feels_like: 27,
      humidity: 60,
      description: 'clear sky',
      icon: '01d',
      wind_speed: 5,
    });
    expect(result.current.error).toBeUndefined();
    expect(mockedWeatherService.getCurrentWeather).toHaveBeenCalledWith('New York');
  });

  it('should handle errors when fetching weather', async () => {
    // Mock getCurrentWeather to throw an error
    const weatherError = new weatherService.WeatherError(
      'Location not found',
      'LOCATION_NOT_FOUND'
    );
    mockedWeatherService.getCurrentWeather.mockRejectedValueOnce(weatherError);

    // Mock AsyncStorage to return a location
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify({ name: 'InvalidCity' }));

    const { result, waitForNextUpdate } = renderHook(() => useWeather());

    await waitForNextUpdate();

    // After error occurs
    expect(result.current.isLoading).toBe(false);
    expect(result.current.weatherData).toBeUndefined();
    expect(result.current.error).toBeDefined();
    expect(result.current.errorType).toBe('location');
  });
});
```

**Testing steps:**
1. Run `npm test` to execute all tests
2. Verify component tests pass
3. Verify service tests pass
4. Verify hook tests pass
5. Check test coverage with `npm test -- --coverage`


## Joey's Suggestions:
- Add a button to the dev header that signs me in as username josephcrawford99@gmail.com with password asdfgh
- Add a button to the dev header that logs me out
- Make the button and text fields have a uniform style so that they are all either black with white text (sign in with apple for example) or white with black text (the email and password text fields for example). They are currently sometimes yellow with white text and I would like to save the yellow tertiary color for other small elements.
- I want this to be able to be opened by a user running current version of expo go on their iphone. This will require an npx run web command with a tunnel command to provide a url that can be opened in the expo go app.
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
