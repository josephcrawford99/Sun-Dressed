import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { getIoniconForWeather } from '../services/weatherIconService';
import { theme, typography } from '../styles';
import { WeatherDisplay } from '../types/weather';

interface WeatherForecastCardProps {
  weatherDisplayArray?: WeatherDisplay[];
  loading?: boolean;
  error?: string | null;
  location?: string;
}

const WeatherForecastCard: React.FC<WeatherForecastCardProps> = ({ 
  weatherDisplayArray, 
  loading, 
  error,
  location 
}) => {

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading weather forecast...</Text>
        </View>
      </View>
    );
  }

  if (error || !weatherDisplayArray || weatherDisplayArray.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Weather forecast unavailable</Text>
          {error && <Text style={styles.errorDetails}>{error}</Text>}
        </View>
      </View>
    );
  }

  const formatDate = (index: number) => {
    const date = new Date();
    date.setDate(date.getDate() + index);
    const options: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons
          name="calendar-outline"
          size={24}
          color={theme.colors.black}
          style={styles.headerIcon}
        />
        <View style={styles.headerText}>
          <Text style={styles.title}>Weather Forecast</Text>
          <Text style={styles.subtitle}>{location || 'Trip Location'}</Text>
        </View>
      </View>

      {/* Forecast list */}
      <ScrollView 
        style={styles.forecastScroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.forecastContent}
      >
        {weatherDisplayArray.map((weather, index) => (
          <View key={index} style={styles.dayCard}>
            <View style={styles.dateSection}>
              <Text style={styles.dateText}>{formatDate(index)}</Text>
              {index === 0 && <Text style={styles.todayBadge}>Today</Text>}
            </View>
            
            <View style={styles.weatherSection}>
              <Ionicons
                name={getIoniconForWeather(weather.icon)}
                size={32}
                color={theme.colors.black}
                style={styles.weatherIcon}
              />
              
              <View style={styles.tempSection}>
                <Text style={styles.highTemp}>{weather.displayTemp.high}</Text>
                <Text style={styles.lowTemp}>{weather.displayTemp.low}</Text>
              </View>
              
              <View style={styles.detailsSection}>
                <View style={styles.detailItem}>
                  <Ionicons name="rainy-outline" size={16} color={theme.colors.accent} />
                  <Text style={styles.detailText}>{weather.highestChanceOfRain}%</Text>
                </View>
                <View style={styles.detailItem}>
                  <Ionicons name="flag-outline" size={16} color={theme.colors.accent} />
                  <Text style={styles.detailText}>{weather.displayWind.speed} {weather.displayWind.unit}</Text>
                </View>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.lightGray,
    borderRadius: theme.borderRadius.large,
    padding: theme.spacing.lg,
    marginHorizontal: theme.spacing.xs,
    flex: 1,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
  },
  loadingText: {
    ...typography.body,
    color: theme.colors.gray,
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
  },
  errorText: {
    ...typography.subheading,
    color: theme.colors.error,
    textAlign: 'center',
  },
  errorDetails: {
    ...typography.caption,
    textAlign: 'center',
    marginTop: theme.spacing.xs,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray,
  },
  headerIcon: {
    marginRight: theme.spacing.sm,
  },
  headerText: {
    flex: 1,
  },
  title: {
    ...typography.subheading,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    ...typography.caption,
    color: theme.colors.gray,
  },
  forecastScroll: {
    flex: 1,
  },
  forecastContent: {
    paddingBottom: theme.spacing.md,
  },
  dayCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  dateSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  dateText: {
    ...typography.body,
    fontWeight: '600',
  },
  todayBadge: {
    ...typography.caption,
    color: theme.colors.white,
    backgroundColor: theme.colors.black,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.small,
    overflow: 'hidden',
  },
  weatherSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  weatherIcon: {
    marginRight: theme.spacing.md,
  },
  tempSection: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  highTemp: {
    ...typography.heading,
    fontSize: theme.fontSize.xl,
  },
  lowTemp: {
    ...typography.body,
    color: theme.colors.gray,
  },
  detailsSection: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  detailText: {
    ...typography.caption,
    color: theme.colors.gray,
  },
});

export default WeatherForecastCard;