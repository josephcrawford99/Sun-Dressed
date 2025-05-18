import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StyleProp,
  ViewStyle
} from 'react-native';
import { theme } from '../styles/theme';
import { fonts } from '../styles/typography';

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

// OutfitElement component to display individual clothing items
interface OutfitElementProps {
  data: OutfitItemData;
  style?: StyleProp<ViewStyle>;
}

const OutfitElement = ({ data, style }: OutfitElementProps): React.ReactElement => {
  return (
    <View style={[styles.elementContainer, style]}>
      <View style={styles.labelContainer}>
        <Text style={styles.elementLabel}>{data.name}</Text>
      </View>
      <Text style={styles.elementName}>{data.type}</Text>
    </View>
  );
};

// The main grid layout component
interface OutfitGridProps {
  outfitData: OutfitData;
}

const OutfitGrid = ({ outfitData }: OutfitGridProps): React.ReactElement => {
  return (
    <View style={styles.gridContainer}>
      {/* Left Column - Contains Top/Bottom or Dress */}
      <View style={styles.leftColumn}>
        {outfitData.dress ? (
          <OutfitElement
            data={outfitData.dress}
            style={styles.dressElement}
          />
        ) : (
          <>
            <OutfitElement
              data={outfitData.top || {
                id: 'empty-top',
                type: 'top',
                name: 'No Top'
              }}
              style={styles.topElement}
            />
            <OutfitElement
              data={outfitData.bottom || {
                id: 'empty-bottom',
                type: 'bottom',
                name: 'No Bottom'
              }}
              style={styles.bottomElement}
            />
          </>
        )}
      </View>

      {/* Right Column */}
      <View style={styles.rightColumn}>
        {/* Outerwear Section - Items display side by side */}
        <View style={styles.outerwearContainer}>
          {outfitData.outerwear.length > 0 ? (
            outfitData.outerwear.map((item: OutfitItemData, index: number) => (
              <OutfitElement
                key={item.id}
                data={item}
                style={[
                  styles.outerwearElement,
                  {
                    width: `${100 / Math.max(outfitData.outerwear.length, 1) - (outfitData.outerwear.length > 1 ? 2 : 0)}%`,
                  }
                ]}
              />
            ))
          ) : (
            <OutfitElement
              data={{
                id: 'empty-outerwear',
                type: 'outerwear',
                name: 'No Outerwear'
              }}
              style={styles.outerwearElement}
            />
          )}
        </View>

        {/* Accessories Section */}
        <View style={styles.accessoriesContainer}>
          {outfitData.accessories.length > 0 ? (
            outfitData.accessories.map((item: OutfitItemData, index: number) => (
              <OutfitElement
                key={item.id}
                data={item}
                style={[
                  styles.accessoryElement,
                  {
                    height: outfitData.accessories.length > 2
                      ? 80 / Math.min(outfitData.accessories.length, 3)
                      : undefined,
                    width: outfitData.accessories.length <= 2
                      ? `${100 / Math.max(outfitData.accessories.length, 1) - (outfitData.accessories.length > 1 ? 2 : 0)}%`
                      : `${100 / Math.min(outfitData.accessories.length, 2) - 2}%`,
                  }
                ]}
              />
            ))
          ) : (
            <OutfitElement
              data={{
                id: 'empty-accessory',
                type: 'accessory',
                name: 'No Accessories'
              }}
              style={styles.accessoryElement}
            />
          )}
        </View>

        {/* Shoes Section */}
        <OutfitElement
          data={outfitData.shoes || {
            id: 'empty-shoes',
            type: 'shoes',
            name: 'No Shoes'
          }}
          style={styles.shoesElement}
        />
      </View>
    </View>
  );
};

// Main BentoBox component props
interface BentoBoxProps {
  outfitData: OutfitData;
}

// Main BentoBox component
const BentoBox = ({ outfitData }: BentoBoxProps): React.ReactElement => {
  return (
    <View style={styles.bentoContainer}>
      <OutfitGrid outfitData={outfitData} />
    </View>
  );
};

const styles = StyleSheet.create({
  bentoContainer: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.large,
    padding: theme.spacing.sm,
    flex: 1,
    width: '100%',
    height: '100%',
  },
  gridContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
    gap: 10,
    width: '100%',
    height: '100%',
  },
  leftColumn: {
    flex: 2,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  rightColumn: {
    flex: 3,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  outerwearContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    flex: 3,
    minHeight: 110,
  },
  accessoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
    flex: 3,
    minHeight: 110,
    marginVertical: 10,
  },
  elementContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    minHeight: 80,
  },
  labelContainer: {
    position: 'absolute',
    left: 5,
    top: 5,
    width: 24,
    height: 80,
    zIndex: 2,
  },
  elementLabel: {
    position: 'absolute',
    fontFamily: fonts.secondaryMedium,
    fontWeight: '500',
    fontSize: 14,
    color: '#757575',
    transform: [{ rotate: '-90deg' }],
    transformOrigin: '0% 0%', // This works for web
    left: 0,
    bottom: 0,
    width: 80,
  },
  elementName: {
    fontFamily: fonts.secondary,
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginTop: 20,
  },
  // Specific element styles
  topElement: {
    flex: 1, // This will make it take up available space
    marginBottom: 10,
  },
  bottomElement: {
    flex: 1, // This will make it take up available space
    // Remove the height: '49%'
  },
  dressElement: {
    flex: 1,
    height: '100%',
    minHeight: 250,
  },
  outerwearElement: {
    // Width is calculated dynamically
    minHeight: 100,
  },
  accessoryElement: {
    // Width and height are calculated dynamically
    minHeight: 100,
  },
  shoesElement: {
    flex: 3,
    minHeight: 100,
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

  const [currentOutfit, setCurrentOutfit] = React.useState<'regular' | 'dress'>('regular');

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
        This is a static BentoBox display
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
