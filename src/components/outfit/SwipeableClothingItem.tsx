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
  NativeScrollEvent
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { typography } from '../../styles/typography';
import { getClothingImage } from '../../utils/clothingImages';
import PaginationDots from './PaginationDots';

// Get the screen width for calculations
const { width } = Dimensions.get('window');

interface ClothingItem {
  id: string;
  name: string;
  // ... other properties
}

interface SwipeableClothingItemProps {
  items: ClothingItem[];
  category: 'top' | 'bottom' | 'dress' | 'outerwear' | 'shoes' | 'accessory';
  label: string;
  onSwipe: (index: number) => void;
  activeIndex?: number; // Current active index (controlled component)
  onItemFeedback?: (feedback: 'dislike' | 'just_right', itemId: string) => void;
  favoriteItems?: string[];
  avoidedItems?: string[];
}

/**
 * A component that displays a swipeable clothing item with pagination dots
 */
const SwipeableClothingItem: React.FC<SwipeableClothingItemProps> = ({
  items,
  category,
  label,
  onSwipe,
  activeIndex: controlledIndex,
  onItemFeedback,
  favoriteItems = [],
  avoidedItems = [],
}) => {
  // Use controlled or uncontrolled active index
  const [activeIndex, setActiveIndex] = useState(controlledIndex || 0);
  const scrollViewRef = useRef<ScrollView>(null);
  const [feedbackVisible, setFeedbackVisible] = useState(false);

  // Update internal state when controlled prop changes
  useEffect(() => {
    if (controlledIndex !== undefined && controlledIndex !== activeIndex) {
      setActiveIndex(controlledIndex);
      // Scroll to the correct item
      scrollViewRef.current?.scrollTo({
        x: width * 0.425 * controlledIndex, // Adjust based on item width
        animated: false,
      });
    }
  }, [controlledIndex]);

  // If there are no items, render nothing
  if (!items || items.length === 0) {
    return null;
  }

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const cellWidth = width * 0.425; // Adjust based on item width
    const index = Math.round(contentOffsetX / cellWidth);
    
    if (index !== activeIndex) {
      setActiveIndex(index);
      onSwipe(index);
    }
  };

  const toggleFeedback = () => {
    setFeedbackVisible(!feedbackVisible);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        snapToInterval={width * 0.425} // Adjust based on item width
        decelerationRate="fast"
        contentContainerStyle={styles.scrollContent}
      >
        {items.map((item, index) => {
          const itemImage = getClothingImage(item.id, category);
          
          return (
            <View key={index} style={styles.bentoCell}>
              <TouchableOpacity 
                style={styles.cellContent} 
                onPress={toggleFeedback}
                activeOpacity={0.7}
              >
                <Image source={itemImage} style={styles.clothingImg} resizeMode="contain" />
                <Text 
                  style={StyleSheet.flatten([typography.label, styles.bentoLabel])} 
                  ellipsizeMode="tail" 
                  numberOfLines={1}
                >
                  {label}
                </Text>
                
                {/* Favorite/Avoided indicators */}
                {favoriteItems.includes(item.id) && (
                  <View style={styles.favoriteIndicator}>
                    <Ionicons name="heart" size={16} color="#FF6B81" />
                  </View>
                )}
                {avoidedItems.includes(item.id) && (
                  <View style={styles.avoidedIndicator}>
                    <Ionicons name="close-circle" size={16} color="#FF4757" />
                  </View>
                )}
                
                {/* Feedback UI */}
                {feedbackVisible && onItemFeedback && (
                  <View style={styles.itemFeedback}>
                    <TouchableOpacity
                      style={styles.itemFeedbackButton}
                      onPress={() => {
                        onItemFeedback('dislike', item.id);
                        setFeedbackVisible(false);
                      }}
                    >
                      <Ionicons name="thumbs-down" size={20} color="#FF4757" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.itemFeedbackButton}
                      onPress={() => {
                        onItemFeedback('just_right', item.id);
                        setFeedbackVisible(false);
                      }}
                    >
                      <Ionicons name="thumbs-up" size={20} color="#2ED573" />
                    </TouchableOpacity>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>
      
      {/* Pagination dots */}
      <PaginationDots total={items.length} activeIndex={activeIndex} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingRight: 10, // Add padding to ensure the last item is visible
  },
  bentoCell: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    width: width * 0.425, // Sizing based on screen width
    height: 120,
    marginRight: 10,
  },
  cellContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  clothingImg: {
    width: 60,
    height: 60,
    marginTop: 8,
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
});

export default SwipeableClothingItem;
