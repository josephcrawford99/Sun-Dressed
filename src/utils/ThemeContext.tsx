import React, { createContext, useState, useContext, ReactNode } from 'react';
import { createTheme, WeatherCondition } from '../styles/theme';

// Define Theme Context type
interface ThemeContextType {
  theme: ReturnType<typeof createTheme>;
  weatherCondition: WeatherCondition;
  setWeatherCondition: (condition: WeatherCondition) => void;
}

// Create the context with a default value
const ThemeContext = createContext<ThemeContextType>({
  theme: createTheme(),
  weatherCondition: 'sunny',
  setWeatherCondition: () => {}
});

// Provider component
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
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
