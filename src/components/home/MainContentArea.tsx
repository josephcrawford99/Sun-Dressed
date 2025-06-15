import React from 'react';
import { ScrollView, RefreshControl, StyleSheet } from 'react-native';
import BentoBox from '@components/BentoBox';
import FlipComponent from '@components/FlipComponent';
import WeatherCard from '@components/WeatherCard';
import { theme } from '@styles';
import { DateOffset } from '@components/CalendarBar';
import { Outfit } from '@/types/Outfit';
import { WeatherDisplay } from '@/types/weather';

interface MainContentAreaProps {
  isFlipped: boolean;
  outfit: Outfit | null;
  outfitLoading: boolean;
  outfitError: string | null;
  weatherDisplay: WeatherDisplay | null;
  isWeatherLoading: boolean;
  weatherError: string | null;
  currentDateOffset: DateOffset;
  onRefresh?: () => Promise<void>;
}

export const MainContentArea: React.FC<MainContentAreaProps> = ({
  isFlipped,
  outfit,
  outfitLoading,
  outfitError,
  weatherDisplay,
  isWeatherLoading,
  weatherError,
  currentDateOffset,
  onRefresh,
}) => {
  return (
    <ScrollView
      style={styles.mainScrollView}
      contentContainerStyle={styles.mainScrollContent}
      showsVerticalScrollIndicator={false}
      refreshControl={
        currentDateOffset >= 0 && onRefresh ? (
          <RefreshControl
            refreshing={outfitLoading}
            onRefresh={onRefresh}
            tintColor={theme.colors.black}
            title="Pull to regenerate"
            titleColor={theme.colors.black}
          />
        ) : undefined
      }
    >
      <FlipComponent
        isFlipped={isFlipped}
        frontComponent={
          <BentoBox 
            outfit={outfit}
            loading={outfitLoading}
            error={outfitError}
            showNoOutfit={!outfitLoading && !outfit}
            noOutfitDate={
              new Date(new Date().setDate(new Date().getDate() + currentDateOffset))
                .toISOString().split('T')[0]
            }
          />
        }
        backComponent={
          <WeatherCard 
            weatherDisplay={weatherDisplay || undefined}
            loading={isWeatherLoading}
            error={weatherError}
          />
        }
        style={styles.flipContainer}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  mainScrollView: {
    flex: 1,
  },
  mainScrollContent: {
    flexGrow: 1,
    marginHorizontal: theme.spacing.md,
    marginTop: theme.spacing.md,
    minHeight: 450,
    paddingBottom: 100, // Account for tab bar height + safe area
  },
  flipContainer: {
    flex: 1,
    minHeight: 400,
    backgroundColor: 'transparent',
    borderRadius: theme.borderRadius.large,
  },
});