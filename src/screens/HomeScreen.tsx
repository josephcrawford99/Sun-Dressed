import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  Platform,
  Animated,
  Easing
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../utils/AuthContext';
import { typography, fonts } from '../styles/typography';
import Dropdown from '../components/Dropdown';
import { getFrequentLocations, addFrequentLocation, getLocation, saveLocation } from '../utils/storage';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useWeather } from '../utils/useWeather';
import WeatherDisplay from '../components/WeatherDisplay';
import { DEFAULT_LOCATION } from '../utils/constants';
import { WeatherIcon } from '../components/WeatherIcon';
import { WeatherCode } from '../utils/weatherIcons';
import { useTheme } from '../utils/ThemeContext';
import { useSettings } from '../utils/SettingsContext';
import Button from '../components/Button';
import TabBar from '../components/TabBar';
import { getTimeOfDay, getGreeting, TimeOfDay } from '../services/timeService';
import { LocationInput } from '../components/LocationInput';
import DevClearDataHeader from '../components/DevClearDataHeader';

const mockOutfit = {
  top: require('../assets/mock/top.png'),
  outerwear: require('../assets/mock/outerwear.png'),
  bottoms: require('../assets/mock/bottoms.png'),
  shoes: require('../assets/mock/shoes.png'),
  accessory: require('../assets/mock/accessory.png'),
};

const mockWeather = {
  temperature: '72°',
  icon: require('../assets/mock/sunny.png'), // Replace with your actual weather icon asset
};

