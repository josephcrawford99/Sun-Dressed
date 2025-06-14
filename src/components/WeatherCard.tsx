import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { getIoniconForWeather } from '../services/weatherIconService';
import { theme } from '../styles';
import { Weather } from '../types/weather';

interface WeatherCardProps {
  weather?: Weather;
  loading?: boolean;
  error?: string | null;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ weather, loading, error }) => {
  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading weather...</Text>
        </View>
      </View>
    );
  }

  if (error || !weather) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Weather unavailable</Text>
          {error && <Text style={styles.errorDetails}>{error}</Text>}
        </View>
      </View>
    );
  }

  const getUVDescription = (uvIndex: number): string => {
    if (uvIndex <= 2) return 'Low';
    if (uvIndex <= 5) return 'Moderate';
    if (uvIndex <= 7) return 'High';
    if (uvIndex <= 10) return 'Very High';
    return 'Extreme';
  };

  const getWindDescription = (speed: number): string => {
    if (speed < 4) return 'Light';
    if (speed < 11) return 'Gentle';
    if (speed < 19) return 'Moderate';
    if (speed < 29) return 'Fresh';
    return 'Strong';
  };

  return (
    <View style={styles.container}>
      {/* Header with location and main condition */}
      <View style={styles.header}>
        <Ionicons
          name={getIoniconForWeather(weather.icon)}
          size={32}
          color={theme.colors.black}
          style={styles.mainIcon}
        />
        <View style={styles.headerText}>
          <Text style={styles.location}>{weather.location}</Text>
          <Text style={styles.condition}>{weather.condition.replace('-', ' ')}</Text>
        </View>
      </View>

      {/* Temperature section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Temperature</Text>
        <View style={styles.tempRow}>
          <View style={styles.tempItem}>
            <Text style={styles.tempValue}>{weather.feelsLikeTemp}°</Text>
            <Text style={styles.tempLabel}>Feels Like</Text>
          </View>
          <View style={styles.tempItem}>
            <Text style={styles.tempValue}>{weather.dailyHighTemp}°</Text>
            <Text style={styles.tempLabel}>High</Text>
          </View>
          <View style={styles.tempItem}>
            <Text style={styles.tempValue}>{weather.dailyLowTemp}°</Text>
            <Text style={styles.tempLabel}>Low</Text>
          </View>
        </View>
      </View>

      {/* Weather details grid */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Details</Text>
        <View style={styles.detailsGrid}>
          <View style={styles.detailItem}>
            <Ionicons name="water" size={20} color={theme.colors.accent} />
            <Text style={styles.detailValue}>{weather.humidity}%</Text>
            <Text style={styles.detailLabel}>Humidity</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Ionicons name="sunny" size={20} color={theme.colors.accent} />
            <Text style={styles.detailValue}>{getUVDescription(weather.uvIndex)}</Text>
            <Text style={styles.detailLabel}>UV Index ({weather.uvIndex})</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Ionicons name="leaf" size={20} color={theme.colors.accent} />
            <Text style={styles.detailValue}>{weather.windiness} mph</Text>
            <Text style={styles.detailLabel}>{getWindDescription(weather.windiness)}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Ionicons name="rainy" size={20} color={theme.colors.accent} />
            <Text style={styles.detailValue}>{weather.highestChanceOfRain}%</Text>
            <Text style={styles.detailLabel}>Rain Chance</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Ionicons name="partly-sunny" size={20} color={theme.colors.accent} />
            <Text style={styles.detailValue}>{weather.sunniness}%</Text>
            <Text style={styles.detailLabel}>Sunshine</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.lightGray,
    borderRadius: theme.borderRadius.large,
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    marginHorizontal: theme.spacing.xs,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
  },
  loadingText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.gray,
    fontWeight: '500',
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
  },
  errorText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.error,
    fontWeight: '600',
    textAlign: 'center',
  },
  errorDetails: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray,
    textAlign: 'center',
    marginTop: theme.spacing.xs,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray,
  },
  mainIcon: {
    marginRight: theme.spacing.md,
  },
  headerText: {
    flex: 1,
  },
  location: {
    fontSize: theme.fontSize.lg,
    fontWeight: '700',
    color: theme.colors.black,
    marginBottom: 2,
  },
  condition: {
    fontSize: theme.fontSize.md,
    color: theme.colors.gray,
    textTransform: 'capitalize',
    fontWeight: '500',
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: '600',
    color: theme.colors.black,
    marginBottom: theme.spacing.md,
  },
  tempRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.md,
  },
  tempItem: {
    alignItems: 'center',
  },
  tempValue: {
    fontSize: theme.fontSize.xl,
    fontWeight: '700',
    color: theme.colors.black,
    marginBottom: 4,
  },
  tempLabel: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.gray,
    fontWeight: '500',
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  detailItem: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.md,
    alignItems: 'center',
    minWidth: '45%',
    flex: 1,
  },
  detailValue: {
    fontSize: theme.fontSize.md,
    fontWeight: '600',
    color: theme.colors.black,
    marginTop: theme.spacing.xs,
    marginBottom: 2,
  },
  detailLabel: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.gray,
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default WeatherCard;