import React, { useState, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../styles/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

export enum TabID {
  HOME = 'home',
  HANGAR = 'hangar',
  SOCIAL = 'social',
  SETTINGS = 'settings'
}

export const TAB_BAR_CONTENT_HEIGHT = 60;

interface TabButtonProps {
  iconName: keyof typeof Ionicons.glyphMap;
  isActive: boolean;
  onPress: () => void;
  accessibilityLabel: string;
}

interface NavBarProps {
  activeTab?: TabID;
  onTabChange?: (tabId: TabID) => void;
  initialTab?: TabID;
}

const TabButton: React.FC<TabButtonProps> = ({
  iconName,
  isActive,
  onPress,
  accessibilityLabel
}) => {
  return (
    <TouchableOpacity
      style={styles.tabButton}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: isActive }}
      accessibilityLabel={accessibilityLabel}
    >
      <Ionicons
        name={iconName}
        size={28}
        color={isActive ? theme.colors.black : theme.colors.gray}
      />
    </TouchableOpacity>
  );
};

const NavBar: React.FC<NavBarProps> = ({
  activeTab: controlledActiveTab,
  onTabChange = () => {},
  initialTab = TabID.HOME,
}) => {
  const [internalActiveTab, setInternalActiveTab] = useState<TabID>(initialTab);
  const currentActiveTab = controlledActiveTab !== undefined ? controlledActiveTab : internalActiveTab;

  useEffect(() => {
    if (controlledActiveTab === undefined) {
      setInternalActiveTab(initialTab);
    }
  }, [initialTab, controlledActiveTab]);
  
  useEffect(() => {
    if (controlledActiveTab !== undefined) {
        setInternalActiveTab(controlledActiveTab);
    }
  }, [controlledActiveTab]);

  const handleTabPress = (tabId: TabID) => {
    if (controlledActiveTab === undefined) {
      setInternalActiveTab(tabId);
    }
    onTabChange(tabId);
  };

  return (
    <SafeAreaView edges={['bottom']} style={styles.safeAreaWrapper}>
      <View style={styles.container}>
        <TabButton
          iconName="partly-sunny-outline"
          isActive={currentActiveTab === TabID.HOME}
          onPress={() => handleTabPress(TabID.HOME)}
          accessibilityLabel="Home tab"
        />
        <TabButton
          iconName="shirt-outline"
          isActive={currentActiveTab === TabID.HANGAR}
          onPress={() => handleTabPress(TabID.HANGAR)}
          accessibilityLabel="Hangar tab"
        />
        <TabButton
          iconName="globe-outline"
          isActive={currentActiveTab === TabID.SOCIAL}
          onPress={() => handleTabPress(TabID.SOCIAL)}
          accessibilityLabel="Social tab"
        />
        <TabButton
          iconName="person-outline"
          isActive={currentActiveTab === TabID.SETTINGS}
          onPress={() => handleTabPress(TabID.SETTINGS)}
          accessibilityLabel="Account tab"
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.white,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    height: TAB_BAR_CONTENT_HEIGHT,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    ...Platform.select({
      ios: {
        shadowColor: theme.colors.black,
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
});

export default NavBar;