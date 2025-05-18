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

const SocialScreen: React.FC = () => {
  // Local state
  const [selectedFeed, setSelectedFeed] = useState<string>('explore');
  
  // Handle safe area insets for bottom padding (for NavBar)
  const insets = useSafeAreaInsets();
  const navBarTotalHeight = TAB_BAR_CONTENT_HEIGHT + insets.bottom;

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.screenTitle}>Social</Text>
        
        {/* Feed Selector Tabs */}
        <View style={styles.feedTabs}>
          <TouchableOpacity
            style={[
              styles.feedTab,
              selectedFeed === 'explore' ? styles.feedTabActive : {}
            ]}
            onPress={() => setSelectedFeed('explore')}
          >
            <Text 
              style={[
                styles.feedTabText,
                selectedFeed === 'explore' ? styles.feedTabTextActive : {}
              ]}
            >
              Explore
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.feedTab,
              selectedFeed === 'following' ? styles.feedTabActive : {}
            ]}
            onPress={() => setSelectedFeed('following')}
          >
            <Text 
              style={[
                styles.feedTabText,
                selectedFeed === 'following' ? styles.feedTabTextActive : {}
              ]}
            >
              Following
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.feedTab,
              selectedFeed === 'nearby' ? styles.feedTabActive : {}
            ]}
            onPress={() => setSelectedFeed('nearby')}
          >
            <Text 
              style={[
                styles.feedTabText,
                selectedFeed === 'nearby' ? styles.feedTabTextActive : {}
              ]}
            >
              Nearby
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Coming Soon Overlay */}
        <View style={[styles.comingSoonContainer, { marginBottom: navBarTotalHeight }]}>
          <View style={styles.premiumCard}>
            <Ionicons name="star" size={40} color={theme.colors.yellow} style={styles.premiumIcon} />
            <Text style={styles.premiumTitle}>Coming Soon! Premium Feature</Text>
            <Text style={styles.premiumDescription}>
              Connect with a community of weather-conscious fashion enthusiasts! Share your outfits, 
              see what others are wearing in similar conditions, and get inspired by trending styles 
              in your area. Follow friends and influencers to see their latest weather-appropriate looks.
            </Text>
            <TouchableOpacity style={styles.premiumButton}>
              <Text style={styles.premiumButtonText}>Learn More</Text>
            </TouchableOpacity>
          </View>
        </View>
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
  feedTabs: {
    flexDirection: 'row',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  feedTab: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 16,
  },
  feedTabActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#cccccc', // Lighter gray to indicate disabled
  },
  feedTabText: {
    ...typography.body,
    fontSize: 16,
    color: '#aaaaaa', // Grayed out
  },
  feedTabTextActive: {
    color: '#888888', // Darker but still grayed out
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

export default SocialScreen;