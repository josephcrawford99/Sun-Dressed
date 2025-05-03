import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { typography } from '../../styles/typography';
import { getClothingImage } from '../../utils/clothingImages';
import PaginationDots from './PaginationDots';
import { OutfitRecommendation } from '../../services/outfitService';

// Get screen width for calculations
const { width } = Dimensions.get('window');

interface SwipeableOutfitViewProps {
  outfits: OutfitRecommendation[];
  onItemFeedback: (feedback: 'dislike' | 'just_right', itemId: string, categoryType: string) => void;
  onTemperatureFeedback: (feedback: 'too_cold' | 'too_hot' | 'just_right') => void;
  userPreferences: {
    favoriteItems: string[];
    avoidedItems: string[];
  };
  activeOutfitIndex?: number;
  onOutfitSwipe?: (index: number) => void;
}

/**
 * A component that displays multiple outfit recommendations in a swipeable view
 */
const SwipeableOutfitView: React.FC<SwipeableOutfitViewProps> = ({
  outfits,
  onItemFeedback,
  onTemperatureFeedback,
  userPreferences,
  activeOutfitIndex = 0,
  onOutfitSwipe,
}) => {
  const [currentOutfitIndex, setCurrentOutfitIndex] = useState(activeOutfitIndex);
  const scrollViewRef = useRef<ScrollView>(null);

  // Update scroll position when active index changes from external control
  useEffect(() => {
    if (activeOutfitIndex !== currentOutfitIndex) {
      setCurrentOutfitIndex(activeOutfitIndex);
      scrollViewRef.current?.scrollTo({
        x: width * activeOutfitIndex,
        animated: true,
      });
    }
  }, [activeOutfitIndex]);

  // Handle scroll end to update current outfit index
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / width);
    
    if (index !== currentOutfitIndex) {
      setCurrentOutfitIndex(index);
      if (onOutfitSwipe) {
        onOutfitSwipe(index);
      }
    }
  };

  // Render a single outfit page
  const renderOutfitPage = (outfit: OutfitRecommendation, index: number) => {
    return (
      <View key={index} style={styles.outfitPage}>
        {/* Temperature feedback controls */}
        <View style={styles.feedbackControls}>
          <Text style={styles.feedbackTitle}>How does this outfit feel?</Text>
          <View style={styles.feedbackButtons}>
            <TouchableOpacity
              style={[styles.feedbackButton, styles.coldButton]}
              onPress={() => onTemperatureFeedback('too_cold')}
            >
              <Ionicons name="snow-outline" size={16} color="#000" />
              <Text style={styles.feedbackButtonText}>Too Cold</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.feedbackButton, styles.justRightButton]}
              onPress={() => onTemperatureFeedback('just_right')}
            >
              <Ionicons name="checkmark-circle-outline" size={16} color="#000" />
              <Text style={styles.feedbackButtonText}>Just Right</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.feedbackButton, styles.hotButton]}
              onPress={() => onTemperatureFeedback('too_hot')}
            >
              <Ionicons name="flame-outline" size={16} color="#000" />
              <Text style={styles.feedbackButtonText}>Too Hot</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Outfit bento box grid */}
        <View style={styles.bentoBox}>
          <View style={styles.bentoCellRow}>
            <View style={styles.bentoCellColumn}>
              {/* Either render dress OR top+bottom */}
              {outfit.dress ? (
                renderClothingItem(outfit.dress, 'dress', 'Dress')
              ) : (
                <>
                  {renderClothingItem(outfit.top, 'top', 'Top')}
                  {renderClothingItem(outfit.bottom, 'bottom', 'Bottom')}
                </>
              )}
            </View>
            <View style={styles.bentoCellColumn}>
              {renderClothingItem(outfit.outerwear, 'outerwear', 'Outerwear')}
              {/* Show first accessory */}
              {outfit.accessories && outfit.accessories.length > 0 && 
                renderClothingItem(outfit.accessories[0], 'accessory', 'Accessory')}
              {renderClothingItem(outfit.shoes, 'shoes', 'Shoes')}
            </View>
          </View>
        </View>
      </View>
    );
  };

  // Render an individual clothing item
  const renderClothingItem = (item: any, category: 'top' | 'bottom' | 'dress' | 'outerwear' | 'shoes' | 'accessory', label: string) => {
    if (!item) return null;
    
    // Get the appropriate image for this item
    const itemImage = getClothingImage(item.id, category);
    
    // Check if this item has received feedback
    const isFavorite = userPreferences.favoriteItems.includes(item.id);
    const isAvoided = userPreferences.avoidedItems.includes(item.id);
    
    return (
      <View style={styles.bentoCellOuter}>
        <View style={styles.bentoCell}>
          <Image source={itemImage} style={styles.clothingImg} resizeMode="contain" />
          <Text 
            style={StyleSheet.flatten([typography.label, styles.bentoLabel])} 
            ellipsizeMode="tail" 
            numberOfLines={1}
          >
            {label}
          </Text>
          
          {/* Simplified feedback UI - only thumbs in lower right */}
          <View style={styles.thumbsContainer}>
            <TouchableOpacity
              style={[
                styles.thumbButton, 
                isAvoided && styles.thumbDownSelected
              ]}
              onPress={() => onItemFeedback(
                isAvoided ? 'remove_avoided' : 'dislike', 
                item.id, 
                category
              )}
            >
              <Ionicons 
                name="thumbs-down" 
                size={20} 
                color={isAvoided ? "#FFFFFF" : "#FF4757"} 
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.thumbButton,
                isFavorite && styles.thumbUpSelected
              ]}
              onPress={() => onItemFeedback(
                isFavorite ? 'remove_favorite' : 'just_right', 
                item.id, 
                category
              )}
            >
              <Ionicons 
                name="thumbs-up" 
                size={20} 
                color={isFavorite ? "#FFFFFF" : "#2ED573"} 
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  // If no outfits, render loading state
  if (!outfits || outfits.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading outfit recommendations...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Main outfit swipeable content */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        scrollEventThrottle={16}
        snapToInterval={width} // Snap to full width
        decelerationRate="fast"
        overScrollMode="never"
      >
        {outfits.map((outfit, index) => renderOutfitPage(outfit, index))}
      </ScrollView>
      
      {/* Pagination dots - positioned before action buttons */}
      <View style={styles.paginationContainer}>
        <PaginationDots total={outfits.length} activeIndex={currentOutfitIndex} />
      </View>
      
      {/* Action buttons */}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  scrollContent: {
    // No additional styles needed here
  },
  outfitPage: {
    width: width,
    alignItems: 'center', // Center content horizontally
    justifyContent: 'center', // Center content vertically
    paddingHorizontal: 0,
  },
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
  feedbackControls: {
    width: 320, // Match bentoBox width
    alignSelf: 'center', // Center in parent
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
  bentoBox: { 
    marginTop: 8, 
    marginBottom: 16,
    width: 320, // Fixed width
    alignSelf: 'center', // Center in parent
  },
  bentoCellRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    gap: 10,
  },
  bentoCellColumn: {
    width: 150, // Fixed width
    gap: 10,
  },
  bentoCellOuter: { 
    flex: 1, 
    margin: 0, 
    padding: 0 
  },
  bentoCell: { 
    backgroundColor: '#F5F5F5', 
    borderRadius: 12, 
    alignItems: 'center', 
    justifyContent: 'center', 
    height: 150, // Fixed height to match width of column
    position: 'relative', 
    width: '100%' 
  },
  clothingImg: { 
    width: 60, 
    height: 60, 
    marginTop: 8 
  },
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
  itemFeedback: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 12,
    padding: 4,
    zIndex: 10,
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
  // New styles for thumbs feedback UI
  thumbsContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 8,
    right: 8,
    zIndex: 10,
  },
  thumbButton: {
    padding: 6,
    marginHorizontal: 4,
    borderRadius: 6,
  },
  thumbUpSelected: {
    backgroundColor: '#2ED573',
    borderWidth: 1,
    borderColor: '#fff',
  },
  thumbDownSelected: {
    backgroundColor: '#FF4757',
    borderWidth: 1,
    borderColor: '#fff',
  },
  actionRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    width: 320, // Match bentoBox width
    alignSelf: 'center', // Center in parent
    marginTop: 12, 
    marginBottom: 10, // Space between buttons and pagination dots
  },
  actionButton: { 
    flex: 1, 
    backgroundColor: '#000', 
    borderRadius: 12, 
    marginHorizontal: 4, 
    height: 32, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  paginationContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    marginTop: 10,
    height: 40, // Increased height for visibility
    backgroundColor: '#f0f0f0', // Temporary background to see container boundaries
  },
});

export default SwipeableOutfitView;
