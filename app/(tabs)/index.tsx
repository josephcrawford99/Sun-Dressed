import { ActivityIndicator, ScrollView, StyleSheet } from 'react-native';

import { OutfitItemCard } from '@/components/outfit-item-card';
import { ThemedBackground } from '@/components/themed-background';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ThemedButton } from '@/components/ui/button';
import { ThemedCard } from '@/components/ui/card';
import { ThemedTextInput } from '@/components/ui/input';
import { Section } from '@/components/ui/section';
import { Shadows } from '@/constants/theme';
import { useClothingRecommend } from '@/hooks/use-clothing-recommend';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useStore } from '@/store/store';

export default function OutfitScreen() {
  const { mutate, data, isPending, error } = useClothingRecommend();

  const activity = useStore((state) => state.activity);
  const setActivity = useStore((state) => state.setActivity);

  const tintColor = useThemeColor({}, 'tint');

  const outfit = data?.recommendation;

  return (
    <ThemedBackground style={styles.container}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        stickyHeaderIndices={[0]}
        keyboardShouldPersistTaps="handled"
      >
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title" style={styles.title}>
            Outfit
          </ThemedText>
        </ThemedView>
        <ThemedView style={styles.content}>
          <ThemedView>
            <Section title="Activity">
              <ThemedTextInput
                value={activity}
                onChangeText={setActivity}
                placeholder="e.g., going to work, hiking, casual day"
              />
            </Section>

            {error && (
              <ThemedCard variant="error" style={styles.errorContainer}>
                <ThemedText style={styles.errorText}>{error.message}</ThemedText>
              </ThemedCard>
            )}

            {outfit && (
              <>
                {/* Weather Warnings */}
                {outfit.warmCoatRecommended && (
                  <ThemedCard variant="warning" style={styles.warningCard}>
                    <ThemedText>Warm Coat Recommended</ThemedText>
                  </ThemedCard>
                )}
                {outfit.rainGearRecommended && (
                  <ThemedCard variant="warning" style={styles.warningCard}>
                    <ThemedText>Rain Gear Recommended</ThemedText>
                  </ThemedCard>
                )}

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
              </>
            )}


          </ThemedView>

          <ThemedView style={styles.spacer}>
            {isPending && (
              <ActivityIndicator size="large" color={tintColor} style={styles.loadingIndicator} />
            )}
          </ThemedView>
          {!isPending && !error && !outfit && (
            <ThemedText style={styles.description}>
              Press the button below to generate an outfit recommendation based on current weather and your preferences.
            </ThemedText>
          )}
          <ThemedButton
            onPress={() => mutate()}
            disabled={isPending}
            style={styles.generateButton}
          >
            {isPending ? 'Generating...' : data ? 'Regenerate Outfit' : 'Generate Outfit'}
          </ThemedButton>
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
    flex: 1,
  },
  spacer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingIndicator: {
    marginVertical: 20,
  },
  generateButton: {
    marginTop: 20,
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
  warningCard: {
    marginBottom: 12,
  },
});
