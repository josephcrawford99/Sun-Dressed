import React from 'react';
import { View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

interface SafeAreaWrapperProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export default function SafeAreaWrapper({ children, style }: SafeAreaWrapperProps) {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  
  // For absolute positioned tab bars, we need the tab bar height
  // plus any additional safe area beyond what the tab bar already handles
  const bottomPadding = Math.max(tabBarHeight, insets.bottom);
  
  return (
    <View style={[
      { 
        flex: 1, 
        paddingBottom: bottomPadding,
        paddingTop: insets.top 
      }, 
      style
    ]}>
      {children}
    </View>
  );
}