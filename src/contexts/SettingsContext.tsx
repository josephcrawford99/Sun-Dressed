import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define types
type SettingsContextType = {
  temperatureUnit: 'C' | 'F';
  windSpeedUnit: 'ms' | 'mph';
  toggleTemperatureUnit: () => void;
  toggleWindSpeedUnit: () => void;
};

// Create context with undefined initial value
const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

// Provider component
export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [temperatureUnit, setTemperatureUnit] = useState<'C' | 'F'>('C');
  const [windSpeedUnit, setWindSpeedUnit] = useState<'ms' | 'mph'>('ms');

  useEffect(() => {
    // Load saved settings on mount
    const loadSettings = async () => {
      try {
        const savedTempUnit = await AsyncStorage.getItem('temperatureUnit');
        const savedWindUnit = await AsyncStorage.getItem('windSpeedUnit');
        
        if (savedTempUnit) {
          setTemperatureUnit(savedTempUnit as 'C' | 'F');
        }
        
        if (savedWindUnit) {
          setWindSpeedUnit(savedWindUnit as 'ms' | 'mph');
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };
    
    loadSettings();
  }, []);

  const toggleTemperatureUnit = async () => {
    const newUnit = temperatureUnit === 'C' ? 'F' : 'C';
    setTemperatureUnit(newUnit);
    
    try {
      await AsyncStorage.setItem('temperatureUnit', newUnit);
    } catch (error) {
      console.error('Error saving temperature unit:', error);
    }
  };

  const toggleWindSpeedUnit = async () => {
    const newUnit = windSpeedUnit === 'ms' ? 'mph' : 'ms';
    setWindSpeedUnit(newUnit);
    
    try {
      await AsyncStorage.setItem('windSpeedUnit', newUnit);
    } catch (error) {
      console.error('Error saving wind speed unit:', error);
    }
  };

  return (
    <SettingsContext.Provider value={{
      temperatureUnit,
      windSpeedUnit,
      toggleTemperatureUnit,
      toggleWindSpeedUnit,
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

// Custom hook for using settings context
export const useSettings = () => {
  const context = useContext(SettingsContext);
  
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  
  return context;
};