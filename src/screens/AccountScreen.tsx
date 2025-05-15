import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { typography, fonts } from '../styles/typography';
import { theme } from '../styles/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TAB_BAR_CONTENT_HEIGHT } from '../components/NavBar';

// Style preference type
type StylePreference = 'masculine' | 'feminine' | 'neutral';

const AccountScreen: React.FC = () => {
  // Replace context usage with mock data
  // const { user, logout, updateUserName } = useAuth();
  const user = { name: 'User Name', email: 'user@example.com' };
  const updateUserName = (name: string) => console.log('Would update name to:', name);
  const logout = () => console.log('Would logout user');

  // Mock settings data
  // const { temperatureUnit, windSpeedUnit, toggleTemperatureUnit, toggleWindSpeedUnit } = useSettings();
  const [temperatureUnit, setTemperatureUnit] = useState<'C' | 'F'>('C');
  const [windSpeedUnit, setWindSpeedUnit] = useState<'ms' | 'mph'>('ms');
  const toggleTemperatureUnit = () => setTemperatureUnit(prev => prev === 'C' ? 'F' : 'C');
  const toggleWindSpeedUnit = () => setWindSpeedUnit(prev => prev === 'ms' ? 'mph' : 'ms');

  // Remove navigation context
  // const { navigateTo } = useNavigation();

  // Local states
  const [stylePreference, setStylePreference] = useState<StylePreference>('neutral');
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(user?.name || '');
  const [updateError, setUpdateError] = useState<string | null>(null);

  // Handle safe area insets for bottom padding (for NavBar)
  const insets = useSafeAreaInsets();
  const navBarTotalHeight = TAB_BAR_CONTENT_HEIGHT + insets.bottom;

  // Function to show sign out confirmation
  const handleSignOutPress = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: () => {
            // First log out the user
            logout();
            // Then navigate to the auth screen - removed
            // navigateTo('auth');
            console.log('Would navigate to auth screen');
          }
        }
      ]
    );
  };

  // Function to handle name save
  const handleNameSave = async () => {
    try {
      setUpdateError(null);
      await updateUserName(nameInput);
      setIsEditingName(false);
    } catch (error) {
      setUpdateError('Failed to update name. Please try again.');
    }
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.container,
          { paddingBottom: navBarTotalHeight + theme.spacing.xl }
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.screenTitle}>Account</Text>

        <View style={styles.settingsContainer}>
          {/* Name Field */}
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>NAME</Text>
            <View style={styles.inputContainer}>
              {isEditingName ? (
                <View style={styles.editNameContainer}>
                  <TextInput
                    value={nameInput}
                    onChangeText={setNameInput}
                    style={[typography.body, styles.nameInput]}
                    autoFocus
                  />
                  <TouchableOpacity onPress={handleNameSave} style={styles.saveButton}>
                    <Text style={[typography.button, { color: theme.colors.black }]}>Save</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.settingButton}
                  onPress={() => setIsEditingName(true)}
                >
                  <Text style={typography.body}>{user?.name || 'User'}</Text>
                  <Ionicons name="pencil-outline" size={16} color={theme.colors.gray} />
                </TouchableOpacity>
              )}
            </View>
            {updateError && (
              <Text style={styles.errorText}>{updateError}</Text>
            )}
          </View>

          {/* Email Field (Read-only) */}
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>EMAIL</Text>
            <View style={styles.settingButton}>
              <Text style={typography.body}>{user?.email || 'user@example.com'}</Text>
            </View>
          </View>

          {/* Temperature Unit Toggle */}
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>TEMPERATURE UNIT</Text>
            <TouchableOpacity
              style={styles.settingButton}
              onPress={toggleTemperatureUnit}
            >
              <Text style={typography.body}>{temperatureUnit === 'C' ? 'Celsius' : 'Fahrenheit'}</Text>
              <Ionicons name="thermometer-outline" size={16} color={theme.colors.gray} />
            </TouchableOpacity>
          </View>

          {/* Wind Speed Unit Toggle */}
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>WIND SPEED UNIT</Text>
            <TouchableOpacity
              style={styles.settingButton}
              onPress={toggleWindSpeedUnit}
            >
              <Text style={typography.body}>{windSpeedUnit === 'ms' ? 'Meters/Second' : 'Miles/Hour'}</Text>
              <Ionicons name="speedometer-outline" size={16} color={theme.colors.gray} />
            </TouchableOpacity>
          </View>

          {/* Style Preference */}
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>STYLE PREFERENCE</Text>
            <View style={styles.radioGroup}>
              <TouchableOpacity
                style={[
                  styles.styleOption,
                  stylePreference === 'masculine' ? styles.styleOptionActive : {}
                ]}
                onPress={() => setStylePreference('masculine')}
              >
                <Text style={[
                  styles.styleOptionText,
                  stylePreference === 'masculine' ? styles.styleOptionTextActive : {}
                ]}>Masculine</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.styleOption,
                  stylePreference === 'feminine' ? styles.styleOptionActive : {}
                ]}
                onPress={() => setStylePreference('feminine')}
              >
                <Text style={[
                  styles.styleOptionText,
                  stylePreference === 'feminine' ? styles.styleOptionTextActive : {}
                ]}>Feminine</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.styleOption,
                  stylePreference === 'neutral' ? styles.styleOptionActive : {}
                ]}
                onPress={() => setStylePreference('neutral')}
              >
                <Text style={[
                  styles.styleOptionText,
                  stylePreference === 'neutral' ? styles.styleOptionTextActive : {}
                ]}>Neutral</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Sign Out Button */}
        <TouchableOpacity
          style={styles.signOutButton}
          onPress={handleSignOutPress}
          accessibilityLabel="Sign out"
          accessibilityHint="Signs you out of the application"
        >
          <Text style={styles.signOutButtonText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  scrollView: {
    flex: 1,
  },
  container: {
    padding: 32,
    backgroundColor: theme.colors.white,
  },
  screenTitle: {
    ...typography.heading,
    marginBottom: 32,
  },
  settingsContainer: {
    gap: 24,
  },
  settingRow: {
    gap: 8,
  },
  settingLabel: {
    ...typography.label,
    textTransform: 'uppercase',
  },
  inputContainer: {
    width: '100%',
  },
  settingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.gray,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 36,
  },
  editNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.gray,
    borderWidth: 1,
    borderRadius: 12,
    paddingLeft: 12,
    height: 36,
  },
  nameInput: {
    flex: 1,
    padding: 0,
  },
  saveButton: {
    paddingHorizontal: 12,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderLeftWidth: 1,
    borderLeftColor: theme.colors.gray,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 4,
  },
  radioGroup: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 12,
  },
  styleOption: {
    borderWidth: 1,
    borderColor: theme.colors.gray,
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  styleOptionActive: {
    backgroundColor: theme.colors.black,
    borderColor: theme.colors.black,
  },
  styleOptionText: {
    ...typography.body,
    fontSize: 14,
  },
  styleOptionTextActive: {
    color: theme.colors.white,
  },
  signOutButton: {
    backgroundColor: theme.colors.black,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 40,
  },
  signOutButtonText: {
    ...typography.button,
    color: theme.colors.white,
  },
});

export default AccountScreen;
