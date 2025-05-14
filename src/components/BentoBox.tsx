import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Animated, 
  Easing,
  LayoutAnimation,
  Platform,
  UIManager
} from 'react-native';
import { theme } from '../styles/theme';
import { fonts } from '../styles/typography';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

// Mock data interface
export interface OutfitItemData {
  id: string;
  type: 'top' | 'bottom' | 'dress' | 'outerwear' | 'accessory' | 'shoes';
  name: string;
}

export interface OutfitData {
  id: string;
  top?: OutfitItemData;
  bottom?: OutfitItemData;
  dress?: OutfitItemData;
  outerwear: OutfitItemData[];
  accessories: OutfitItemData[];
  shoes: OutfitItemData;
}

// OutfitElement component
const OutfitElement: React.FC<{
  data: OutfitItemData;
  expanded: boolean;
  onToggle: () => void;
  style?: any;
}> = ({ data, expanded, onToggle, style }) => {
  // Animation refs
  const heightAnimation = useRef(new Animated.Value(expanded ? 1 : 0)).current;
  const rotationAnimation = useRef(new Animated.Value(expanded ? 0 : 1)).current;

  useEffect(() => {
    // Configure animations
    Animated.parallel([
      Animated.timing(heightAnimation, {
        toValue: expanded ? 1 : 0,
        duration: 300,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: false,
      }),
      Animated.timing(rotationAnimation, {
        toValue: expanded ? 0 : 1,
        duration: 300,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  }, [expanded, heightAnimation, rotationAnimation]);

  // Interpolate height based on element type
  const getHeightInterpolation = () => {
    const baseHeight = 80;
    const expandedHeight = 160;
    
    switch (data.type) {
      case 'outerwear':
      case 'accessory':
        return {
          inputRange: [0, 1],
          outputRange: [baseHeight / 1.5, expandedHeight],
        };
      case 'shoes':
        return {
          inputRange: [0, 1],
          outputRange: [baseHeight / 1.2, expandedHeight],
        };
      default:
        return {
          inputRange: [0, 1],
          outputRange: [baseHeight, expandedHeight],
        };
    }
  };

  const height = heightAnimation.interpolate(getHeightInterpolation());
  
  const rotation = rotationAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-90deg'],
  });

  const labelPosition = rotationAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '-50%'],
  });

  return (
    <TouchableOpacity 
      activeOpacity={0.9}
      onPress={onToggle}
      style={[styles.elementTouchable, style]}
    >
      <Animated.View 
        style={[
          styles.elementContainer,
          { height },
          expanded && styles.expandedElement,
        ]}
      >
        <Animated.Text 
          style={[
            styles.elementLabel,
            {
              transform: [{ rotate: rotation }],
              left: expanded ? null : 10,
              bottom: expanded ? 10 : null,
              top: expanded ? null : '50%',
              marginTop: expanded ? null : -10,
            },
          ]}
        >
          {data.name}
        </Animated.Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

// OutfitGrid component
const OutfitGrid: React.FC<{
  outfitData: OutfitData;
  expandedElement: string | null;
  onToggleElement: (id: string) => void;
}> = ({ outfitData, expandedElement, onToggleElement }) => {
  return (
    <View style={styles.gridContainer}>
      {/* Left Column */}
      <View style={styles.leftColumn}>
        {outfitData.dress ? (
          <OutfitElement 
            data={outfitData.dress}
            expanded={expandedElement === outfitData.dress.id}
            onToggle={() => onToggleElement(outfitData.dress!.id)}
            style={styles.dressElement}
          />
        ) : (
          <>
            {outfitData.top && (
              <OutfitElement 
                data={outfitData.top}
                expanded={expandedElement === outfitData.top.id}
                onToggle={() => onToggleElement(outfitData.top!.id)}
                style={styles.topElement}
              />
            )}
            {outfitData.bottom && (
              <OutfitElement 
                data={outfitData.bottom}
                expanded={expandedElement === outfitData.bottom.id}
                onToggle={() => onToggleElement(outfitData.bottom!.id)}
                style={styles.bottomElement}
              />
            )}
          </>
        )}
      </View>

      {/* Right Column */}
      <View style={styles.rightColumn}>
        {/* Outerwear Section */}
        <View style={styles.outerwearContainer}>
          {outfitData.outerwear.map((item) => (
            <OutfitElement 
              key={item.id}
              data={item}
              expanded={expandedElement === item.id}
              onToggle={() => onToggleElement(item.id)}
              style={styles.outerwearElement}
            />
          ))}
        </View>

        {/* Accessories Section */}
        <View style={styles.accessoriesContainer}>
          {outfitData.accessories.map((item) => (
            <OutfitElement 
              key={item.id}
              data={item}
              expanded={expandedElement === item.id}
              onToggle={() => onToggleElement(item.id)}
              style={styles.accessoryElement}
            />
          ))}
        </View>

        {/* Shoes Section */}
        <OutfitElement 
          data={outfitData.shoes}
          expanded={expandedElement === outfitData.shoes.id}
          onToggle={() => onToggleElement(outfitData.shoes.id)}
          style={styles.shoesElement}
        />
      </View>
    </View>
  );
};

// Main BentoBox component
const BentoBox: React.FC<{
  outfitData: OutfitData;
}> = ({ outfitData }) => {
  const [expandedElement, setExpandedElement] = useState<string | null>(null);
  
  const handleToggle = (elementId: string) => {
    // Configure LayoutAnimation for smoother transitions
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    
    setExpandedElement(expandedElement === elementId ? null : elementId);
  };
  
  return (
    <View style={styles.bentoContainer}>
      <OutfitGrid 
        outfitData={outfitData}
        expandedElement={expandedElement}
        onToggleElement={handleToggle}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  bentoContainer: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.large,
    padding: theme.spacing.md,
    flex: 1,
  },
  gridContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },
  leftColumn: {
    flex: 2,
    marginRight: theme.spacing.xs,
  },
  rightColumn: {
    flex: 3,
    marginLeft: theme.spacing.xs,
  },
  outerwearContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  accessoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: theme.spacing.sm,
  },
  elementTouchable: {
    marginBottom: theme.spacing.sm,
  },
  elementContainer: {
    backgroundColor: theme.colors.gray,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.sm,
    justifyContent: 'center',
    position: 'relative',
  },
  expandedElement: {
    backgroundColor: '#656565',
  },
  elementLabel: {
    position: 'absolute',
    fontFamily: fonts.secondaryMedium,
    fontStyle: 'italic',
    fontSize: 14,
    color: '#e0e0e0',
    fontWeight: '500',
  },
  // Specific element styles
  topElement: {
    flex: 1,
    marginBottom: theme.spacing.sm,
  },
  bottomElement: {
    flex: 1,
  },
  dressElement: {
    flex: 1,
  },
  outerwearElement: {
    width: '48%',
  },
  accessoryElement: {
    width: '48%',
  },
  shoesElement: {
    marginTop: theme.spacing.sm,
  },
});

