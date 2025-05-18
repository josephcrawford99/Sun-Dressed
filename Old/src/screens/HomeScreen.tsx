import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
  Animated,
  Easing,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../utils/AuthContext';
import { typography, fonts } from '../styles/typography';
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
import WeekCalendarStrip from '../components/weather/WeekCalendarStrip';
import {
  ClothingDatabase,
  OutfitRecommendation,
  UserPreferences,
  WeatherData as OutfitWeatherData,
  recommendOutfit,
  updatePreferencesFromFeedback
} from '../services/outfitService';
import clothingData from '../data/clothingData.json';
import { getClothingImage } from '../utils/clothingImages';

// Default user preferences
const DEFAULT_USER_PREFERENCES: UserPreferences = {
  warmthAdjustment: 0,
  formalityPreference: 'casual',
  avoidedItems: [],
  favoriteItems: []
};

// Mock images for fallback
const mockOutfit = {
  top: require('../assets/mock/top.png'),
  outerwear: require('../assets/mock/outerwear.png'),
  bottoms: require('../assets/mock/bottoms.png'),
  shoes: require('../assets/mock/shoes.png'),
  accessory: require('../assets/mock/accessory.png'),
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
  const { user } = useAuth();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [location, setLocation] = useState(DEFAULT_LOCATION);
  const { weatherData, isLoading, error, refetch } = useWeather(location);
  const [showingWeather, setShowingWeather] = useState(false);
  const flipAnimation = useRef(new Animated.Value(0)).current;
  const { theme } = useTheme();
  const { temperatureUnit, windSpeedUnit } = useSettings();
  const [greeting, setGreeting] = useState<string>('HELLO');
  
  // New state for outfit recommendations
  const [userPreferences, setUserPreferences] = useState<UserPreferences>(DEFAULT_USER_PREFERENCES);
  const [outfit, setOutfit] = useState<OutfitRecommendation | null>(null);
  const [feedbackVisible, setFeedbackVisible] = useState<{[key: string]: boolean}>({});

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

  // Load user preferences from storage
  useEffect(() => {
    const loadUserPreferences = async () => {
      try {
        const storedPreferences = await AsyncStorage.getItem('userPreferences');
        if (storedPreferences) {
          setUserPreferences(JSON.parse(storedPreferences));
        }
      } catch (e) {
        console.error('Failed to load user preferences:', e);
      }
    };
    
    loadUserPreferences();
  }, []);

  // Save user preferences when they change
  useEffect(() => {
    const saveUserPreferences = async () => {
      try {
        await AsyncStorage.setItem('userPreferences', JSON.stringify(userPreferences));
      } catch (e) {
        console.error('Failed to save user preferences:', e);
      }
    };
    
    saveUserPreferences();
  }, [userPreferences]);

  // Map weatherData to format expected by outfitService
  const mapWeatherToOutfitFormat = (weatherData: any): OutfitWeatherData => {
    if (!weatherData) {
      return {
        temperature: 20, // Default to 20°C
        precipitation: 0,
        isRaining: false,
        isSunny: true
      };
    }
    
    // Extract weather conditions from icon or description
    const isRaining = weatherData.icon.includes('rain') || 
                     (weatherData.description && weatherData.description.toLowerCase().includes('rain'));
    
    const isSunny = weatherData.icon.includes('01d') || weatherData.icon.includes('01n') ||
                   (weatherData.description && weatherData.description.toLowerCase().includes('clear'));
    
    // Calculate precipitation probability from weather data
    let precipitation = 0;
    if (isRaining) {
      precipitation = 1; // 100% if raining
    } else if (weatherData.icon.includes('cloud') || weatherData.clouds > 50) {
      precipitation = 0.3; // 30% if cloudy
    } else if (weatherData.humidity > 70) {
      precipitation = 0.2; // 20% if humid
    }
    
    return {
      temperature: weatherData.temperature,
      precipitation,
      isRaining,
      isSunny
    };
  };

  // Generate outfit recommendation when weather data changes
  useEffect(() => {
    if (weatherData) {
      const mappedWeatherData = mapWeatherToOutfitFormat(weatherData);
      const recommendedOutfit = recommendOutfit(
        clothingData as unknown as ClothingDatabase,
        mappedWeatherData,
        userPreferences
      );
      setOutfit(recommendedOutfit);
    }
  }, [weatherData, userPreferences]);

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

  // Handle user feedback for temperature
  const handleTemperatureFeedback = (feedback: 'too_cold' | 'too_hot' | 'just_right') => {
    const updatedPreferences = updatePreferencesFromFeedback(
      feedback,
      'outfit', // Using 'outfit' as a general ID for whole outfit feedback
      userPreferences
    );
    setUserPreferences(updatedPreferences);
    Alert.alert('Feedback Saved', 'Your temperature preference has been updated. Future recommendations will be adjusted.');
  };

  // Handle feedback for specific clothing items
  const handleItemFeedback = (feedback: 'dislike' | 'just_right', itemId: string) => {
    const updatedPreferences = updatePreferencesFromFeedback(
      feedback,
      itemId,
      userPreferences
    );
    setUserPreferences(updatedPreferences);
    
    // Hide the feedback UI
    setFeedbackVisible(prev => ({
      ...prev,
      [itemId]: false
    }));
    
    Alert.alert('Item Preference Saved', feedback === 'just_right' ? 
      'This item has been added to your favorites.' : 
      'This item won\'t be recommended as often.');
  };

  // Toggle feedback visibility for an item
  const toggleFeedback = (itemId: string) => {
    setFeedbackVisible(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const renderTodayButton = (): JSX.Element => {
    if (isLoading) {
      return (
        <Button
          type="primary"
          onPress={() => {}}
          style={styles.todayButton}
        >
          <View style={styles.todayButtonContent}>
            <WeatherIcon
              weatherCode="01d"
              size={20}
              color="#FFF"
            />
            <Text style={styles.todayTempWhite}>--°</Text>
          </View>
        </Button>
      );
    }

    const temperature = weatherData ? convertTemperature(weatherData.temperature, temperatureUnit) : '--';

    return (
      <Button
        type="primary"
        onPress={flipCard}
        style={styles.todayButton}
      >
        <View style={styles.todayButtonContent}>
          <WeatherIcon
            weatherCode={weatherData?.icon as WeatherCode || '01d'}
            size={20}
            color="#FFF"
          />
          <Text style={styles.todayTempWhite}>{temperature}°{temperatureUnit}</Text>
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

  // Render an individual clothing item in the bento box
  const renderClothingItem = (item: any, category: 'top' | 'bottom' | 'dress' | 'outerwear' | 'shoes' | 'accessory') => {
    if (!item) return null;
    
    // Get the appropriate image for this item
    const itemImage = getClothingImage(item.id, category);
    
    return (
      <View style={styles.bentoCellOuter}>
        <TouchableOpacity 
          style={styles.bentoCell} 
          onPress={() => toggleFeedback(item.id)}
          activeOpacity={0.7}
        >
          <Image source={itemImage} style={styles.clothingImg} resizeMode="contain" />
          <Text 
            style={StyleSheet.flatten([typography.label, styles.bentoLabel])} 
            ellipsizeMode="tail" 
            numberOfLines={1}
          >
            {item.name}
          </Text>
          
          {/* Feedback UI */}
          {feedbackVisible[item.id] && (
            <View style={styles.itemFeedback}>
              <TouchableOpacity
                style={styles.itemFeedbackButton}
                onPress={() => handleItemFeedback('dislike', item.id)}
              >
                <Ionicons name="thumbs-down" size={20} color="#FF4757" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.itemFeedbackButton}
                onPress={() => handleItemFeedback('just_right', item.id)}
              >
                <Ionicons name="thumbs-up" size={20} color="#2ED573" />
              </TouchableOpacity>
            </View>
          )}
          
          {/* Favorite/Avoided indicators */}
          {userPreferences.favoriteItems.includes(item.id) && (
            <View style={styles.favoriteIndicator}>
              <Ionicons name="heart" size={16} color="#FF6B81" />
            </View>
          )}
          {userPreferences.avoidedItems.includes(item.id) && (
            <View style={styles.avoidedIndicator}>
              <Ionicons name="close-circle" size={16} color="#FF4757" />
            </View>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  const renderOutfitContent = () => {
    // Show loading state if outfit data isn't ready
    if (!outfit) {
      return (
        <View style={styles.outfitContent}>
          <View style={styles.outfitHeaderRow}>
            <Text style={StyleSheet.flatten([typography.subheading, styles.outfitHeader])}>
              TODAY'S <Text style={StyleSheet.flatten([typography.heading, styles.outfitHeaderItalic])}>Outfit</Text>
            </Text>
          </View>
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading outfit recommendations...</Text>
          </View>
        </View>
      );
    }
    
    return (
      <View style={styles.outfitContent}>
        <View style={styles.outfitHeaderRow}>
          <Text style={StyleSheet.flatten([typography.subheading, styles.outfitHeader])}>
            TODAY'S <Text style={StyleSheet.flatten([typography.heading, styles.outfitHeaderItalic])}>Outfit</Text>
          </Text>
        </View>
        
        {/* Temperature feedback controls */}
        <View style={styles.feedbackControls}>
          <Text style={styles.feedbackTitle}>How does this outfit feel?</Text>
          <View style={styles.feedbackButtons}>
            <TouchableOpacity
              style={[styles.feedbackButton, styles.coldButton]}
              onPress={() => handleTemperatureFeedback('too_cold')}
            >
              <Ionicons name="snow-outline" size={16} color="#000" />
              <Text style={styles.feedbackButtonText}>Too Cold</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.feedbackButton, styles.justRightButton]}
              onPress={() => handleTemperatureFeedback('just_right')}
            >
              <Ionicons name="checkmark-circle-outline" size={16} color="#000" />
              <Text style={styles.feedbackButtonText}>Just Right</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.feedbackButton, styles.hotButton]}
              onPress={() => handleTemperatureFeedback('too_hot')}
            >
              <Ionicons name="flame-outline" size={16} color="#000" />
              <Text style={styles.feedbackButtonText}>Too Hot</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.bentoBox}>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <View style={{ flex: 1, gap: 10 }}>
              {/* Either render dress OR top+bottom */}
              {outfit.dress ? (
                renderClothingItem(outfit.dress, 'dress')
              ) : (
                <>
                  {renderClothingItem(outfit.top, 'top')}
                  {renderClothingItem(outfit.bottom, 'bottom')}
                </>
              )}
            </View>
            <View style={{ flex: 1, gap: 10 }}>
              {renderClothingItem(outfit.outerwear, 'outerwear')}
              {/* Show first accessory */}
              {outfit.accessories && outfit.accessories.length > 0 && 
                renderClothingItem(outfit.accessories[0], 'accessory')}
              {renderClothingItem(outfit.shoes, 'shoes')}
            </View>
          </View>
        </View>
        
        <View style={styles.actionRow}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => Alert.alert('Coming Soon', 'Edit feature will be available in a future update.')}
          >
            <Text style={typography.button}>EDIT</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => Alert.alert('Coming Soon', 'Save feature will be available in a future update.')}
          >
            <Text style={typography.button}>SAVE</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => Alert.alert('Coming Soon', 'Share feature will be available in a future update.')}
          >
            <Text style={typography.button}>SHARE</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

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
        <View style={styles.calendarContainer}>
          <WeekCalendarStrip
            onDayPress={(date) => {
              // To be implemented later
              console.log('Day pressed:', date);
            }}
          />
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
  container: { 
    padding: 0, 
    backgroundColor: '#fff', 
    gap: 0,
    position: 'relative', // Ensures proper stacking context for z-index
  },
  greetingRow: { flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginVertical: 16,},
  name: { marginTop: -4 },
  bellButton: { backgroundColor: '#fff', borderRadius: 20, padding: 8, elevation: 2 },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginBottom: 16,
    zIndex: 10, // Ensure dropdown appears on top
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
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    paddingHorizontal: 6,
  },
  weatherIconWhite: {
    width: 20,
    height: 20,
    color: '#FFF',
  },
  outfitHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 20, marginTop: 4 },
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
    marginBottom: 0,
  },
  flipContainer: {
    marginHorizontal: 20,
    marginTop: -4,
    marginBottom: 4,
    perspective: 1000,
    height: 370, // Increased height to accommodate feedback controls
    position: 'relative',
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
    minHeight: 370,
  },
  outfitContent: {
    backgroundColor: '#FFF',
    minHeight: 370,
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
    marginLeft: 8,
    textAlignVertical: 'center',
  },
  calendarContainer: {
    marginHorizontal: 20,
    marginBottom: 0,
    zIndex: -1, // Ensure it stays below dropdown
  },
  // New styles for outfit recommendation
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 300,
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
  },
  itemFeedback: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 12,
    padding: 4,
  },
  itemFeedbackButton: {
    padding: 4,
    marginHorizontal: 4,
  },
  favoriteIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 10,
    padding: 4,
  },
  avoidedIndicator: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 10,
    padding: 4,
  },
  feedbackControls: {
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 8,
  },
  feedbackTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 6,
    textAlign: 'center',
  },
  feedbackButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  feedbackButton: {
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginHorizontal: 4,
    flexDirection: 'row',
  },
  feedbackButtonText: {
    fontSize: 12,
    marginLeft: 4,
  },
  coldButton: {
    backgroundColor: '#a8daff',
  },
  justRightButton: {
    backgroundColor: '#a8ffb0',
  },
  hotButton: {
    backgroundColor: '#ffa8a8',
  },
});

export default HomeScreen;