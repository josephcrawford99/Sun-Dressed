import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { typography, theme, fonts } from '../styles';

export default function AuthScreen() {
  const handleDevLogin = () => {
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.logoRow}>
        <Text style={typography.logo}>Sun Dressed</Text>
      </View>
      <View style={styles.formContainer}>
        <TextInput 
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#888"
        />
        <TextInput 
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          placeholderTextColor="#888"
        />
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Log In</Text>
        </TouchableOpacity>
        
        {__DEV__ && (
          <TouchableOpacity style={styles.devButton} onPress={handleDevLogin}>
            <Ionicons name="code-slash" size={20} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.devButtonText}>Developer Login</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.white
  },
  logoRow: {
    marginTop: 48,
    marginBottom: 32,
    alignItems: 'flex-start',
    paddingHorizontal: 20
  },
  formContainer: {
    paddingHorizontal: 32,
    flex: 1
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    fontFamily: fonts.secondary,
    marginBottom: 16,
  },
  button: {
    backgroundColor: theme.colors.black,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    height: 48,
  },
  buttonText: {
    ...typography.button,
    color: '#fff',
  },
  devButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    borderWidth: 2,
    borderColor: '#1976D2',
    height: 48,
    flexDirection: 'row',
  },
  devButtonText: {
    ...typography.button,
    color: '#fff',
  },
});