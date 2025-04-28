import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { useAuth } from '../utils/AuthContext';
import { typography } from '../styles/typography';

const AuthScreen: React.FC = () => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleMockAuth = async (provider: 'apple' | 'google' | 'email') => {
    setLoading(true);
    setTimeout(async () => {
      // Mock user object
      const user = {
        name: name || 'Amanda',
        location: 'New York, NY',
        email: email || 'amanda@example.com',
        provider,
      };
      await login(user);
      setLoading(false);
      Alert.alert('Success', `Signed in as ${user.name}`);
    }, 800);
  };

  const handleSubmit = () => {
    if (mode === 'signup' && !name.trim()) {
      Alert.alert('Missing Info', 'Please enter your name.');
      return;
    }
    if (!email.trim() || !password.trim()) {
      Alert.alert('Missing Info', 'Please enter your email and password.');
      return;
    }
    handleMockAuth('email');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex1}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.logoRow}>
          <Text style={StyleSheet.flatten([typography.logo, styles.logoText])}>Climate Closet</Text>
        </View>
        <View style={styles.formContainer}>
          <TouchableOpacity
            style={[styles.socialButton, { backgroundColor: '#000' }]}
            onPress={() => handleMockAuth('apple')}
            disabled={loading}
          >
            <AntDesign name="apple1" size={20} color="#fff" style={{ marginRight: 8 }} />
            <Text style={StyleSheet.flatten([typography.button, styles.socialButtonText])}>Sign in with Apple</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.socialButton, { backgroundColor: '#fff', borderColor: '#000', borderWidth: 1 }]}
            onPress={() => handleMockAuth('google')}
            disabled={loading}
          >
            <AntDesign name="google" size={20} color="#000" style={{ marginRight: 8 }} />
            <Text style={StyleSheet.flatten([typography.button, { color: '#000' }, styles.socialButtonText])}>Sign in with Google</Text>
          </TouchableOpacity>
          <View style={styles.dividerRow}>
            <View style={styles.divider} />
            <Text style={typography.caption}>or</Text>
            <View style={styles.divider} />
          </View>
          <TextInput
            style={StyleSheet.flatten([typography.body, styles.input])}
            placeholder="Email"
            placeholderTextColor="#757575"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            editable={!loading}
          />
          <TextInput
            style={StyleSheet.flatten([typography.body, styles.input])}
            placeholder="Password"
            placeholderTextColor="#757575"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            editable={!loading}
          />
          {mode === 'signup' && (
            <TextInput
              style={StyleSheet.flatten([typography.body, styles.input])}
              placeholder="First Name"
              placeholderTextColor="#757575"
              value={name}
              onChangeText={setName}
              editable={!loading}
            />
          )}
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={typography.button}>{mode === 'login' ? 'Log In' : 'Sign Up'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setMode(mode === 'login' ? 'signup' : 'login')}
            disabled={loading}
          >
            <Text style={typography.label}>
              {mode === 'login'
                ? "Don't have an account? Sign up"
                : 'Already have an account? Log in'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  flex1: { flex: 1 },
  logoRow: { marginTop: 48, marginBottom: 32, alignItems: 'flex-start', paddingHorizontal: 32 },
  logoText: {},
  formContainer: { paddingHorizontal: 32, flex: 1 },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    height: 48,
    marginBottom: 16,
  },
  socialButtonText: {},
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 16 },
  divider: { flex: 1, height: 1, backgroundColor: '#E5E5E5' },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    height: 44,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  submitButton: {
    backgroundColor: '#000',
    borderRadius: 12,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
});

export default AuthScreen;
