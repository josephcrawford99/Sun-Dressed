import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { getIoniconForWeather } from '@/services/weatherIconService';
import { theme, typography } from '@/styles';
import { WeatherDisplay } from '@/types/weather';
import { getWindDirection, formatTime, getPrecipitationMessage } from '@/utils/weatherUtils';

interface WeatherCardProps {
  weatherDisplay?: WeatherDisplay;
  loading?: boolean;
  error?: string | null;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ weatherDisplay, loading, error }) => {

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading weather...</Text>
        </View>
      </View>
    );
  }

  if (error || !weatherDisplay) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Weather unavailable</Text>
          {error && <Text style={styles.errorDetails}>{error}</Text>}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Compact header */}
      <View style={styles.header}>
        <Ionicons
          name={getIoniconForWeather(weatherDisplay.icon)}
          size={28}
          color={theme.colors.black}
          style={styles.mainIcon}
        />
        <View style={styles.headerText}>
          <Text style={styles.location}>{weatherDisplay.location}</Text>
          <Text style={styles.condition}>{weatherDisplay.description || weatherDisplay.condition.replace('-', ' ')}</Text>
        </View>
      </View>

      {/* Current temperature prominently displayed */}
      <View style={styles.currentTempRow}>
        <Text style={styles.currentTempValue}>{weatherDisplay.displayTemp.current}</Text>
        <Text style={styles.feelsLikeText}>Feels like {weatherDisplay.displayTemp.feelsLike}</Text>
      </View>

      {/* High/Low temperature row */}
      <View style={styles.tempRow}>
        <View style={styles.tempItem}>
          <Text style={styles.tempValue}>{weatherDisplay.displayTemp.high}</Text>
          <Text style={styles.tempLabel}>High</Text>
        </View>
        <View style={styles.tempDivider} />
        <View style={styles.tempItem}>
          <Text style={styles.tempValue}>{weatherDisplay.displayTemp.low}</Text>
          <Text style={styles.tempLabel}>Low</Text>
        </View>
      </View>

      {/* Precipitation timing and sun info */}
      <View style={styles.infoSection}>
        <View style={styles.precipitationInfo}>
          <Ionicons name="rainy-outline" size={16} color={theme.colors.accent} />
          <Text style={styles.precipitationText}>
            {getPrecipitationMessage(weatherDisplay.highestChanceOfRain, weatherDisplay.precipitationUnit, weatherDisplay.description)}
          </Text>
        </View>
        
        {weatherDisplay.sunrise > 0 && weatherDisplay.sunset > 0 && (
          <View style={styles.sunInfo}>
            <View style={styles.sunItem}>
              <Ionicons name="sunny-outline" size={16} color={theme.colors.accent} />
              <Text style={styles.sunText}>Rise {formatTime(weatherDisplay.sunrise)}</Text>
            </View>
            <View style={styles.sunItem}>
              <Ionicons name="moon-outline" size={16} color={theme.colors.accent} />
              <Text style={styles.sunText}>Set {formatTime(weatherDisplay.sunset)}</Text>
            </View>
          </View>
        )}
      </View>

      {/* Compact details grid */}
      <View style={styles.detailsGrid}>
        <View style={styles.detailItem}>
          <Ionicons name="water" size={18} color={theme.colors.accent} />
          <Text style={styles.detailValue}>{weatherDisplay.humidity}%</Text>
          <Text style={styles.detailLabel}>Humidity</Text>
        </View>
        
        <View style={styles.detailItem}>
          <Ionicons name="sunny" size={18} color={theme.colors.accent} />
          <Text style={styles.detailValue}>{weatherDisplay.uvIndex}</Text>
          <Text style={styles.detailLabel}>UV Index</Text>
        </View>
        
        <View style={styles.detailItem}>
          <Ionicons name="leaf" size={18} color={theme.colors.accent} />
          <Text style={styles.detailValue}>{weatherDisplay.displayWind.speed} {getWindDirection(weatherDisplay.windDirection)}</Text>
          <Text style={styles.detailLabel}>Wind {weatherDisplay.displayWind.unit}</Text>
        </View>
        
        <View style={styles.detailItem}>
          <Ionicons name="rainy" size={18} color={theme.colors.accent} />
          <Text style={styles.detailValue}>{weatherDisplay.highestChanceOfRain}%</Text>
          <Text style={styles.detailLabel}>Rain</Text>
        </View>
        
        <View style={styles.detailItem}>
          <Ionicons name="partly-sunny" size={18} color={theme.colors.accent} />
          <Text style={styles.detailValue}>{weatherDisplay.sunniness}%</Text>
          <Text style={styles.detailLabel}>Sun</Text>
        </View>
        
        <View style={styles.detailItem}>
          <Ionicons name="speedometer" size={18} color={theme.colors.accent} />
          <Text style={styles.detailValue}>{weatherDisplay.pressure}</Text>
          <Text style={styles.detailLabel}>hPa</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.lightGray,
    borderRadius: theme.borderRadius.large,
    padding: theme.spacing.lg,
    marginHorizontal: theme.spacing.xs,
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
  mainIcon: {
    marginRight: theme.spacing.sm,
  },
  headerText: {
    flex: 1,
    justifyContent: 'center',
  },
  location: {
    ...typography.subheading,
    marginBottom: theme.spacing.xs,
  },
  condition: {
    ...typography.label,
    textTransform: 'capitalize',
    lineHeight: 16,
  },
  currentTempRow: {
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.medium,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  currentTempValue: {
    ...typography.title,
    fontSize: 48,
    fontWeight: '700',
    color: theme.colors.black,
    marginBottom: theme.spacing.xs,
  },
  feelsLikeText: {
    ...typography.body,
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray,
  },
  tempRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.medium,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  tempItem: {
    alignItems: 'center',
    flex: 1,
  },
  tempDivider: {
    width: 1,
    height: 32,
    backgroundColor: theme.colors.gray,
    marginHorizontal: theme.spacing.sm,
  },
  tempValue: {
    ...typography.heading,
    fontSize: theme.fontSize.xl,
    marginBottom: theme.spacing.xs,
  },
  tempLabel: {
    ...typography.caption,
    fontSize: theme.fontSize.xxs,
    textAlign: 'center',
  },
  infoSection: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  precipitationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  precipitationText: {
    ...typography.body,
    fontSize: theme.fontSize.sm,
    marginLeft: theme.spacing.xs,
    flex: 1,
    color: theme.colors.black,
  },
  sunInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  sunItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sunText: {
    ...typography.caption,
    fontSize: theme.fontSize.sm,
    marginLeft: theme.spacing.xs,
    color: theme.colors.gray,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.xs,
  },
  detailItem: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.small,
    padding: theme.spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '15%',
    flex: 1,
    minHeight: 60,
  },
  detailValue: {
    ...typography.body,
    fontSize: theme.fontSize.sm,
    fontWeight: '600',
    marginTop: theme.spacing.xs,
    marginBottom: 1,
  },
  detailLabel: {
    ...typography.caption,
    fontSize: theme.fontSize.xxs,
    textAlign: 'center',
  },
  debugInfo: {
    ...typography.caption,
    fontSize: theme.fontSize.xxs,
    color: theme.colors.gray,
    marginTop: 2,
  },
});

export default WeatherCard;