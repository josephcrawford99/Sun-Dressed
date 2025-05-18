export type WeatherCondition = 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'night';

// Common colors (used across all themes)
export const colors = {
  primary: '#4285F4',
  secondary: '#FFFFFF',
  black: '#000000',
  white: '#FFFFFF',
  yellow: '#FFCC00', // Use sparingly for small elements only
  lightGray: '#E0E0E0',
  error: '#FF3B30',
  success: '#4CAF50',
  warning: '#FF9500',
  info: '#0A84FF',
};

interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  statusBar: 'light' | 'dark';
  gradient: string[];
  error: string;
  success: string;
  warning: string;
  info: string;
}

// Button styles for consistent UI
interface ButtonStyle {
  backgroundColor: string;
  textColor: string;
  borderColor?: string;
  borderWidth?: number;
}

export const buttonStyles: Record<string, ButtonStyle> = {
  primary: {
    backgroundColor: colors.black,
    textColor: colors.white,
  },
  secondary: {
    backgroundColor: colors.white,
    textColor: colors.black,
    borderColor: colors.lightGray,
    borderWidth: 1,
  },
  tertiary: {
    backgroundColor: colors.yellow,
    textColor: colors.white,
  },
  danger: {
    backgroundColor: colors.error,
    textColor: colors.white,
  },
  success: {
    backgroundColor: colors.success,
    textColor: colors.white,
  },
};

// Input styles for text fields
export const inputStyles = {
  standard: {
    backgroundColor: colors.white,
    textColor: colors.black,
    borderColor: colors.lightGray,
    placeholderColor: '#AAAAAA',
    errorColor: colors.error,
  },
  inverted: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    textColor: colors.black,
    borderColor: 'transparent',
    placeholderColor: '#888888',
    errorColor: colors.error,
  },
};

// Weather-specific color palettes
const weatherPalettes: Record<WeatherCondition, ColorPalette> = {
  sunny: {
    primary: '#FFDE82',
    secondary: '#FF9B71',
    accent: '#F4D03F',
    background: '#FFF8E1',
    surface: 'rgba(255, 255, 255, 0.85)',
    text: '#3A3A3A',
    textSecondary: '#666666',
    statusBar: 'dark',
    gradient: ['#FFDE82', '#FF9B71'],
    error: colors.error,
    success: colors.success,
    warning: colors.warning,
    info: colors.info,
  },
  cloudy: {
    primary: '#D1D5DB',
    secondary: '#C0C5CE',
    accent: '#B0BEC5',
    background: '#F5F7FA',
    surface: 'rgba(255, 255, 255, 0.9)',
    text: '#37474F',
    textSecondary: '#607D8B',
    statusBar: 'dark',
    gradient: ['#D1D5DB', '#C0C5CE'],
    error: colors.error,
    success: colors.success,
    warning: colors.warning,
    info: colors.info,
  },
  rainy: {
    primary: '#64B6AC',
    secondary: '#5591A9',
    accent: '#0097A7',
    background: '#E0F7FA',
    surface: 'rgba(255, 255, 255, 0.9)',
    text: '#263238',
    textSecondary: '#455A64',
    statusBar: 'dark',
    gradient: ['#64B6AC', '#5591A9'],
    error: colors.error,
    success: colors.success,
    warning: colors.warning,
    info: colors.info,
  },
  snowy: {
    primary: '#E1E5F2',
    secondary: '#FFFFFF',
    accent: '#D6EAF8',
    background: '#F5F6F8',
    surface: 'rgba(255, 255, 255, 0.92)',
    text: '#2C3E50',
    textSecondary: '#5D6D7E',
    statusBar: 'dark',
    gradient: ['#FFFFFF', '#E1E5F2'],
    error: colors.error,
    success: colors.success,
    warning: colors.warning,
    info: colors.info,
  },
  night: {
    primary: '#0D1B2A',
    secondary: '#48466D',
    accent: '#3F72AF',
    background: '#121B24',
    surface: 'rgba(15, 23, 42, 0.85)',
    text: '#E1E5F2',
    textSecondary: '#B0BEC5',
    statusBar: 'light',
    gradient: ['#0D1B2A', '#48466D'],
    error: colors.error,
    success: colors.success,
    warning: colors.warning,
    info: colors.info,
  }
};

// Typography
const typography = {
  title: {
    fontFamily: 'System',
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitle: {
    fontFamily: 'System',
    fontSize: 18,
    fontWeight: '500',
  },
  body: {
    fontFamily: 'System',
    fontSize: 16,
    fontWeight: 'normal',
  },
  caption: {
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '300',
  },
  // Weather display uses a special font
  weatherDisplay: {
    fontFamily: 'System',
    fontSize: 42,
    fontWeight: 'bold',
  }
};

// Spacing
const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Borders and shadows
const effects = {
  borderRadius: {
    small: 6,
    medium: 12,
    large: 24, // For pill-shaped buttons
  },
  shadow: {
    light: {
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 8,
      shadowOpacity: 0.06,
      elevation: 2,
    },
    medium: {
      shadowOffset: { width: 0, height: 4 },
      shadowRadius: 12,
      shadowOpacity: 0.08,
      elevation: 4,
    }
  },
  glassmorphism: {
    opacity: 0.9,
    blur: 15,
  }
};

// Animation timings
const animation = {
  fast: 150,
  medium: 300,
  slow: 500,
  weatherTransition: 800,
};

// Create theme based on weather condition
export const createTheme = (condition: WeatherCondition = 'sunny') => {
  return {
    colors: weatherPalettes[condition],
    typography,
    spacing,
    effects,
    animation,
    buttonStyles,
    inputStyles,
  };
};

// Helper to determine weather condition from API data
export const getWeatherCondition = (
  description: string,
  icon: string
): WeatherCondition => {
  const isNight = icon.includes('n');

  if (isNight) return 'night';

  if (description.includes('rain') || description.includes('drizzle')) {
    return 'rainy';
  }

  if (description.includes('snow')) {
    return 'snowy';
  }

  if (description.includes('cloud') || description.includes('overcast')) {
    return 'cloudy';
  }

  return 'sunny';
};

// Export a default theme
export type Theme = ReturnType<typeof createTheme>;
export const defaultTheme = createTheme('sunny');
