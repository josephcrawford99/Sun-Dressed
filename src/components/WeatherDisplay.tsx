import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { WeatherData } from '../services/weatherService';
import { useTheme } from '../utils/ThemeContext';
import { getWeatherIconUrl } from '../utils/weatherUtils';
import { LinearGradient } from 'expo-linear-gradient';

interface WeatherDisplayProps {
  weatherData: WeatherData;
}

const WeatherDisplay: React.FC<WeatherDisplayProps> = ({ weatherData }) => {
  const { theme } = useTheme();
  const { colors, typography, spacing, effects } = theme;

  const localStyles = StyleSheet.create({
    container: {
      borderRadius: effects.borderRadius.medium,
      overflow: 'hidden',
      marginBottom: spacing.lg,
      ...effects.shadow.medium,
    },
    gradient: {
      padding: spacing.lg,
    },
    glass: {
      backgroundColor: colors.surface,
      borderRadius: effects.borderRadius.medium,
      padding: spacing.lg,
      overflow: 'hidden',
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: spacing.md,
    },
    temperatureRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: spacing.md,
    },
    temperatureText: {
      ...typography.weatherDisplay,
      color: colors.text,
      marginRight: spacing.sm,
    },
    feelsLikeText: {
      ...typography.caption,
      color: colors.textSecondary,
    },
    weatherDescription: {
      ...typography.subtitle,
      color: colors.text,
      textTransform: 'capitalize',
      marginBottom: spacing.sm,
    },
    timeText: {
      ...typography.caption,
      color: colors.textSecondary,
    },
    detailsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: spacing.md,
    },
    detailItem: {
      alignItems: 'center',
    },
    detailLabel: {
      ...typography.caption,
      color: colors.textSecondary,
      marginBottom: spacing.xs,
    },
    detailValue: {
      ...typography.body,
      color: colors.text,
      fontWeight: '500',
    },
    iconContainer: {
      marginRight: spacing.md,
    },
    weatherIcon: {
      width: 80,
      height: 80,
      marginRight: spacing.md,
    },
  });

  return (
    <View style={localStyles.container}>
      <LinearGradient colors={colors.gradient} style={localStyles.gradient}>
        <View style={localStyles.glass}>
          <Text style={localStyles.weatherDescription}>
            {weatherData.description}
          </Text>

          <Text style={localStyles.timeText}>
            {weatherData.time_of_day === 'morning' && 'This Morning'}
            {weatherData.time_of_day === 'afternoon' && 'This Afternoon'}
            {weatherData.time_of_day === 'evening' && 'This Evening'}
          </Text>

          <View style={localStyles.temperatureRow}>
            <Image
              source={{ uri: getWeatherIconUrl(weatherData.icon) }}
              style={localStyles.weatherIcon}
            />
            <View>
              <Text style={localStyles.temperatureText}>
                {weatherData.temperature}°C
              </Text>
              <Text style={localStyles.feelsLikeText}>
                Feels like {weatherData.feels_like}°C
              </Text>
            </View>
          </View>

          <View style={localStyles.detailsContainer}>
            <View style={localStyles.detailItem}>
              <Text style={localStyles.detailLabel}>Humidity</Text>
              <Text style={localStyles.detailValue}>{weatherData.humidity}%</Text>
            </View>

            <View style={localStyles.detailItem}>
              <Text style={localStyles.detailLabel}>Wind</Text>
              <Text style={localStyles.detailValue}>{weatherData.wind_speed} m/s</Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

export default WeatherDisplay;
