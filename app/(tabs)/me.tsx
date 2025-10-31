import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import RadioGroup, { RadioButtonProps } from 'react-native-radio-buttons-group';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { TempFormat } from '@/services/openweathermap-service';
import { useStore } from '@/store/store';
import { OutfitStyle } from '@/types/outfit';

export default function MeScreen() {
  const style = useStore((state) => state.style);
  const setStyle = useStore((state) => state.setStyle);
  const tempFormat = useStore((state) => state.tempFormat);
  const setTempFormat = useStore((state) => state.setTempFormat);

  const textColor = useThemeColor({}, 'text');

  const styleRadioButtons: RadioButtonProps[] = useMemo(
    () => [
      {
        id: 'masculine',
        label: 'Masculine',
        value: 'masculine',
        color: textColor,
        labelStyle: { color: textColor },
      },
      {
        id: 'feminine',
        label: 'Feminine',
        value: 'feminine',
        color: textColor,
        labelStyle: { color: textColor },
      },
      {
        id: 'neutral',
        label: 'Neutral',
        value: 'neutral',
        color: textColor,
        labelStyle: { color: textColor },
      },
    ],
    [textColor],
  );

  const tempFormatRadioButtons: RadioButtonProps[] = useMemo(
    () => [
      {
        id: 'imperial',
        label: 'Fahrenheit (°F)',
        value: 'imperial',
        color: textColor,
        labelStyle: { color: textColor },
      },
      {
        id: 'metric',
        label: 'Celsius (°C)',
        value: 'metric',
        color: textColor,
        labelStyle: { color: textColor },
      },
    ],
    [textColor],
  );

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Me
      </ThemedText>

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Outfit Style
        </ThemedText>
        <RadioGroup
          radioButtons={styleRadioButtons}
          onPress={(selectedId) => setStyle(selectedId as OutfitStyle)}
          selectedId={style || undefined}
        />
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Temperature Format
        </ThemedText>
        <RadioGroup
          radioButtons={tempFormatRadioButtons}
          onPress={(selectedId) => setTempFormat(selectedId as TempFormat)}
          selectedId={tempFormat || undefined}
        />
      </ThemedView>
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
    width: '100%',
  },
  sectionTitle: {
    marginBottom: 15,
  },
});
