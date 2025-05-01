import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity } from 'react-native';
import { useAuth } from '../utils/AuthContext';
import { useSettings } from '../utils/SettingsContext';
import Button from '../components/Button';
import { typography } from '../styles/typography';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import TabBar from '../components/TabBar';
import { Ionicons } from '@expo/vector-icons';

const AccountScreen: React.FC = () => {
  const { user, logout, isLoading, updateUserName } = useAuth();
  const { temperatureUnit, windSpeedUnit, toggleTemperatureUnit, toggleWindSpeedUnit } = useSettings();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(user?.name || '');
  const [updateError, setUpdateError] = useState<string | null>(null);

  const handleLogout = async () => {
    await logout();
    navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
  };

  const handleNameSave = async () => {
    try {
      setUpdateError(null);
      await updateUserName(nameInput);
      setIsEditingName(false);
    } catch (error) {
      setUpdateError('Failed to update name. Please try again.');
    }
  };

  // Update nameInput when user name changes
  useEffect(() => {
    if (user?.name) {
      setNameInput(user.name);
    }
  }, [user?.name]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.mainContent}>
        <Text style={typography.heading}>Account</Text>
        <View style={styles.settingsContainer}>
          {/* Name Field */}
          <View style={styles.settingRow}>
            <Text style={typography.label}>NAME</Text>
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
                    <Text style={[typography.button, { color: '#000' }]}>Save</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.settingButton}
                  onPress={() => setIsEditingName(true)}
                >
                  <Text style={typography.body}>{user?.name}</Text>
                  <Ionicons name="pencil-outline" size={16} color="#757575" />
                </TouchableOpacity>
              )}
            </View>
            {updateError && (
              <Text style={styles.errorText}>{updateError}</Text>
            )}
          </View>

          {/* Temperature Unit Toggle */}
          <View style={styles.settingRow}>
            <Text style={typography.label}>TEMPERATURE UNIT</Text>
            <TouchableOpacity
              style={styles.settingButton}
              onPress={toggleTemperatureUnit}
            >
              <Text style={typography.body}>{temperatureUnit === 'C' ? 'Celsius' : 'Fahrenheit'}</Text>
              <Ionicons name="thermometer-outline" size={16} color="#757575" />
            </TouchableOpacity>
          </View>

          {/* Wind Speed Unit Toggle */}
          <View style={styles.settingRow}>
            <Text style={typography.label}>WIND SPEED UNIT</Text>
            <TouchableOpacity
              style={styles.settingButton}
              onPress={toggleWindSpeedUnit}
            >
              <Text style={typography.body}>{windSpeedUnit === 'ms' ? 'Meters/Second' : 'Miles/Hour'}</Text>
              <Ionicons name="speedometer-outline" size={16} color="#757575" />
            </TouchableOpacity>
          </View>

          {/* Email Field (Read-only) */}
          <View style={styles.settingRow}>
            <Text style={typography.label}>EMAIL</Text>
            <View style={styles.settingButton}>
              <Text style={typography.body}>{user?.email}</Text>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.bottomSection}>
        <Button
          onPress={handleLogout}
          disabled={isLoading}
          style={styles.logoutButton}
        >
          <Text style={[typography.button, { color: '#fff' }]}>Log Out</Text>
        </Button>
      </View>
      <TabBar activeTab="account" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff'
  },
  mainContent: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 32,
    paddingBottom: 0,
  },
  settingsContainer: {
    marginTop: 32,
    gap: 24,
  },
  settingRow: {
    gap: 8,
  },
  inputContainer: {
    width: '100%',
  },
  settingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderColor: '#757575',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 36,
  },
  editNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderColor: '#757575',
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
    borderLeftColor: '#757575',
  },
  bottomSection: {
    paddingHorizontal: 32,
    paddingBottom: 16,
  },
  logoutButton: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    height: 48,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 4,
  }
});

export default AccountScreen;
