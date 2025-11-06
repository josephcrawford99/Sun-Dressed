import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].iconTint,
        headerShown: false,
        tabBarButton: HapticTab,
        animation: 'fade',
        transitionSpec: {
          animation: 'timing',
          config: {
            duration: 100,
          },
        }}}>

      <Tabs.Screen
        name="weather"
        options={{
          title: 'Weather',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="weather" color={color} />,
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Outfit',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="outfit" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="settings" color={color} />,
        }}
      />
      <Tabs.Screen
        name="debug"
        options={{
          title: 'Debug',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="debug" color={color} />,
          href: __DEV__ ? '/debug' : null,
        }}
      />
    </Tabs>
  );
}