export default BentoBox;

// Export test component with mock data
export const BentoBoxTest: React.FC = () => {
  // Mock data for testing
  const testOutfitData: OutfitData = {
    id: 'outfit-1',
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
        name: 'Sweater',
      },
      {
        id: 'outerwear-2',
        type: 'outerwear',
        name: 'Jacket',
      },
    ],
    accessories: [
      {
        id: 'accessory-1',
        type: 'accessory',
        name: 'Scarf',
      },
      {
        id: 'accessory-2',
        type: 'accessory',
        name: 'Hat',
      },
    ],
    shoes: {
      id: 'shoes-1',
      type: 'shoes',
      name: 'Sneakers',
    },
  };

  // Test with dress instead of top/bottom
  const testDressOutfitData: OutfitData = {
    id: 'outfit-2',
    dress: {
      id: 'dress-1',
      type: 'dress',
      name: 'Summer Dress',
    },
    outerwear: [
      {
        id: 'outerwear-3',
        type: 'outerwear',
        name: 'Light Jacket',
      },
    ],
    accessories: [
      {
        id: 'accessory-3',
        type: 'accessory',
        name: 'Sunglasses',
      },
      {
        id: 'accessory-4',
        type: 'accessory',
        name: 'Bracelet',
      },
      {
        id: 'accessory-5',
        type: 'accessory',
        name: 'Necklace',
      },
    ],
    shoes: {
      id: 'shoes-2',
      type: 'shoes',
      name: 'Sandals',
    },
  };

  const [currentOutfit, setCurrentOutfit] = useState<'regular' | 'dress'>('regular');

  const toggleOutfitType = () => {
    setCurrentOutfit(currentOutfit === 'regular' ? 'dress' : 'regular');
  };

  return (
    <View style={testStyles.container}>
      <TouchableOpacity 
        style={testStyles.toggleButton} 
        onPress={toggleOutfitType}
      >
        <Text style={testStyles.buttonText}>
          Toggle to {currentOutfit === 'regular' ? 'Dress' : 'Separates'} Outfit
        </Text>
      </TouchableOpacity>
      
      <BentoBox 
        outfitData={currentOutfit === 'regular' ? testOutfitData : testDressOutfitData} 
      />
      
      <Text style={testStyles.instructions}>
        Tap on any element to expand/collapse it
      </Text>
    </View>
  );
};

const testStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.white,
  },
  toggleButton: {
    backgroundColor: '#6d9eeb',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.medium,
    marginBottom: theme.spacing.md,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  instructions: {
    textAlign: 'center',
    marginTop: theme.spacing.md,
    color: theme.colors.gray,
  },
});
