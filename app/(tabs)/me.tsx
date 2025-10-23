import { StyleSheet, TextInput, Pressable } from 'react-native';
import { useMemo, useState } from 'react';
import RadioGroup, { RadioButtonProps } from 'react-native-radio-buttons-group';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useStore, type OutfitStyle } from '@/store/store';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function MeScreen() {
  const style = useStore((state) => state.style);
  const activity = useStore((state) => state.activity);
  const setStyle = useStore((state) => state.setStyle);
  const setActivity = useStore((state) => state.setActivity);

  const [localActivity, setLocalActivity] = useState(activity);

  const textColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'background');
  const borderColor = useThemeColor({ light: '#ccc', dark: '#444' }, 'border');

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

  const handleSave = () => {
    setActivity(localActivity);
  };

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

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Activity
        </ThemedText>
        <TextInput
          style={[
            styles.input,
            {
              color: textColor,
              backgroundColor: backgroundColor,
              borderColor: borderColor,
            },
          ]}
          value={localActivity}
          onChangeText={setLocalActivity}
          placeholder="e.g., going to work, hiking, casual day"
          placeholderTextColor={borderColor}
        />
      </ThemedView>

      <Pressable
        style={({ pressed }) => [
          styles.saveButton,
          pressed && styles.saveButtonPressed,
        ]}
        onPress={handleSave}
      >
        <ThemedText style={styles.saveButtonText}>Save Preferences</ThemedText>
      </Pressable>
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
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#0a7ea4',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonPressed: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