const MOCK_LOCATIONS = [
  { name: 'New York, NY', country: 'US' },
  { name: 'Washington, DC', country: 'US' },
];

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
  const { user } = useAuth();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [location, setLocation] = useState(DEFAULT_LOCATION);
  const { weatherData, isLoading, error, refetch } = useWeather(location);
  const [showingWeather, setShowingWeather] = useState(false);
  const flipAnimation = useRef(new Animated.Value(0)).current;
  const { theme } = useTheme();
  const { temperatureUnit, windSpeedUnit } = useSettings();
  const [greeting, setGreeting] = useState<string>('HELLO');

  // Load saved location on mount
  useEffect(() => {
    const loadSavedLocation = async () => {
      const savedLocation = await getLocation();
      if (savedLocation) {
        setLocation(savedLocation);
      }
    };
    loadSavedLocation();
  }, []);

  useEffect(() => {
    const updateGreeting = async () => {
      try {
        const timeOfDay = await getTimeOfDay(location);
        setGreeting(getGreeting(timeOfDay));
      } catch (error) {
        console.warn('Error updating greeting:', error);
        setGreeting('HELLO'); // Fallback greeting
      }
    };

    updateGreeting();
    // Update greeting every minute
    const interval = setInterval(updateGreeting, 60000);
    return () => clearInterval(interval);
  }, [location]);

  const flipCard = () => {
    const toValue = showingWeather ? 0 : 1;
    setShowingWeather(!showingWeather);

    Animated.timing(flipAnimation, {
      toValue,
      duration: 600,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      useNativeDriver: true,
    }).start();
  };

  const frontInterpolate = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });

  const frontAnimatedStyle = {
    transform: [{ rotateY: frontInterpolate }],
  };

  const backAnimatedStyle = {
    transform: [{ rotateY: backInterpolate }],
  };

  const renderTodayButton = (): JSX.Element => {
    if (isLoading) {
      return (
        <Button style={styles.todayButton}>
          <View style={styles.todayButtonContent}>
            <Ionicons name="sunny-outline" size={20} color="#FFF" style={styles.weatherIconWhite} />
            <Text style={styles.todayTempWhite}>--°</Text>
          </View>
        </Button>
      );
    }

    const temperature = weatherData ? convertTemperature(weatherData.temperature, temperatureUnit) : '--';

    return (
      <Button style={styles.todayButton} onPress={flipCard}>
        <View style={styles.todayButtonContent}>
          <WeatherIcon
            weatherCode={weatherData?.icon as WeatherCode || '01d'}
            size={20}
            color="#FFF"
          />
          <Text style={styles.todayTempWhite}>{temperature}°</Text>
        </View>
      </Button>
    );
  };

  const renderWeatherContent = () => (
    <View style={styles.weatherContent}>
      <View style={styles.outfitHeaderRow}>
        <Text style={StyleSheet.flatten([typography.subheading, styles.outfitHeader])}>
          TODAY'S <Text style={StyleSheet.flatten([typography.heading, styles.outfitHeaderItalic])}>Weather</Text>
        </Text>
      </View>
      {weatherData && (
        <View style={styles.weatherDetails}>
          <View style={styles.weatherMain}>
            <WeatherIcon
              weatherCode={weatherData.icon as WeatherCode}
              size={80}
              color={theme.colors.text}
            />
            <Text style={styles.temperature}>
              {convertTemperature(weatherData.temperature, temperatureUnit)}°
            </Text>
          </View>
          <Text style={styles.weatherDescription}>{weatherData.description}</Text>
          <View style={styles.weatherStats}>
            <View style={styles.weatherStat}>
              <Ionicons name="water-outline" size={20} color="#000" />
              <Text style={styles.statText}>{weatherData.humidity}%</Text>
            </View>
            <View style={styles.weatherStat}>
              <Ionicons name="thermometer-outline" size={20} color="#000" />
              <Text style={styles.statText}>
                Feels like {convertTemperature(weatherData.feels_like, temperatureUnit)}°
              </Text>
            </View>
            <View style={styles.weatherStat}>
              <Ionicons name="speedometer-outline" size={20} color="#000" />
              <Text style={styles.statText}>{convertWindSpeed(weatherData.wind_speed, windSpeedUnit)}</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );

  const renderOutfitContent = () => (
    <View style={styles.outfitContent}>
      <View style={styles.outfitHeaderRow}>
        <Text style={StyleSheet.flatten([typography.subheading, styles.outfitHeader])}>
          TODAY'S <Text style={StyleSheet.flatten([typography.heading, styles.outfitHeaderItalic])}>Outfit</Text>
        </Text>
      </View>
      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.actionButton}><Text style={typography.button}>EDIT</Text></TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}><Text style={typography.button}>SAVE</Text></TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}><Text style={typography.button}>SHARE</Text></TouchableOpacity>
      </View>
      <View style={styles.bentoBox}>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <View style={{ flex: 1, gap: 10 }}>
            <View style={styles.bentoCellOuter}><View style={styles.bentoCell}><Image source={mockOutfit.top} style={styles.clothingImg} resizeMode="contain" /><Text style={StyleSheet.flatten([typography.label, styles.bentoLabel])} ellipsizeMode="tail" numberOfLines={1}>Top</Text></View></View>
            <View style={styles.bentoCellOuter}><View style={styles.bentoCell}><Image source={mockOutfit.bottoms} style={styles.clothingImg} resizeMode="contain" /><Text style={StyleSheet.flatten([typography.label, styles.bentoLabel])} ellipsizeMode="tail" numberOfLines={1}>Bottoms</Text></View></View>
          </View>
          <View style={{ flex: 1, gap: 10 }}>
            <View style={styles.bentoCellOuter}><View style={styles.bentoCell}><Image source={mockOutfit.outerwear} style={styles.clothingImg} resizeMode="contain" /><Text style={StyleSheet.flatten([typography.label, styles.bentoLabel])} ellipsizeMode="tail" numberOfLines={1}>Outerwear</Text><Text style={StyleSheet.flatten([typography.caption, styles.sponsored])}>sponsored</Text></View></View>
            <View style={styles.bentoCellOuter}><View style={styles.bentoCell}><Image source={mockOutfit.accessory} style={styles.clothingImg} resizeMode="contain" /><Text style={StyleSheet.flatten([typography.label, styles.bentoLabel])} ellipsizeMode="tail" numberOfLines={1}>Accessory</Text></View></View>
            <View style={styles.bentoCellOuter}><View style={styles.bentoCell}><Image source={mockOutfit.shoes} style={styles.clothingImg} resizeMode="contain" /><Text style={StyleSheet.flatten([typography.label, styles.bentoLabel])} ellipsizeMode="tail" numberOfLines={1}>Shoes</Text></View></View>
          </View>
        </View>
      </View>
    </View>
  );

  const handleLocationSelect = async (newLocation: string) => {
    setLocation(newLocation);
    await saveLocation(newLocation);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <DevClearDataHeader isAuthScreen={false} />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.greetingRow}>
          <View>
            <Text style={typography.label}>{greeting},</Text>
            <Text style={StyleSheet.flatten([typography.heading, styles.name])}>{user?.name + '!' || ''}</Text>
          </View>
          <TouchableOpacity style={styles.bellButton}>
            <Ionicons name="notifications-outline" size={28} color="#000" />
          </TouchableOpacity>
        </View>
        <View style={styles.locationRow}>
          <LocationInput
            value={location}
            onLocationSelect={handleLocationSelect}
            onPinPress={() => {
              // To be implemented later
              console.log('Pin location pressed');
            }}
          />
          {renderTodayButton()}
        </View>

        <View style={styles.datesRow}>
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
            <View
              key={day}
              style={[styles.dateCell, i === 3 && styles.dateCellActive]}
            >
              <Text style={StyleSheet.flatten([typography.caption, i === 3 && styles.dateDayActive])}>{day}</Text>
              <Text style={StyleSheet.flatten([typography.body, i === 3 && styles.dateNumActive])}>{7 + i}</Text>
            </View>
          ))}
        </View>

        <View style={styles.flipContainer}>
          <Animated.View style={[styles.flipCard, frontAnimatedStyle, { opacity: flipAnimation.interpolate({
            inputRange: [0, 0.5, 0.5, 1],
            outputRange: [1, 0, 0, 0]
          }) }]}>
            {renderOutfitContent()}
          </Animated.View>
          <Animated.View style={[styles.flipCard, styles.flipCardBack, backAnimatedStyle, { opacity: flipAnimation.interpolate({
            inputRange: [0, 0.5, 0.5, 1],
            outputRange: [0, 0, 1, 1]
          }) }]}>
            {renderWeatherContent()}
          </Animated.View>
        </View>
      </ScrollView>
      <TabBar activeTab="home" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  flex1: { flex: 1 },
  container: { padding: 0, backgroundColor: '#fff' },
  greetingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, marginBottom: 8, paddingHorizontal: 20 },
  name: { marginTop: -4 },
  bellButton: { backgroundColor: '#fff', borderRadius: 20, padding: 8, elevation: 2 },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginBottom: 8,
    zIndex: 20,
  },
  todayButton: {
    borderRadius: 12,
    paddingHorizontal: 8,
    height: 36,
    marginLeft: 8,
    minWidth: 90,
  },
  todayButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 6,
  },
  weatherIconWhite: {
    width: 20,
    height: 20,
  },
  datesRow: { flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 10, marginBottom: 12 },
  dateCell: { alignItems: 'center', justifyContent: 'center', width: 44, height: 51, backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#F5F5F5', marginHorizontal: 2 },
  dateCellActive: { backgroundColor: '#000', borderColor: '#000' },
  dateDayActive: { color: '#fff' },
  dateNumActive: { color: '#fff' },
  outfitHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 20, marginTop: 8 },
  outfitHeader: {},
  outfitHeaderItalic: {},
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 20, marginTop: 12, marginBottom: 8 },
  actionButton: { flex: 1, backgroundColor: '#000', borderRadius: 12, marginHorizontal: 4, height: 32, alignItems: 'center', justifyContent: 'center' },
  bentoBox: { marginHorizontal: 20, marginTop: 8, marginBottom: 8 },
  bentoCellOuter: { flex: 1, margin: 0, padding: 0 },
  bentoCell: { flex: 1, backgroundColor: '#F5F5F5', borderRadius: 12, alignItems: 'center', justifyContent: 'center', minHeight: 120, position: 'relative', width: '100%' },
  clothingImg: { width: 60, height: 60, marginTop: 8 },
  bentoLabel: {
    position: 'absolute',
    left: -25,
    bottom: 40,
    transform: [
      { rotate: '-90deg' },
    ],
    textAlign: 'left',
    pointerEvents: 'none',
    width: 80,
  },
  sponsored: { position: 'absolute', right: 8, bottom: 8 },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    backgroundColor: '#fff'
  },
  tabIcon: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  locationTextInput: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 0,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  dropdown: {
    position: 'absolute',
    top: 48,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    zIndex: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    maxHeight: 180,
  },
  suggestion: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  weatherContainer: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  flipContainer: {
    marginHorizontal: 20,
    marginVertical: 10,
    perspective: 1000,
  },
  flipCard: {
    backfaceVisibility: 'hidden',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  flipCardBack: {
    position: 'absolute',
    top: 0,
  },
  weatherContent: {
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    padding: 20,
    minHeight: 300,
  },
  outfitContent: {
    backgroundColor: '#FFF',
    minHeight: 300,
  },
  weatherDetails: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  weatherMain: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  largeWeatherIcon: {
    width: 100,
    height: 100,
  },
  temperature: {
    fontSize: 48,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  weatherDescription: {
    fontSize: 20,
    textTransform: 'capitalize',
    marginBottom: 20,
  },
  weatherStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  weatherStat: {
    alignItems: 'center',
  },
  statText: {
    marginTop: 5,
    fontSize: 16,
  },
  todayTempWhite: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '400',
    fontFamily: 'LibreBaskerville_400Regular',
    marginLeft: 'auto',
  },
});

export default HomeScreen;
