import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { typography, fonts } from '../styles/typography';
import { theme } from '../styles/theme';

// Simple Button component since we don't have one in the current implementation
interface ButtonProps {
  onPress: () => void;
  children: React.ReactNode;
  style?: any;
  disabled?: boolean;
  testID?: string;
}

const Button: React.FC<ButtonProps> = ({ onPress, children, style, disabled = false, testID }) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.button, style, disabled && styles.buttonDisabled]}
    disabled={disabled}
    testID={testID}
  >
    {children}
  </TouchableOpacity>
);

// Simple Divider component
interface DividerProps {
  text: string;
}

const Divider: React.FC<DividerProps> = ({ text }) => (
  <View style={styles.dividerContainer}>
    <View style={styles.dividerLine} />
    <Text style={styles.dividerText}>{text}</Text>
    <View style={styles.dividerLine} />
  </View>
);

// Simple InputField component
interface InputFieldProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  editable?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  error?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  autoCapitalize = "sentences",
  keyboardType = "default",
  editable = true,
  onFocus,
  onBlur,
  error
}) => (
  <View style={styles.inputContainer}>
    <TextInput
      style={[styles.input, error ? styles.inputError : undefined]}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      autoCapitalize={autoCapitalize}
      keyboardType={keyboardType}
      editable={editable}
      onFocus={onFocus}
      onBlur={onBlur}
      placeholderTextColor="#888"
    />
    {error && <Text style={styles.errorText}>{error}</Text>}
  </View>
);

const AuthScreen: React.FC = () => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const isLoading = false;
  const login = (email: string, password: string) => console.log(`Would normally login with ${email}`);
  const [localError, setLocalError] = useState<string | null>(null);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const handleSocialAuth = (provider: 'apple' | 'google') => {
    // Just show that this would normally authenticate with a social provider
    console.log(`Would normally authenticate with ${provider}`);
  };

  const handleTestLogin = () => {
    if (login) {
      login("test@example.com", "password");
      console.log('Would navigate to main app');
    }
  };

  const handleSubmit = () => {
    setLocalError(null);
    if (mode === 'signup' && !name.trim()) {
      setLocalError('Please enter your name.');
      return;
    }
    if (!email.trim() || !password.trim()) {
      setLocalError('Please enter your email and password.');
      return;
    }

    // Just show that this would normally authenticate
    console.log(`Would normally ${mode} with email: ${email} and password: [hidden]`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex1}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.logoRow}>
          <Text style={typography.logo}>Sun Dressed</Text>
        </View>
        <View style={styles.formContainer}>
          <Button
            onPress={() => handleSocialAuth('apple')}
            disabled={isLoading}
            style={styles.socialButton}
          >
            <Ionicons name="logo-apple" size={20} color="#fff" style={{ marginRight: 8 }} />
            <Text style={[typography.button, { color: '#fff' }]}>Sign in with Apple</Text>
          </Button>
          <Button
            onPress={() => handleSocialAuth('google')}
            disabled={isLoading}
            style={[styles.socialButton, styles.socialButtonGoogle]}
          >
            <Ionicons name="logo-google" size={20} color="#000" style={{ marginRight: 8 }} />
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
          {localError && (
            <Text style={styles.errorText}>{localError}</Text>
          )}
          <Button onPress={handleSubmit} disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={[typography.button, { color: '#fff' }]}>
                {mode === 'login' ? 'Log In' : 'Sign Up'}
              </Text>
            )}
          </Button>
          <Button
            onPress={() => {
              setMode(mode === 'login' ? 'signup' : 'login');
              setLocalError(null);
            }}
            style={styles.switchButton}
          >
            <Text style={typography.label}>
              {mode === 'login'
                ? "Don't have an account? Sign up"
                : 'Already have an account? Log in'}
            </Text>
          </Button>

          {/* Test Login Button */}
          <View style={styles.testLoginContainer}>
            <Text style={styles.testLoginLabel}>For Development Only:</Text>
            <Button
              onPress={handleTestLogin}
              style={styles.testLoginButton}
              testID="test-login-button"
            >
              <Text style={[typography.button, { color: '#fff' }]}>
                Test Login (Skip Auth)
              </Text>
            </Button>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.white
  },
  flex1: {
    flex: 1
  },
  logoRow: {
    marginTop: 48,
    marginBottom: 32,
    alignItems: 'flex-start',
    paddingHorizontal: 32
  },
  formContainer: {
    paddingHorizontal: 32,
    flex: 1
  },
  button: {
    backgroundColor: theme.colors.black,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    flexDirection: 'row',
    height: 48,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    height: 48,
    marginBottom: 16,
  },
  socialButtonGoogle: {
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.black,
    borderWidth: 1,
  },
  switchButton: {
    backgroundColor: 'transparent',
    elevation: 0,
    marginTop: 0,
    marginBottom: 0,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  dividerText: {
    ...typography.label,
    paddingHorizontal: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    fontFamily: fonts.secondary,
  },
  inputError: {
    borderColor: '#b94a48',
  },
  errorText: {
    color: '#b94a48',
    fontSize: 14,
    marginTop: 4,
    marginBottom: 8,
  },
  testLoginContainer: {
    marginTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 16,
  },
  testLoginLabel: {
    ...typography.label,
    textAlign: 'center',
    marginBottom: 8,
  },
  testLoginButton: {
    backgroundColor: '#ffee8c', // Yellow accent color
  },
});

export default AuthScreen;
