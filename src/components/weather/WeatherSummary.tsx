import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WeatherData } from '../../types/weather';
import { WeatherIcon } from '../WeatherIcon';
import { WeatherCode } from '../../utils/weatherIcons';
import { useSettings } from '../../utils/SettingsContext';
import { useTheme } from '../../utils/ThemeContext';
import { createWeatherDisplayStyles } from '../../styles/componentStyles/weatherDisplayStyles';

interface WeatherSummaryProps {
  weatherData: WeatherData;
}

/**
 * A component for displaying a summary of current weather conditions
 */
const WeatherSummary: React.FC<WeatherSummaryProps> = ({ weatherData }) => {
  const { temperatureUnit, windSpeedUnit } = useSettings();
  const { theme } = useTheme();
  const styles = createWeatherDisplayStyles(theme);
  
  // Helper function to convert temperature based on user settings
  const convertTemperature = (celsius: number, unit: 'C' | 'F'): number => {
    if (unit === 'F') {
      return Math.round(celsius * 9/5 + 32);
    }
    return Math.round(celsius);
  };
  
  // Helper function to convert wind speed based on user settings
  const convertWindSpeed = (ms: number, unit: 'ms' | 'mph'): string => {
    if (unit === 'mph') {
      return `${Math.round(ms * 2.237)} mph`;
    }
    return `${ms} m/s`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <WeatherIcon
          weatherCode={weatherData.icon as WeatherCode}
          size={80}
          color={theme.colors.text}
        />
      </View>
      
      <View style={styles.tempContainer}>
        <Text style={styles.temperature}>
          {convertTemperature(weatherData.temperature, temperatureUnit)}
        </Text>
        <Text style={styles.unit}>°{temperatureUnit}</Text>
      </View>
      
      <Text style={styles.description}>{weatherData.description}</Text>
      
      <View style={styles.divider} />
      
      <View style={styles.detailsContainer}>
        <View style={styles.detailItem}>
          <Ionicons name="water-outline" size={20} color={theme.colors.text} />
          <Text style={styles.detailValue}>{weatherData.humidity}%</Text>
          <Text style={styles.detailLabel}>Humidity</Text>
        </View>
        
        <View style={styles.detailItem}>
          <Ionicons name="thermometer-outline" size={20} color={theme.colors.text} />
          <Text style={styles.detailValue}>
            {convertTemperature(weatherData.feels_like, temperatureUnit)}°
          </Text>
          <Text style={styles.detailLabel}>Feels like</Text>
        </View>
        
        <View style={styles.detailItem}>
          <Ionicons name="speedometer-outline" size={20} color={theme.colors.text} />
          <Text style={styles.detailValue}>
            {convertWindSpeed(weatherData.wind_speed, windSpeedUnit)}
          </Text>
          <Text style={styles.detailLabel}>Wind</Text>
        </View>
      </View>
    </View>
  );
};

export default WeatherSummary;
