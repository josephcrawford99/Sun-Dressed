import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import {
  useFonts,
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_700Bold
} from '@expo-google-fonts/montserrat';
import {
  LibreBaskerville_400Regular,
  LibreBaskerville_700Bold,
  LibreBaskerville_400Regular_Italic
} from '@expo-google-fonts/libre-baskerville';

import { theme } from './src/styles/theme';

import HomeScreen from './src/screens/HomeScreen';
import AccountScreen from './src/screens/AccountScreen';
import HangarScreen from './src/screens/HangarScreen';
import SocialScreen from './src/screens/SocialScreen';
import AuthScreen from './src/screens/AuthScreen';
import NavBar, { TabID } from './src/components/NavBar';

class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: Error | null}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Something went wrong</Text>
          <Text style={styles.errorMessage}>An error occurred in the application. Please reload.</Text>
          {__DEV__ && this.state.error && (
            <Text style={styles.errorDetails}>{this.state.error.toString()}</Text>
          )}
        </View>
      );
    }

    return this.props.children;
  }
}

const MainContent = () => {
  const isLoading = false;
  const [currentScreen, setCurrentScreen] = useState<'auth' | 'main'>('main');
  const [activeUITab, setActiveUITab] = useState<TabID>(TabID.HOME);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (currentScreen === 'auth') {
    return <AuthScreen />;
  }

  const handleTabChange = (tabId: TabID) => {
    console.log("Tab changed to:", tabId);
    setActiveUITab(tabId);
  };

  let ScreenComponent;
  switch (activeUITab) {
    case TabID.HOME:
      ScreenComponent = HomeScreen;
      break;
    case TabID.SETTINGS:
      ScreenComponent = AccountScreen;
      break;
    case TabID.HANGAR:
      ScreenComponent = HangarScreen;
      break;
    case TabID.SOCIAL:
      ScreenComponent = SocialScreen;
      break;
    default:
      ScreenComponent = HomeScreen;
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.white }}>
      <ScreenComponent />
      <NavBar activeTab={activeUITab} onTabChange={handleTabChange} />
    </View>
  );
};

export default function App() {
  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_700Bold,
    LibreBaskerville_400Regular,
    LibreBaskerville_700Bold,
    LibreBaskerville_400Regular_Italic,
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <MainContent />
        <StatusBar style="auto" />
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  errorMessage: {
    marginBottom: 10,
    textAlign: 'center',
  },
  errorDetails: {
    marginTop: 10,
    color: 'red',
    textAlign: 'center',
  }
});
