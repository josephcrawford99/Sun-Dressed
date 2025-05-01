import { StyleSheet } from 'react-native';
import { Theme } from '../theme';
import { createStyles } from '../styleCreator';

/**
 * Create styles for the WeatherDisplay component
 */
export const createWeatherDisplayStyles = (theme: Theme) =>
  createStyles(theme, (theme) => ({
    container: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.effects.borderRadius.medium,
      padding: theme.spacing.lg,
      ...theme.effects.shadow.medium,
    },
    tempContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    temperature: {
      ...theme.typography.weatherDisplay,
      color: theme.colors.text,
      textAlign: 'center',
      marginVertical: theme.spacing.sm,
    },
    unit: {
      ...theme.typography.subtitle,
      color: theme.colors.textSecondary,
      marginLeft: 2,
      marginTop: 5,
    },
    description: {
      ...theme.typography.subtitle,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      textTransform: 'capitalize',
      marginBottom: theme.spacing.md,
    },
    iconContainer: {
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    icon: {
      width: 80,
      height: 80,
    },
    detailsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: theme.spacing.md,
    },
    detailItem: {
      alignItems: 'center',
    },
    detailLabel: {
      ...theme.typography.caption,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.xs,
    },
    detailValue: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: '500',
    },
    divider: {
      height: 1,
      backgroundColor: 'rgba(0,0,0,0.1)',
      marginVertical: theme.spacing.md,
    },
    updated: {
      ...theme.typography.caption,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginTop: theme.spacing.sm,
    },
    cached: {
      ...theme.typography.caption,
      color: theme.colors.warning,
      textAlign: 'center',
      marginTop: theme.spacing.xs,
    },
    locationRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    location: {
      ...theme.typography.subtitle,
      color: theme.colors.text,
      textAlign: 'center',
    },
    locationIcon: {
      marginRight: theme.spacing.xs,
    },
    error: {
      ...theme.typography.subtitle,
      color: theme.colors.error,
      textAlign: 'center',
      padding: theme.spacing.lg,
    },
    loadingContainer: {
      padding: theme.spacing.xl,
      alignItems: 'center',
      justifyContent: 'center',
    },
  }));
