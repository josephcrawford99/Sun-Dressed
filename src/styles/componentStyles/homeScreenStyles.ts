import { StyleSheet } from 'react-native';
import { Theme } from '../theme';
import { createStyles } from '../styleCreator';

/**
 * Create styles for the HomeScreen component
 * This allows the HomeScreen to adapt to theme changes
 */
export const createHomeScreenStyles = (theme: Theme) =>
  createStyles(theme, (theme) => ({
    safeArea: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContent: {
      flexGrow: 1,
      paddingBottom: theme.spacing.xl,
    },
    header: {
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.xl,
      paddingBottom: theme.spacing.md,
    },
    headerText: {
      ...theme.typography.title,
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
    },
    subtitle: {
      ...theme.typography.subtitle,
      color: theme.colors.textSecondary,
    },
    weatherDisplay: {
      marginVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
    },
    weatherCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.effects.borderRadius.medium,
      padding: theme.spacing.lg,
      ...theme.effects.shadow.medium,
    },
    temperature: {
      ...theme.typography.weatherDisplay,
      color: theme.colors.text,
      textAlign: 'center',
      marginVertical: theme.spacing.sm,
    },
    weatherDescription: {
      ...theme.typography.subtitle,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      textTransform: 'capitalize',
      marginBottom: theme.spacing.md,
    },
    weatherDetails: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: theme.spacing.md,
    },
    weatherDetail: {
      alignItems: 'center',
    },
    weatherDetailText: {
      ...theme.typography.caption,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.xs,
    },
    weatherDetailValue: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: '500',
    },
    divider: {
      height: 1,
      backgroundColor: 'rgba(0,0,0,0.1)',
      marginVertical: theme.spacing.md,
    },
    outfitSection: {
      marginTop: theme.spacing.lg,
      paddingHorizontal: theme.spacing.lg,
    },
    sectionTitle: {
      ...theme.typography.subtitle,
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
    },
    outfitContainer: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.effects.borderRadius.medium,
      padding: theme.spacing.lg,
      ...theme.effects.shadow.light,
    },
    outfitItems: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
    },
    outfitItem: {
      alignItems: 'center',
      margin: theme.spacing.sm,
    },
    outfitItemImage: {
      width: 100,
      height: 100,
      borderRadius: theme.effects.borderRadius.small,
    },
    outfitItemLabel: {
      ...theme.typography.caption,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.xs,
      textAlign: 'center',
    },
    forecastSection: {
      marginTop: theme.spacing.xl,
      paddingHorizontal: theme.spacing.lg,
    },
    forecastList: {
      marginTop: theme.spacing.sm,
    },
    forecastItem: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.effects.borderRadius.medium,
      marginBottom: theme.spacing.md,
      padding: theme.spacing.md,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      ...theme.effects.shadow.light,
    },
    forecastDay: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: '500',
    },
    forecastTemp: {
      ...theme.typography.body,
      color: theme.colors.text,
    },
    forecastIcon: {
      width: 40,
      height: 40,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing.lg,
    },
    errorText: {
      ...theme.typography.subtitle,
      color: theme.colors.error,
      textAlign: 'center',
      marginBottom: theme.spacing.md,
    },
    retryButton: {
      marginTop: theme.spacing.md,
    },
  }));
