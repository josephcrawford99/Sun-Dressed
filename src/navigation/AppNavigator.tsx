import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';
import LocationScreen from '../screens/LocationScreen';
import AccountScreen from '../screens/AccountScreen';

// Define the main navigation stack parameter types
export type RootStackParamList = {
  Home: undefined;
  Settings: undefined;
  Location: undefined;
  Account: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
        />
        <Stack.Screen
          name="Location"
          component={LocationScreen}
        />
        <Stack.Screen
          name="Account"
          component={AccountScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
