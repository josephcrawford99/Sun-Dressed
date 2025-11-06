import { ScrollView, StyleSheet } from 'react-native';

import { ThemedBackground } from '@/components/themed-background';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ThemedRadioGroup } from '@/components/ui/radio-group';
import { Section } from '@/components/ui/section';
import { Shadows } from '@/constants/theme';
import { TempFormat } from '@/services/openweathermap-service';
import { useStore } from '@/store/store';
import { OutfitStyle } from '@/types/outfit';

export default function SettingsScreen() {
  const style = useStore((state) => state.style);
  const setStyle = useStore((state) => state.setStyle);
  const tempFormat = useStore((state) => state.tempFormat);
  const setTempFormat = useStore((state) => state.setTempFormat);

  const styleOptions = [
    { id: 'masculine', label: 'Masculine', value: 'masculine' },
    { id: 'feminine', label: 'Feminine', value: 'feminine' },
    { id: 'neutral', label: 'Neutral', value: 'neutral' },
  ];

  const tempFormatOptions = [
    { id: 'imperial', label: 'Fahrenheit (°F)', value: 'imperial' },
    { id: 'metric', label: 'Celsius (°C)', value: 'metric' },
  ];

  return (
    <ThemedBackground style={styles.container}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        stickyHeaderIndices={[0]}
      >
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title" style={styles.title}>
            Settings
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.content}>
          <Section title="Outfit Style" style={styles.section}>
            <ThemedRadioGroup
              options={styleOptions}
              onPress={(selectedId) => setStyle(selectedId as OutfitStyle)}
              selectedId={style || undefined}
            />
          </Section>

          <Section title="Temperature Format" style={styles.section}>
            <ThemedRadioGroup
              options={tempFormatOptions}
              onPress={(selectedId) => setTempFormat(selectedId as TempFormat)}
              selectedId={tempFormat || undefined}
            />
          </Section>
        </ThemedView>
      </ScrollView>
    </ThemedBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleContainer: {
    ...Shadows.stickyHeader,
  },
  title: {
    padding: 20,
    paddingVertical: 12,
  },
  content: {
    padding: 20,
    paddingTop: 15,
  },
  section: {
    marginBottom: 30,
  },
});
