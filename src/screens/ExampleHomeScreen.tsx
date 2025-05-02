import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { weatherService } from '../services/weatherService';
import {
  ClothingDatabase,
  OutfitRecommendation,
  UserPreferences,
  WeatherData,
  recommendOutfit,
  updatePreferencesFromFeedback
} from '../services/outfitService';
import clothingData from '../data/clothingData.json';

// Default user preferences
const DEFAULT_USER_PREFERENCES: UserPreferences = {
  warmthAdjustment: 0,
  formalityPreference: 'casual',
  avoidedItems: [],
  favoriteItems: []
};

const HomeScreen: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [outfit, setOutfit] = useState<OutfitRecommendation | null>(null);
  const [userPreferences, setUserPreferences] = useState<UserPreferences>(DEFAULT_USER_PREFERENCES);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Load user preferences from storage
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

    // Load weather data
    const loadWeatherData = async () => {
      try {
        setLoading(true);
        const weatherData = await weatherService.getCurrentWeather();

        // Transform to our internal format
        setWeather({
          temperature: weatherData.main.temp,
          precipitation: weatherData.rain ? 1 : (weatherData.clouds.all > 70 ? 0.5 : 0),
          isRaining: !!weatherData.rain || weatherData.weather[0].main.toLowerCase().includes('rain'),
          isSunny: weatherData.weather[0].main.toLowerCase().includes('clear')
        });
      } catch (e) {
        console.error('Failed to load weather data:', e);
      } finally {
        setLoading(false);
      }
    };

    loadUserPreferences();
    loadWeatherData();
  }, []);

  // Generate outfit recommendation when weather or preferences change
  useEffect(() => {
    if (weather) {
      const recommendedOutfit = recommendOutfit(
        clothingData as unknown as ClothingDatabase,
        weather,
        userPreferences
      );
      setOutfit(recommendedOutfit);
    }
  }, [weather, userPreferences]);

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

  // Handle user feedback
  const handleFeedback = (feedback: 'too_cold' | 'too_hot' | 'just_right' | 'dislike', itemId: string) => {
    const updatedPreferences = updatePreferencesFromFeedback(
      feedback,
      itemId,
      userPreferences
    );
    setUserPreferences(updatedPreferences);
  };

  // Add this inside your existing BentoBox or container component
  const renderOutfitSection = () => {
    if (!outfit) return <Text>Loading outfit suggestions...</Text>;

    return (
      <View style={styles.outfitContainer}>
        <Text style={styles.sectionTitle}>Recommended Outfit</Text>

        {/* Display Top or Dress */}
        {outfit.dress ? (
          <OutfitItem
            item={outfit.dress}
            onFeedback={handleFeedback}
          />
        ) : (
          <>
            {outfit.top && (
              <OutfitItem
                item={outfit.top}
                onFeedback={handleFeedback}
              />
            )}
            {outfit.bottom && (
              <OutfitItem
                item={outfit.bottom}
                onFeedback={handleFeedback}
              />
            )}
          </>
        )}

        {/* Display Outerwear if available */}
        {outfit.outerwear && (
          <OutfitItem
            item={outfit.outerwear}
            onFeedback={handleFeedback}
          />
        )}

        {/* Display Shoes */}
        <OutfitItem
          item={outfit.shoes}
          onFeedback={handleFeedback}
        />

        {/* Display Accessories */}
        {outfit.accessories.map((accessory, index) => (
          <OutfitItem
            key={`${accessory.id}-${index}`}
            item={accessory}
            onFeedback={handleFeedback}
          />
        ))}

        {/* Outfit Feedback Controls */}
        <View style={styles.feedbackControls}>
          <Text style={styles.feedbackTitle}>How does this outfit feel?</Text>
          <View style={styles.feedbackButtons}>
            <TouchableOpacity
              style={[styles.feedbackButton, styles.coldButton]}
              onPress={() => handleFeedback('too_cold', 'outfit')}
            >
              <Text>Too Cold</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.feedbackButton, styles.justRightButton]}
              onPress={() => handleFeedback('just_right', 'outfit')}
            >
              <Text>Just Right</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.feedbackButton, styles.hotButton]}
              onPress={() => handleFeedback('too_hot', 'outfit')}
            >
              <Text>Too Hot</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  // Return your existing component with the outfit section included in your bento box
  // ...existing return statement with renderOutfitSection() in the appropriate location
};

// Component for displaying individual clothing items with feedback options
interface OutfitItemProps {
  item: {
    id: string;
    name: string;
  };
  onFeedback: (feedback: 'too_cold' | 'too_hot' | 'just_right' | 'dislike', itemId: string) => void;
}

const OutfitItem: React.FC<OutfitItemProps> = ({ item, onFeedback }) => {
  const [showFeedback, setShowFeedback] = useState(false);

  return (
    <View style={styles.outfitItem}>
      <TouchableOpacity onPress={() => setShowFeedback(!showFeedback)}>
        <Text style={styles.itemName}>{item.name}</Text>
      </TouchableOpacity>

      {showFeedback && (
        <View style={styles.itemFeedback}>
          <TouchableOpacity
            style={styles.itemFeedbackButton}
            onPress={() => {
              onFeedback('dislike', item.id);
              setShowFeedback(false);
            }}
          >
            <Text>👎</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.itemFeedbackButton}
            onPress={() => {
              onFeedback('just_right', item.id);
              setShowFeedback(false);
            }}
          >
            <Text>👍</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  // Your existing styles...

  outfitContainer: {
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  outfitItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemName: {
    fontSize: 16,
  },
  itemFeedback: {
    flexDirection: 'row',
  },
  itemFeedbackButton: {
    padding: 8,
    marginLeft: 8,
  },
  feedbackControls: {
    marginTop: 16,
  },
  feedbackTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  feedbackButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  feedbackButton: {
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
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
