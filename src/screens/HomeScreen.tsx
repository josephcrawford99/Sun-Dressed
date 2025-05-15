import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView as OuterSafeAreaView,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { typography, fonts } from '../styles/typography';
import { theme } from '../styles/theme';
import { useWeather } from '../utils/useWeather';
import { getTimeOfDay, getGreeting } from '../utils/timeService';
import LocationBar from '../components/LocationBar';
import WeatherCustomButton from '../components/WeatherCustomButton';
import CalendarStrip from '../components/CalendarStrip';
import FlipContainer from '../components/FlipContainer';
import { WeatherIcon } from '../components/WeatherIcon';
import { WeatherCode } from '../utils/weatherIcons';
import BentoBox, { OutfitData } from '../components/BentoBox';

import NavBar, { TAB_BAR_CONTENT_HEIGHT } from '../components/NavBar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const DEFAULT_LOCATION = 'New York, NY';

const mockOutfitData: OutfitData = {
  id: 'outfit-regular',
  top: {
    id: 'top-1',
    type: 'top',
    name: 'T-Shirt',
  },
  bottom: {
    id: 'bottom-1',
    type: 'bottom',
    name: 'Jeans',
  },
  outerwear: [
    {
      id: 'outerwear-1',
      type: 'outerwear',
      name: 'Light Jacket',
    },
  ],
  accessories: [
    {
      id: 'accessory-1',
      type: 'accessory',
      name: 'Watch',
    },
  ],
  shoes: {
    id: 'shoes-1',
    type: 'shoes',
    name: 'Sneakers',
  },
};

const convertTemperature = (celsius: number, unit: 'C' | 'F'): number => {
  if (unit === 'F') {
    return Math.round(celsius * 9/5 + 32);
  }
  return Math.round(celsius);
};

const convertWindSpeed = (ms: number, unit: 'ms' | 'mph'): string => {
  if (unit === 'mph') {
    return `${Math.round(ms * 2.237)} mph`;
  }
  return `${ms} m/s`;
};

