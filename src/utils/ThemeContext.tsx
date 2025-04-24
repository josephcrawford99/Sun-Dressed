import React, { createContext, useState, useContext, ReactNode } from 'react';
import { createTheme, WeatherCondition } from '../styles/theme';

// Define Theme Context type
interface ThemeContextType {
  theme: ReturnType<typeof createTheme>;
  weatherCondition: WeatherCondition;
  setWeatherCondition: (condition: WeatherCondition) => void;
}

// Create the context with a default value
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Provider component
export const ThemeProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [weatherCondition, setWeatherCondition] = useState<WeatherCondition>('sunny');
  const theme = createTheme(weatherCondition);

  return (
    <ThemeContext.Provider value={{ theme, weatherCondition, setWeatherCondition }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook for using the theme context
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
