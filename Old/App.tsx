import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from './src/utils/ThemeContext';
import AppNavigator from './src/navigation/AppNavigator';
import { View, Text, ActivityIndicator, Platform } from 'react-native';
import { AuthProvider, useAuth } from './src/utils/AuthContext';
import { SettingsProvider } from './src/utils/SettingsContext';
import AuthScreen from './src/screens/AuthScreen';
import { useFonts as useMontserrat, Montserrat_400Regular, Montserrat_500Medium, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import { useFonts as useLibre, LibreBaskerville_400Regular, LibreBaskerville_700Bold, LibreBaskerville_400Regular_Italic } from '@expo-google-fonts/libre-baskerville';
import DevClearDataHeader from './src/components/DevClearDataHeader';

// Web platform polyfill for AsyncStorage
if (Platform.OS === 'web') {
  require('react-native-web');
}

// Simple error boundary component
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
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>Something went wrong</Text>
          <Text>An error occurred in the application. Please reload.</Text>
          {__DEV__ && this.state.error && (
            <Text style={{ marginTop: 10, color: 'red' }}>{this.state.error.toString()}</Text>
          )}
        </View>
      );
    }

    return this.props.children;
  }
}

function Main() {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }
  
  // Both authenticated and unauthenticated states use AppNavigator
  // This ensures everything is inside NavigationContainer
  return <AppNavigator initialRoute={user ? 'Home' : 'Auth'} />;
}

export default function App() {
  const [montserratLoaded] = useMontserrat({
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_700Bold,
  });
  const [libreLoaded] = useLibre({
    LibreBaskerville_400Regular,
    LibreBaskerville_700Bold,
    LibreBaskerville_400Regular_Italic,
  });

  if (!montserratLoaded || !libreLoaded) {
    return null; // or a loading spinner
  }

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <SettingsProvider>
            <SafeAreaProvider>
              <Main />
              <StatusBar style="auto" />
            </SafeAreaProvider>
          </SettingsProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
