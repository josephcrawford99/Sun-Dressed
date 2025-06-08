import ToggleSwitch from '@/components/common/ToggleSwitch';
import { theme, typography } from '@styles';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import RadioGroup from 'react-native-radio-buttons-group';


export default function AccountScreen() {
  const [tempUnit, setTempUnit] = useState<'Celcius' | 'Fahrenheit'>('Fahrenheit');
  const [speedUnit, setSpeedUnit] = useState<'mph' | 'kph'>('mph');
  const [selectedStyleId, setSelectedStyleId] = useState('3');

  const styleRadioButtons = [
    {
      id: '1',
      label: 'Masculine',
      value: 'masculine'
    },
    {
      id: '2', 
      label: 'Feminine',
      value: 'feminine'
    },
    {
      id: '3',
      label: 'Neutral', 
      value: 'neutral'
    }
  ];

  const handleLogout = () => {
    router.replace('/(auth)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Account</Text>

        <View style={styles.formContainer}>
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>name</Text>
            <TextInput
              style={styles.textInput}
              placeholder="name"
              placeholderTextColor={theme.colors.gray}
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>email</Text>
            <TextInput
              style={styles.textInput}
              placeholder="email"
              placeholderTextColor={theme.colors.gray}
            />
          </View>

                    <View style={styles.unitContainer}>
            <ToggleSwitch
              label="Temperature Unit"
              value={tempUnit}
              options={[
                { value: 'Celcius', label: '°C' },
                { value: 'Fahrenheit', label: '°F' }
              ]}
              onValueChange={(value) => setTempUnit(value as 'Celcius' | 'Fahrenheit')}
            />

            <ToggleSwitch
              label="Wind Speed Unit"
              value={speedUnit}
              options={[
                { value: 'kph', label: 'km/h' },
                { value: 'mph', label: 'mph' }
              ]}
              onValueChange={(value) => setSpeedUnit(value as 'mph' | 'kph')}
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>style preference</Text>
            <RadioGroup 
              radioButtons={styleRadioButtons} 
              onPress={setSelectedStyleId}
              selectedId={selectedStyleId}
              layout="row"
            />
          </View>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  title: {
    ...typography.heading,
    marginBottom: 24,
  },
  formContainer: {
    marginBottom: 32,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  fieldLabel: {
    ...typography.label,
    marginBottom: 8,
  },
  textInput: {
    height: 48,
    borderWidth: 1,
    borderColor: theme.colors.gray,
    borderRadius: 8,
    paddingHorizontal: 16,
    backgroundColor: theme.colors.white,
    ...typography.body,
  },
  unitContainer: {
    gap: 16,
    marginBottom: 24,
  },
  logoutButton: {
    backgroundColor: theme.colors.black,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  logoutButtonText: {
    ...typography.button,
    color: theme.colors.white,
  },
});