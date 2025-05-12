import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { navigationRef, setNavigationReady } from './navigationRef';

import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';
import LocationScreen from '../screens/LocationScreen';
import AuthScreen from '../screens/AuthScreen';
import AccountScreen from '../screens/AccountScreen';

// Define the main navigation stack parameter types
export type RootStackParamList = {
  Home: undefined;
  Settings: undefined;
  Location: undefined;
  Account: undefined;
  Auth: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

interface AppNavigatorProps {
  initialRoute?: keyof RootStackParamList;
}

const AppNavigator: React.FC<AppNavigatorProps> = ({ 
  initialRoute = 'Home' 
}) => {
  return (
    <NavigationContainer 
      ref={navigationRef}
      onReady={() => setNavigationReady(true)}
      onStateChange={() => {
        // Ensure navigation is marked as ready whenever state changes
        if (!navigationRef.current) {
          setNavigationReady(false);
        }
      }}
    >
      <Stack.Navigator
        initialRouteName={initialRoute}
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
        <Stack.Screen
          name="Auth"
          component={AuthScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
