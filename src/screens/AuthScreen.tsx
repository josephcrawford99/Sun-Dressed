import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { useAuth } from '../utils/AuthContext';
import { typography } from '../styles/typography';
import InputField from '../components/InputField';
import Button from '../components/Button';
import Divider from '../components/Divider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DevClearDataHeader from '../components/DevClearDataHeader';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

const AuthScreen: React.FC = () => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const { login, signup, isLoading, error } = useAuth();
  const [localError, setLocalError] = useState<string | null>(null);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  // Check for dev auto-login flag
  useEffect(() => {
    const checkDevLogin = async () => {
      try {
        const devAutoLogin = await AsyncStorage.getItem('@dev_auto_login');
        if (devAutoLogin === 'true') {
          // Clear the flag immediately
          await AsyncStorage.removeItem('@dev_auto_login');

          // Set the email and password for dev login
          setEmail('josephcrawford99@gmail.com');
          setPassword('asdfgh');

          // Wait a moment for the UI to update, then trigger login
          setTimeout(() => {
            login('josephcrawford99@gmail.com', 'asdfgh');
          }, 500);
        }
      } catch (error) {
        console.error('Error checking dev login flag:', error);
      }
    };

    checkDevLogin();
  }, [login]);

  const handleMockAuth = async (provider: 'apple' | 'google') => {
    Alert.alert('Success', 'Signed in as Amanda (mock)');
  };

  const handleSubmit = async () => {
    setLocalError(null);
    if (mode === 'signup' && !name.trim()) {
      setLocalError('Please enter your name.');
      return;
    }
    if (!email.trim() || !password.trim()) {
      setLocalError('Please enter your email and password.');
      return;
    }
    if (mode === 'signup') {
      await signup(email.trim(), password, name.trim());
    } else {
      await login(email.trim(), password);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <DevClearDataHeader isAuthScreen={true} />
      <KeyboardAvoidingView
        style={styles.flex1}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.logoRow}>
          <Text style={typography.logo}>Sun Dresser</Text>
        </View>
        <View style={styles.formContainer}>
          <Button onPress={() => handleMockAuth('apple')} disabled={isLoading} style={styles.socialButton}>
            <AntDesign name="apple1" size={20} color="#fff" style={{ marginRight: 8 }} />
            <Text style={[typography.button, { color: '#fff' }]}>Sign in with Apple</Text>
          </Button>
          <Button onPress={() => handleMockAuth('google')} disabled={isLoading} style={[styles.socialButton, styles.socialButtonGoogle]}>
            <AntDesign name="google" size={20} color="#000" style={{ marginRight: 8 }} />
            <Text style={[typography.button, { color: '#000' }]}>Sign in with Google</Text>
          </Button>
          <Divider text="or" />
          <InputField
            placeholder="Email"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            editable={!isLoading}
            error={mode === 'signup' && localError === 'Please enter your email and password.' ? localError : undefined}
          />
          <InputField
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            editable={!isLoading}
            onFocus={() => setPasswordFocused(true)}
            onBlur={() => setPasswordFocused(false)}
            error={mode === 'signup' && passwordFocused && password.length > 0 && password.length < 6 ? 'Password must be at least 6 characters' : undefined}
          />
          {mode === 'signup' && (
            <InputField
              placeholder="First Name"
              value={name}
              onChangeText={setName}
              editable={!isLoading}
              error={mode === 'signup' && localError === 'Please enter your name.' ? localError : undefined}
            />
          )}
          {(localError || error) && (
            <Text style={styles.errorText}>{localError || error}</Text>
          )}
          <Button onPress={handleSubmit} disabled={isLoading}>
            {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={[typography.button, { color: '#fff' }]}>{mode === 'login' ? 'Log In' : 'Sign Up'}</Text>}
          </Button>
          <Button
            onPress={() => {
              setMode(mode === 'login' ? 'signup' : 'login');
              setLocalError(null);
            }}
            disabled={isLoading}
            style={styles.switchButton}
          >
            <Text style={typography.label}>
              {mode === 'login'
                ? "Don't have an account? Sign up"
                : 'Already have an account? Log in'}
            </Text>
          </Button>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  flex1: { flex: 1 },
  logoRow: { marginTop: 48, marginBottom: 32, alignItems: 'flex-start', paddingHorizontal: 32 },
  formContainer: { paddingHorizontal: 32, flex: 1 },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    height: 48,
    marginBottom: 16,
  },
  socialButtonGoogle: {
    backgroundColor: '#fff',
    borderColor: '#000',
    borderWidth: 1,
  },
  errorText: {
    color: '#b94a48',
    fontSize: 14,
    marginBottom: 8,
    textAlign: 'center',
  },
  switchButton: {
    backgroundColor: 'transparent',
    elevation: 0,
    marginTop: 0,
    marginBottom: 0,
  },
});

export default AuthScreen;
