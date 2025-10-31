import { StyleSheet } from 'react-native';
import { useMemo } from 'react';
import RadioGroup, { RadioButtonProps } from 'react-native-radio-buttons-group';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useStore, type OutfitStyle } from '@/store/store';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function MeScreen() {
  const style = useStore((state) => state.style);
  const setStyle = useStore((state) => state.setStyle);

  const textColor = useThemeColor({}, 'text');

  const radioButtons: RadioButtonProps[] = useMemo(
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
          radioButtons={radioButtons}
          onPress={(selectedId) => setStyle(selectedId as OutfitStyle)}
          selectedId={style || undefined}
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