const HomeScreen: React.FC = () => {
  const user = { name: 'User Name' };
  const [temperatureUnit, setTemperatureUnit] = useState<'C' | 'F'>('C');
  const [windSpeedUnit, setWindSpeedUnit] = useState<'ms' | 'mph'>('ms');
  const [location, setLocation] = useState(DEFAULT_LOCATION);
  const { weatherData, isLoading, error } = useWeather(location);
  const [showingWeather, setShowingWeather] = useState(false);
  const [greeting, setGreeting] = useState<string>('HELLO');

  const insets = useSafeAreaInsets();
  const navBarTotalHeight = TAB_BAR_CONTENT_HEIGHT + insets.bottom;

  useEffect(() => {
    const updateGreeting = async () => {
      try {
        const timeOfDay = await getTimeOfDay(location);
        setGreeting(getGreeting(timeOfDay));
      } catch (error) {
        console.warn('Error updating greeting:', error);
        setGreeting('HELLO');
      }
    };

    updateGreeting();
    const interval = setInterval(updateGreeting, 60000);
    return () => clearInterval(interval);
  }, [location]);

  const handleLocationSelect = (newLocation: string) => {
    setLocation(newLocation);
  };

  const toggleWeatherView = () => {
    setShowingWeather(!showingWeather);
  };

  const renderWeatherContent = () => (
    <View style={styles.weatherContent}>
      <View style={styles.headerRow}>
        <Text style={typography.subheading}>
          TODAY'S <Text style={typography.headingItalic}>Weather</Text>
        </Text>
      </View>

      {weatherData ? (
        <>
          <View style={styles.weatherMain}>
            <WeatherIcon
              weatherCode={weatherData.icon as WeatherCode}
              size={80}
              color={theme.colors.black}
            />
            <Text style={styles.temperature}>
              {convertTemperature(weatherData.temperature, temperatureUnit)}°
            </Text>
          </View>

          <Text style={styles.weatherDescription}>
            {weatherData.description}
          </Text>

          <View style={styles.weatherStats}>
            <View style={styles.weatherStat}>
              <Ionicons name="water-outline" size={20} color={theme.colors.black} />
              <Text style={styles.statText}>{weatherData.humidity}%</Text>
            </View>
            <View style={styles.weatherStat}>
              <Ionicons name="thermometer-outline" size={20} color={theme.colors.black} />
              <Text style={styles.statText}>
                Feels like {convertTemperature(weatherData.feels_like, temperatureUnit)}°
              </Text>
            </View>
            <View style={styles.weatherStat}>
              <Ionicons name="speedometer-outline" size={20} color={theme.colors.black} />
              <Text style={styles.statText}>
                {convertWindSpeed(weatherData.wind_speed, windSpeedUnit)}
              </Text>
            </View>
          </View>
        </>
      ) : (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading weather data...</Text>
        </View>
      )}
    </View>
  );

  const renderOutfitContent = () => (
    <View style={styles.outfitContent}>
      <View style={styles.headerRow}>
        <Text style={typography.subheading}>
          TODAY'S <Text style={typography.headingItalic}>Outfit</Text>
        </Text>
      </View>
      <View style={styles.bentoBoxContainer}>
        <BentoBox outfitData={mockOutfitData} />
      </View>
    </View>
  );

  return (
    <OuterSafeAreaView style={styles.outerSafeArea}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContentContainer,
          { paddingBottom: navBarTotalHeight }
        ]}
        showsVerticalScrollIndicator={false}
        alwaysBounceVertical={false}
      >
        <View style={styles.greetingRow}>
          <View>
            <Text style={typography.label}>{greeting},</Text>
            <Text style={styles.name}>{user?.name || ''}!</Text>
          </View>
          <TouchableOpacity style={styles.bellButton}>
            <Ionicons name="notifications-outline" size={28} color={theme.colors.black} />
          </TouchableOpacity>
        </View>

        <View style={styles.locationRow}>
          <LocationBar
            value={location}
            onLocationSelect={handleLocationSelect}
          />
          <View style={styles.weatherButtonContainer}>
            <WeatherCustomButton
              temperature={weatherData ? convertTemperature(weatherData.temperature, temperatureUnit) : undefined}
              weatherCode={weatherData?.icon as WeatherCode || '01d'}
              temperatureUnit={temperatureUnit}
              isLoading={isLoading}
              onPress={toggleWeatherView}
            />
          </View>
        </View>

        <View style={styles.calendarContainer}>
          <CalendarStrip
            onDayPress={(date: Date) => {
              console.log('Selected date:', date);
            }}
          />
        </View>

        <View style={styles.flipContainerWrapper}>
          <FlipContainer
            frontContent={renderOutfitContent()}
            backContent={renderWeatherContent()}
            isFlipped={showingWeather}
            onFlip={toggleWeatherView}
          />
        </View>
      </ScrollView>
    </OuterSafeAreaView>
  );
};

const styles = StyleSheet.create({
  outerSafeArea: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollContentContainer: {
    backgroundColor: theme.colors.white,
  },
  greetingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: theme.spacing.md,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  name: {
    ...typography.heading,
    fontStyle: 'italic',
    marginTop: -4,
  },
  bellButton: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.large,
    padding: theme.spacing.sm,
    elevation: 2,
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    zIndex: 10,
  },
  weatherButtonContainer: {
    marginLeft: theme.spacing.sm,
  },
  calendarContainer: {
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  flipContainerWrapper: {
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.xs,
    height: 440,
    borderRadius: theme.borderRadius.large,
    overflow: 'hidden',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.sm,
  },
  weatherContent: {
    flex: 1,
    backgroundColor: '#fff',
  },
  outfitContent: {
    flex: 1,
    backgroundColor: '#fff',
  },
  bentoBoxContainer: {
    flex: 1,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.medium,
    overflow: 'hidden',
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  weatherMain: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: theme.spacing.md,
  },
  temperature: {
    fontSize: 48,
    fontFamily: fonts.primaryBold,
    marginLeft: theme.spacing.md,
  },
  weatherDescription: {
    ...typography.body,
    textAlign: 'center',
    textTransform: 'capitalize',
    marginBottom: theme.spacing.lg,
  },
  weatherStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: theme.spacing.md,
    marginTop: theme.spacing.xl,
  },
  weatherStat: {
    alignItems: 'center',
  },
  statText: {
    ...typography.body,
    marginTop: theme.spacing.xs,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...typography.body,
    color: theme.colors.gray,
  },
});

export default HomeScreen;
