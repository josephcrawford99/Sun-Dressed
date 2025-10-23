import { StyleSheet, Pressable, ScrollView } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useClothingRecommend } from '@/hooks/use-clothing-recommend';

export default function OutfitScreen() {
  const { generateOutfit, outfit, prompt, loading, error } = useClothingRecommend();

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Outfit
      </ThemedText>

      <Pressable
        style={({ pressed }) => [
          styles.generateButton,
          pressed && styles.generateButtonPressed,
          loading && styles.generateButtonDisabled,
        ]}
        onPress={generateOutfit}
        disabled={loading}
      >
        <ThemedText style={styles.generateButtonText}>
          {loading ? 'Generating...' : 'Generate Outfit'}
        </ThemedText>
      </Pressable>

      {error && (
        <ThemedView style={styles.errorContainer}>
          <ThemedText style={styles.errorText}>{error}</ThemedText>
        </ThemedView>
      )}

      {prompt && (
        <ScrollView style={styles.scrollView}>
          <ThemedView style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Prompt Sent to API:
            </ThemedText>
            <ThemedView style={styles.promptContainer}>
              <ThemedText style={styles.promptText}>{prompt}</ThemedText>
            </ThemedView>
          </ThemedView>

          {outfit && (
            <ThemedView style={styles.section}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                Outfit Recommendation:
              </ThemedText>
              <ThemedView style={styles.outfitContainer}>
                <ThemedText style={styles.outfitText}>{outfit}</ThemedText>
              </ThemedView>
            </ThemedView>
          )}
        </ScrollView>
      )}

      {!loading && !error && !outfit && !prompt && (
        <ThemedText style={styles.description}>
          Press the button above to generate an outfit recommendation based on current weather and your preferences.
        </ThemedText>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    marginBottom: 20,
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
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    marginBottom: 10,
  },
  promptContainer: {
    padding: 15,
    backgroundColor: 'rgba(128, 128, 128, 0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(128, 128, 128, 0.2)',
  },
  promptText: {
    fontSize: 13,
    lineHeight: 20,
    opacity: 0.8,
  },
  outfitContainer: {
    padding: 15,
    backgroundColor: 'rgba(10, 126, 164, 0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(10, 126, 164, 0.2)',
  },
  outfitText: {
    fontSize: 15,
    lineHeight: 22,
  },
  description: {
    marginTop: 20,
    opacity: 0.7,
    textAlign: 'center',
  },
});
