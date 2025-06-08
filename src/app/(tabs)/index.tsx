import BentoBox from '@components/BentoBox';
import { theme, typography } from '@styles';
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

export default function HomeScreen() {
  const [location, setLocation] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.greetingRow}>
        <View>
          <Text style={typography.label}>greeting,</Text>
          <Text style={styles.name}>Name!</Text>
        </View>
      </View>

      <View style={styles.locationRow}>
        <TextInput
          style={styles.locationInput}
          value={location}
          onChangeText={setLocation}
          placeholder="Enter location"
          placeholderTextColor={theme.colors.gray}
        />
        <TouchableOpacity style={styles.weatherButton}>
          <Text style={styles.weatherButtonText}>--°</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.mainContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <BentoBox />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  greetingRow: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
  },
  name: {
    ...typography.heading,
    fontStyle: 'italic',
    marginTop: -4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  locationInput: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: theme.colors.gray,
    borderRadius: 8,
    paddingHorizontal: 16,
    backgroundColor: theme.colors.white,
    ...typography.body,
  },
  weatherButton: {
    marginLeft: 12,
    backgroundColor: theme.colors.black,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 90,
  },
  weatherButtonText: {
    ...typography.tempButton,
  },
  mainContainer: {
    flex: 1,
    marginHorizontal: 16,
    backgroundColor: theme.colors.white,
    borderRadius: 12,
  },
  scrollContent: {
    padding: 20,
    minHeight: 400,
  },
  contentPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
