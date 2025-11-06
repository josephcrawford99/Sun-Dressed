import { ScrollView, StyleSheet } from 'react-native';

import { OutfitItemCard } from '@/components/outfit-item-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ThemedButton } from '@/components/ui/button';
import { ThemedCard } from '@/components/ui/card';
import { ThemedTextInput } from '@/components/ui/input';
import { Section } from '@/components/ui/section';
import { useClothingRecommend } from '@/hooks/use-clothing-recommend';
import { useStore } from '@/store/store';

export default function OutfitScreen() {
  const { mutate, data, isPending, error } = useClothingRecommend();

  const activity = useStore((state) => state.activity);
  const setActivity = useStore((state) => state.setActivity);

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

        <Section title="Activity">
          <ThemedTextInput
            value={activity}
            onChangeText={setActivity}
            placeholder="e.g., going to work, hiking, casual day"
          />
        </Section>

        <ThemedButton
          onPress={() => mutate()}
          disabled={isPending}
          style={styles.generateButton}
        >
          {isPending ? 'Generating...' : data ? 'Regenerate Outfit' : 'Generate Outfit'}
        </ThemedButton>

        {error && (
          <ThemedCard variant="error" style={styles.errorContainer}>
            <ThemedText style={styles.errorText}>{error.message}</ThemedText>
          </ThemedCard>
        )}

        {outfit && (
          <Section title="Outfit Recommendation">
            {/* Overall Description */}
            <ThemedCard variant="info" style={styles.overallDescriptionContainer}>
              <ThemedText style={styles.overallDescriptionText}>
                {outfit.overallDescription}
              </ThemedText>
            </ThemedCard>

            {/* Clothing Items */}
            <ThemedView style={styles.itemsContainer}>
              {outfit.items.map((item, index) => (
                <OutfitItemCard
                  key={index}
                  name={item.name}
                  description={item.description}
                  blurb={item.blurb}
                />
              ))}
            </ThemedView>
          </Section>
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
  generateButton: {
    marginBottom: 20,
  },
  errorContainer: {
    marginBottom: 20,
  },
  errorText: {
    color: '#ff6b6b',
  },
  overallDescriptionContainer: {
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
  description: {
    marginTop: 20,
    opacity: 0.7,
    textAlign: 'center',
  },
});
