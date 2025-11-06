import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Section } from '@/components/ui/section';
import { ThemedRadioGroup } from '@/components/ui/radio-group';
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
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Settings
      </ThemedText>

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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    marginBottom: 30,
  },
  section: {
    marginBottom: 30,
  },
});
