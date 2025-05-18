import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { typography, fonts } from '../styles/typography';
import { theme } from '../styles/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TAB_BAR_CONTENT_HEIGHT } from '../components/NavBar';

// Mock data for clothing items
const mockClothingItems = [
  { id: '1', name: 'White T-Shirt', type: 'top', favorite: true },
  { id: '2', name: 'Blue Jeans', type: 'bottom', favorite: false },
  { id: '3', name: 'Black Jacket', type: 'outerwear', favorite: true },
  { id: '4', name: 'Sneakers', type: 'shoes', favorite: false },
  { id: '5', name: 'Sunglasses', type: 'accessory', favorite: true },
  { id: '6', name: 'Beanie', type: 'accessory', favorite: false },
  { id: '7', name: 'Rain Coat', type: 'outerwear', favorite: false },
  { id: '8', name: 'Shorts', type: 'bottom', favorite: true },
];

// Item type for the clothing items
type ClothingItem = {
  id: string;
  name: string;
  type: 'top' | 'bottom' | 'outerwear' | 'shoes' | 'accessory';
  favorite: boolean;
};

const HangarScreen: React.FC = () => {
  // Local state
  const [selectedTab, setSelectedTab] = useState<string>('all');

  // Handle safe area insets for bottom padding (for NavBar)
  const insets = useSafeAreaInsets();
  const navBarTotalHeight = TAB_BAR_CONTENT_HEIGHT + insets.bottom;

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.container}>
        {/* Coming Soon Overlay */}
        <View style={[styles.comingSoonContainer, { marginBottom: navBarTotalHeight }]}>
          <View style={styles.premiumCard}>
            <Ionicons name="star" size={40} color={theme.colors.yellow} style={styles.premiumIcon} />
            <Text style={styles.premiumTitle}>Coming Soon! Premium Feature</Text>
            <Text style={styles.premiumDescription}>
              The Hangar lets you catalog your wardrobe and manage your personal clothing collection. Add items with photos, material info, and care instructions. Get outfit recommendations based on your actual clothes!
            </Text>
            <TouchableOpacity style={styles.premiumButton}>
              <Text style={styles.premiumButtonText}>Learn More</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.screenTitle}>My Hangar</Text>

        {/* Category Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabsContainer}
        >
          {['all', 'favorites', 'top', 'bottom', 'outerwear', 'shoes', 'accessory'].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tabButton,
                selectedTab === tab ? styles.tabButtonActive : {}
              ]}
              onPress={() => setSelectedTab(tab)}
            >
              <Text
                style={[
                  styles.tabButtonText,
                  selectedTab === tab ? styles.tabButtonTextActive : {}
                ]}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>


      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: theme.colors.white,
  },
  screenTitle: {
    ...typography.heading,
    marginBottom: 20,
    color: '#aaaaaa', // Grayed out to indicate it's disabled
  },
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0', // Lighter gray to indicate disabled state
  },
  tabButtonActive: {
    backgroundColor: '#e0e0e0',
    borderColor: '#e0e0e0',
  },
  tabButtonText: {
    ...typography.body,
    fontSize: 14,
    color: '#aaaaaa', // Grayed out
  },
  tabButtonTextActive: {
    color: '#888888', // Slightly darker but still grayed out
  },
  comingSoonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  premiumCard: {
    backgroundColor: theme.colors.white,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    maxWidth: 400,
  },
  premiumIcon: {
    marginBottom: 16,
  },
  premiumTitle: {
    ...typography.heading,
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 16,
  },
  premiumDescription: {
    ...typography.body,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  premiumButton: {
    backgroundColor: theme.colors.black,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  premiumButtonText: {
    ...typography.button,
    color: theme.colors.white,
  },
});

export default HangarScreen;
