import { Pressable, ScrollView, StyleSheet, TextInput } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useClothingRecommend } from '@/hooks/use-clothing-recommend';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useStore } from '@/store/store';

export default function OutfitScreen() {
  const { mutate, data, isPending, error } = useClothingRecommend();

  const activity = useStore((state) => state.activity);
  const setActivity = useStore((state) => state.setActivity);

  const textColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'background');
  const borderColor = useThemeColor({}, 'border');

  const outfit = data?.recommendation;

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={{ flex: 1, padding: 20 }}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <ThemedText type="title" style={styles.title}>
          Outfit
        </ThemedText>

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
            value={activity}
            onChangeText={setActivity}
            placeholder="e.g., going to work, hiking, casual day"
            placeholderTextColor={borderColor}
          />
        </ThemedView>

        <Pressable
          style={({ pressed }) => [
            styles.generateButton,
            pressed && styles.generateButtonPressed,
            isPending && styles.generateButtonDisabled,
          ]}
          onPress={() => mutate()}
          disabled={isPending}
        >
          <ThemedText style={styles.generateButtonText}>
            {isPending ? 'Generating...' : data ? 'Regenerate Outfit' : 'Generate Outfit'}
          </ThemedText>
        </Pressable>

        {error && (
          <ThemedView style={styles.errorContainer}>
            <ThemedText style={styles.errorText}>{error.message}</ThemedText>
          </ThemedView>
        )}

        {outfit && (
          <ThemedView style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Outfit Recommendation
            </ThemedText>

            {/* Overall Description */}
            <ThemedView style={styles.overallDescriptionContainer}>
              <ThemedText style={styles.overallDescriptionText}>
                {outfit.overallDescription}
              </ThemedText>
            </ThemedView>

            {/* Clothing Items */}
            <ThemedView style={styles.itemsContainer}>
              {outfit.items.map((item, index) => (
                <ThemedView key={index} style={styles.itemCard}>
                  <ThemedText type="subtitle" style={styles.itemName}>
                    {item.name}
                  </ThemedText>
                  <ThemedText style={styles.itemDescription}>
                    {item.description}
                  </ThemedText>
                  <ThemedText style={styles.itemBlurb}>
                    {item.blurb}
                  </ThemedText>
                </ThemedView>
              ))}
            </ThemedView>
          </ThemedView>
        )}

        {!isPending && !error && !outfit && (
          <ThemedText style={styles.description}>
            Press the button above to generate an outfit recommendation based on current weather and your preferences.
          </ThemedText>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    marginBottom: 30,
  },
  section: {
    marginBottom: 20,
    width: '100%',
  },
  sectionTitle: {
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  generateButton: {
    backgroundColor: '#0a7ea4',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  generateButtonPressed: {
    opacity: 0.7,
  },
  generateButtonDisabled: {
    opacity: 0.5,
  },
  generateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    padding: 15,
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    borderRadius: 8,
    marginBottom: 20,
  },
  errorText: {
    color: '#ff6b6b',
  },
  overallDescriptionContainer: {
    padding: 15,
    backgroundColor: 'rgba(10, 126, 164, 0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(10, 126, 164, 0.2)',
    marginBottom: 15,
  },
  overallDescriptionText: {
    fontSize: 15,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  itemsContainer: {
    gap: 12,
  },
  itemCard: {
    padding: 15,
    backgroundColor: 'rgba(128, 128, 128, 0.05)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(128, 128, 128, 0.15)',
  },
  itemName: {
    marginBottom: 8,
  },
  itemDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  itemBlurb: {
    fontSize: 13,
    lineHeight: 18,
    opacity: 0.8,
    fontStyle: 'italic',
  },
  description: {
    marginTop: 20,
    opacity: 0.7,
    textAlign: 'center',
  },
});
