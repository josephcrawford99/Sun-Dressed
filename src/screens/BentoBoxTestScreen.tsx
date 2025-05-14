import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView,
  ScrollView
} from 'react-native';
import BentoBox, { OutfitData } from '../components/BentoBox';
import { theme } from '../styles/theme';
import { typography } from '../styles/typography';

const BentoBoxTestScreen: React.FC = () => {
  // Regular outfit (top + bottom)
  const regularOutfit: OutfitData = {
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

  // Dress outfit
  const dressOutfit: OutfitData = {
    id: 'outfit-dress',
    dress: {
      id: 'dress-1',
      type: 'dress',
      name: 'Summer Dress',
    },
    outerwear: [
      {
        id: 'outerwear-2',
        type: 'outerwear',
        name: 'Cardigan',
      },
    ],
    accessories: [
      {
        id: 'accessory-2',
        type: 'accessory',
        name: 'Necklace',
      },
      {
        id: 'accessory-3',
        type: 'accessory',
        name: 'Bracelet',
      },
    ],
    shoes: {
      id: 'shoes-2',
      type: 'shoes',
      name: 'Sandals',
    },
  };

  // Cold weather outfit (multiple outerwear)
  const coldWeatherOutfit: OutfitData = {
    id: 'outfit-cold',
    top: {
      id: 'top-2',
      type: 'top',
      name: 'Sweater',
    },
    bottom: {
      id: 'bottom-2',
      type: 'bottom',
      name: 'Wool Pants',
    },
    outerwear: [
      {
        id: 'outerwear-3',
        type: 'outerwear',
        name: 'Winter Coat',
      },
      {
        id: 'outerwear-4',
        type: 'outerwear',
        name: 'Scarf',
      },
    ],
    accessories: [
      {
        id: 'accessory-4',
        type: 'accessory',
        name: 'Gloves',
      },
      {
        id: 'accessory-5',
        type: 'accessory',
        name: 'Beanie',
      },
    ],
    shoes: {
      id: 'shoes-3',
      type: 'shoes',
      name: 'Boots',
    },
  };

  // Rainy day outfit
  const rainyDayOutfit: OutfitData = {
    id: 'outfit-rainy',
    top: {
      id: 'top-3',
      type: 'top',
      name: 'Long Sleeve',
    },
    bottom: {
      id: 'bottom-3',
      type: 'bottom',
      name: 'Black Jeans',
    },
    outerwear: [
      {
        id: 'outerwear-5',
        type: 'outerwear',
        name: 'Rain Jacket',
      },
    ],
    accessories: [
      {
        id: 'accessory-6',
        type: 'accessory',
        name: 'Umbrella',
      },
      {
        id: 'accessory-7',
        type: 'accessory',
        name: 'Hat',
      },
      {
        id: 'accessory-8',
        type: 'accessory',
        name: 'Bag',
      },
    ],
    shoes: {
      id: 'shoes-4',
      type: 'shoes',
      name: 'Rain Boots',
    },
  };

  // State to track which outfit is currently displayed
  const [currentOutfit, setCurrentOutfit] = useState<'regular' | 'dress' | 'cold' | 'rainy'>('regular');

  // Helper function to get the current outfit data
  const getOutfitData = () => {
    switch (currentOutfit) {
      case 'dress':
        return dressOutfit;
      case 'cold':
        return coldWeatherOutfit;
      case 'rainy':
        return rainyDayOutfit;
      default:
        return regularOutfit;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>BentoBox Component Test</Text>
        <Text style={styles.subtitle}>Tap on any element to expand it</Text>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, currentOutfit === 'regular' ? styles.activeButton : {}]} 
            onPress={() => setCurrentOutfit('regular')}
          >
            <Text style={[styles.buttonText, currentOutfit === 'regular' ? styles.activeButtonText : {}]}>Regular</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, currentOutfit === 'dress' ? styles.activeButton : {}]} 
            onPress={() => setCurrentOutfit('dress')}
          >
            <Text style={[styles.buttonText, currentOutfit === 'dress' ? styles.activeButtonText : {}]}>Dress</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, currentOutfit === 'cold' ? styles.activeButton : {}]} 
            onPress={() => setCurrentOutfit('cold')}
          >
            <Text style={[styles.buttonText, currentOutfit === 'cold' ? styles.activeButtonText : {}]}>Cold</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, currentOutfit === 'rainy' ? styles.activeButton : {}]} 
            onPress={() => setCurrentOutfit('rainy')}
          >
            <Text style={[styles.buttonText, currentOutfit === 'rainy' ? styles.activeButtonText : {}]}>Rainy</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.bentoBoxContainer}>
          <BentoBox outfitData={getOutfitData()} />
        </View>
        
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Current Layout</Text>
          <Text style={styles.infoDescription}>
            {currentOutfit === 'dress' 
              ? '• Using Dress element (merges Top/Bottom)' 
              : '• Using separate Top and Bottom elements'}
          </Text>
          <Text style={styles.infoDescription}>
            • Outerwear items: {getOutfitData().outerwear.length}
          </Text>
          <Text style={styles.infoDescription}>
            • Accessory items: {getOutfitData().accessories.length}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  container: {
    padding: theme.spacing.md,
  },
  title: {
    ...typography.heading,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    ...typography.body,
    marginBottom: theme.spacing.lg,
    color: theme.colors.gray,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  button: {
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.black,
    borderRadius: theme.borderRadius.medium,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeButton: {
    backgroundColor: theme.colors.black,
  },
  buttonText: {
    ...typography.label,
    color: theme.colors.black,
  },
  activeButtonText: {
    color: theme.colors.white,
  },
  bentoBoxContainer: {
    minHeight: 400,
    marginBottom: theme.spacing.md,
    borderRadius: theme.borderRadius.large,
    backgroundColor: '#f5f5f5',
    overflow: 'hidden',
  },
  infoContainer: {
    padding: theme.spacing.md,
    backgroundColor: '#f5f5f5',
    borderRadius: theme.borderRadius.medium,
  },
  infoTitle: {
    ...typography.subheading,
    marginBottom: theme.spacing.sm,
  },
  infoDescription: {
    ...typography.body,
    marginBottom: theme.spacing.xs,
  },
});

export default BentoBoxTestScreen;
