import ToggleSwitch from '@/components/common/ToggleSwitch';
import { Button } from '@/components/ui/Button';
import { TextInput } from '@/components/ui/TextInput';
import { theme, typography } from '@styles';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import RadioGroup from 'react-native-radio-buttons-group';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


export default function AccountScreen() {
  const insets = useSafeAreaInsets();
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
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: Platform.OS === 'ios' ? insets.top : 20 }]}>
        <Text style={styles.title}>Account</Text>
      </View>
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formContainer}>
          <TextInput
            label="Name"
            placeholder="Enter your name"
            size="medium"
          />

          <TextInput
            label="Email"
            placeholder="Enter your email"
            size="medium"
          />

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

          <ToggleSwitch
            label="Style Preference"
            value={styleRadioButtons.find(button => button.id === selectedStyleId)?.value || 'neutral'}
            options={[
              { value: 'masculine', label: 'Masculine' },
              { value: 'feminine', label: 'Feminine' },
              { value: 'neutral', label: 'Neutral' }
            ]}
            onValueChange={(value) => {
              const selectedButton = styleRadioButtons.find(button => button.value === value);
              if (selectedButton) {
                setSelectedStyleId(selectedButton.id);
              }
            }}
          />
        </View>

        <Button
          title="Log Out"
          onPress={handleLogout}
          variant="danger"
          size="medium"
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
});