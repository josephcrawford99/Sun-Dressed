export type WeatherCondition = 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'night';

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
}

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
    gradient: ['#FFDE82', '#FF9B71']
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
    gradient: ['#D1D5DB', '#C0C5CE']
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
    gradient: ['#64B6AC', '#5591A9']
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
    gradient: ['#FFFFFF', '#E1E5F2']
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
    gradient: ['#0D1B2A', '#48466D']
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
    animation
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
