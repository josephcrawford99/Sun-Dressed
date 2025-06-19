import ToggleSwitch from '@/components/common/ToggleSwitch';
import { Button } from '@/components/ui/Button';
import { TextInput } from '@/components/ui/TextInput';
import { useSettings } from '@/contexts/SettingsContext';
import { theme, typography } from '@styles';
import React, { useState, useEffect } from 'react';
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Alert
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCurrentUser, useSignOutMutation, useUpdateProfileMutation, useUpdatePasswordMutation } from '@/hooks/queries/useAuthQuery';


export default function AccountScreen() {
  const insets = useSafeAreaInsets();
  const { settings, updateSetting } = useSettings();
  const currentUser = useCurrentUser();
  const signOutMutation = useSignOutMutation();
  const updateProfileMutation = useUpdateProfileMutation();
  const updatePasswordMutation = useUpdatePasswordMutation();
  
  const [name, setName] = useState(currentUser?.user_metadata?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [isUpdatingSetting, setIsUpdatingSetting] = useState(false);
  
  // Password change state
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Update local state when user data changes
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.user_metadata?.name || '');
      setEmail(currentUser.email || '');
    }
  }, [currentUser]);

  const handleNameChange = async (value: string) => {
    setName(value);
    try {
      await updateProfileMutation.mutateAsync({ name: value });
    } catch (error: any) {
      Alert.alert('Error', 'Failed to update name');
      // Revert local state on error
      setName(currentUser?.user_metadata?.name || '');
    }
  };

  const handleEmailChange = async (value: string) => {
    setEmail(value);
    try {
      await updateProfileMutation.mutateAsync({ email: value });
      Alert.alert('Success', 'Email updated successfully. Please check your email to confirm the change.');
    } catch (error: any) {
      Alert.alert('Error', 'Failed to update email');
      // Revert local state on error
      setEmail(currentUser?.email || '');
    }
  };

  const handleSettingChange = async (key: string, value: any) => {
    setIsUpdatingSetting(true);
    try {
      await updateSetting(key, value);
    } catch {
      // Failed to update setting
    } finally {
      setIsUpdatingSetting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOutMutation.mutateAsync();
      // AuthGuard will handle redirecting to auth screen
    } catch (error: any) {
      Alert.alert('Error', 'Failed to sign out');
    }
  };

  const validatePasswordChange = () => {
    if (!currentPassword.trim()) {
      Alert.alert('Validation Error', 'Please enter your current password');
      return false;
    }
    
    if (!newPassword.trim()) {
      Alert.alert('Validation Error', 'Please enter a new password');
      return false;
    }
    
    if (newPassword.length < 8) {
      Alert.alert('Validation Error', 'New password must be at least 8 characters long');
      return false;
    }
    
    if (newPassword !== confirmPassword) {
      Alert.alert('Validation Error', 'New password and confirmation do not match');
      return false;
    }
    
    if (currentPassword === newPassword) {
      Alert.alert('Validation Error', 'New password must be different from current password');
      return false;
    }
    
    return true;
  };

  const handlePasswordChange = async () => {
    if (!validatePasswordChange()) {
      return;
    }

    try {
      await updatePasswordMutation.mutateAsync(newPassword);
      Alert.alert('Success', 'Password updated successfully');
      
      // Reset form and hide section
      setShowPasswordSection(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update password');
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: Platform.OS === 'ios' ? insets.top : 20 }]}>
        <Text style={styles.title}>Account</Text>
      </View>
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <TextInput
              label="Name"
              placeholder="Enter your name"
              size="medium"
              value={name}
              onChangeText={handleNameChange}
            />
            {updateProfileMutation.isPending && (
              <ActivityIndicator 
                size="small" 
                color={theme.colors.black} 
                style={styles.inputLoadingSpinner} 
              />
            )}
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              label="Email"
              placeholder="Enter your email"
              size="medium"
              value={email}
              onChangeText={handleEmailChange}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {updateProfileMutation.isPending && (
              <ActivityIndicator 
                size="small" 
                color={theme.colors.black} 
                style={styles.inputLoadingSpinner} 
              />
            )}
          </View>

          {/* Password Change Section */}
          <View style={styles.passwordContainer}>
            <Text style={styles.sectionLabel}>Password</Text>
            {!showPasswordSection ? (
              <Button
                title="Change Password"
                onPress={() => setShowPasswordSection(true)}
                variant="secondary"
                size="medium"
              />
            ) : (
              <View style={styles.passwordFieldsContainer}>
                <View style={styles.inputContainer}>
                  <TextInput
                    label="Current Password"
                    placeholder="Enter current password"
                    size="medium"
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                    secureTextEntry
                    autoCapitalize="none"
                    autoComplete="current-password"
                    textContentType="password"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <TextInput
                    label="New Password"
                    placeholder="Enter new password"
                    size="medium"
                    value={newPassword}
                    onChangeText={setNewPassword}
                    secureTextEntry
                    autoCapitalize="none"
                    autoComplete="new-password"
                    textContentType="newPassword"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <TextInput
                    label="Confirm New Password"
                    placeholder="Confirm new password"
                    size="medium"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                    autoCapitalize="none"
                    autoComplete="new-password"
                    textContentType="newPassword"
                  />
                </View>

                <View style={styles.passwordButtonContainer}>
                  <Button
                    title="Cancel"
                    onPress={() => {
                      setShowPasswordSection(false);
                      setCurrentPassword('');
                      setNewPassword('');
                      setConfirmPassword('');
                    }}
                    variant="secondary"
                    size="medium"
                  />
                  <Button
                    title={updatePasswordMutation.isPending ? "Updating..." : "Update Password"}
                    onPress={handlePasswordChange}
                    variant="primary"
                    size="medium"
                    disabled={updatePasswordMutation.isPending}
                  />
                </View>
              </View>
            )}
          </View>

          <View style={styles.unitContainer}>
            <ToggleSwitch
              label="Temperature Unit"
              value={settings.temperatureUnit}
              options={[
                { value: 'Celsius', label: '°C' },
                { value: 'Fahrenheit', label: '°F' }
              ]}
              onValueChange={(value) => handleSettingChange('temperatureUnit', value as 'Celsius' | 'Fahrenheit')}
            />

            <ToggleSwitch
              label="Wind Speed Unit"
              value={settings.speedUnit}
              options={[
                { value: 'kph', label: 'km/h' },
                { value: 'mph', label: 'mph' }
              ]}
              onValueChange={(value) => handleSettingChange('speedUnit', value as 'mph' | 'kph')}
            />
          </View>

          <ToggleSwitch
            label="Style Preference"
            value={settings.stylePreference}
            options={[
              { value: 'masculine', label: 'Masculine' },
              { value: 'feminine', label: 'Feminine' },
              { value: 'neutral', label: 'Neutral' }
            ]}
            onValueChange={(value) => handleSettingChange('stylePreference', value as 'masculine' | 'feminine' | 'neutral')}
          />

          {isUpdatingSetting && (
            <View style={styles.globalLoadingContainer}>
              <ActivityIndicator 
                size="small" 
                color={theme.colors.black} 
              />
              <Text style={styles.loadingText}>Updating setting...</Text>
            </View>
          )}
        </View>

        <Button
          title={signOutMutation.isPending ? "Signing out..." : "Log Out"}
          onPress={handleLogout}
          variant="danger"
          size="medium"
          disabled={signOutMutation.isPending}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.lightGray,
    backgroundColor: theme.colors.white,
  },
  title: {
    ...typography.heading,
    color: theme.colors.black,
  },
  scrollContent: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
  formContainer: {
    marginBottom: theme.spacing.xl,
  },
  fieldContainer: {
    marginBottom: theme.spacing.md,
  },
  fieldLabel: {
    ...typography.label,
    marginBottom: theme.spacing.sm,
  },
  unitContainer: {
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  inputContainer: {
    position: 'relative',
    marginBottom: theme.spacing.md,
  },
  inputLoadingSpinner: {
    position: 'absolute',
    right: theme.spacing.sm,
    top: '50%',
    transform: [{ translateY: -10 }],
  },
  globalLoadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  loadingText: {
    ...typography.body,
    color: theme.colors.gray,
    fontSize: theme.fontSize.sm,
  },
  passwordContainer: {
    marginBottom: theme.spacing.lg,
    borderRadius: theme.borderRadius.medium,
    backgroundColor: theme.colors.lightGray,
    padding: theme.spacing.md,
  },
  sectionLabel: {
    ...typography.label,
    marginBottom: theme.spacing.sm,
  },
  passwordFieldsContainer: {
    gap: theme.spacing.sm,
  },
  passwordButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.sm,
  },
});