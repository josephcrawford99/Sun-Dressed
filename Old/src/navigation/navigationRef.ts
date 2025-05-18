import React from 'react';
import { NavigationContainerRef, ParamListBase } from '@react-navigation/native';
import { RootStackParamList } from './AppNavigator';

/**
 * A React ref that will be used to store a reference to the navigation object.
 * This allows us to navigate from anywhere in the app without needing to pass
 * navigation props through component trees or use the useNavigation hook (which
 * requires the component to be a descendant of NavigationContainer).
 */
export const navigationRef = React.createRef<NavigationContainerRef<RootStackParamList>>();

// Track if the navigation is ready
let isReady = false;

/**
 * Set the navigation ready state
 * This should be called when the NavigationContainer's onReady event fires
 */
export function setNavigationReady(ready: boolean) {
  isReady = ready;
  if (ready) {
    console.log('Navigation is now ready for use');
  }
}

/**
 * Navigate to a screen using the shared navigation reference
 * Can be called from anywhere in the app
 * 
 * @param name The name of the screen to navigate to
 * @param params The params to pass to the screen
 * @returns boolean indicating if navigation was successful
 */
export function navigate<RouteName extends keyof RootStackParamList>(
  name: RouteName,
  params?: RootStackParamList[RouteName]
): boolean {
  if (navigationRef.current && isReady) {
    // Only navigate if the navigation ref is available and ready
    navigationRef.current.navigate(name as string, params);
    return true;
  } else {
    // Handle the case where navigation ref isn't ready yet
    console.warn('Navigation attempted before navigationRef was ready');
    return false;
  }
}

/**
 * Go back to the previous screen
 * @returns boolean indicating if navigation was successful
 */
export function goBack(): boolean {
  if (navigationRef.current && isReady) {
    navigationRef.current.goBack();
    return true;
  } else {
    console.warn('Navigation attempted before navigationRef was ready');
    return false;
  }
}

/**
 * Reset the navigation state to a given state
 * @returns boolean indicating if reset was successful
 */
export function reset(state: any): boolean {
  if (navigationRef.current && isReady) {
    navigationRef.current.reset(state);
    return true;
  } else {
    console.warn('Navigation attempted before navigationRef was ready');
    return false;
  }
}

/**
 * Check if a navigation reference is initialized and ready
 */
export function isNavigationReady(): boolean {
  return navigationRef.current !== null && isReady;
}

/**
 * Get the current route name
 * @returns the current route name or null if navigation is not ready
 */
export function getCurrentRouteName(): string | null {
  if (navigationRef.current && isReady) {
    return navigationRef.current.getCurrentRoute()?.name || null;
  }
  return null;
}

/**
 * Check if the current route is a specified route
 * @param routeName The route name to check
 * @returns boolean indicating if the current route matches the specified route
 */
export function isCurrentRoute(routeName: keyof RootStackParamList): boolean {
  return getCurrentRouteName() === routeName;
}
