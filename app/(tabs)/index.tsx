import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet } from 'react-native';

import { OutfitItemCard } from '@/components/outfit-item-card';
import { ThemedBackground } from '@/components/themed-background';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ThemedButton } from '@/components/button';
import { ThemedCard } from '@/components/card';
import { ThemedTextInput } from '@/components/input';
import { Section } from '@/components/section';
import { Shadows } from '@/constants/theme';
import { useClothingRecommend } from '@/hooks/use-clothing-recommend';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useStore } from '@/store/store';

export default function OutfitScreen() {
  const { refetch, data, isFetching, error } = useClothingRecommend();

  const activity = useStore((state) => state.activity);
  const setActivity = useStore((state) => state.setActivity);

  const tintColor = useThemeColor({}, 'tint');

  const outfit = data?.recommendation;

  // Pull-to-refresh handler
  const onRefresh = async () => {
    await refetch();
  };

  // Format error message for better UX
  const getErrorMessage = (error: Error): string => {
    const message = error.message.toLowerCase();

    // Check for specific error types
    if (message.includes('503') || message.includes('service unavailable')) {
      return 'The outfit service is temporarily unavailable. Please try again in a moment.';
    }
    if (message.includes('network') || message.includes('timeout')) {
      return 'Network error. Please check your connection and try again.';
    }
    if (message.includes('location permission')) {
      return 'Location permission is required to get weather data for outfit recommendations. Please enable location access in Settings.';
    }
    if (message.includes('api key')) {
      return 'Configuration error. Please contact support.';
    }
    if (message.includes('rate limit')) {
      return 'Too many requests. Please wait a moment and try again.';
    }

    // Default friendly message
    return 'Unable to generate outfit recommendation. Please try again.';
  };

  return (
    <ThemedBackground style={styles.container}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        stickyHeaderIndices={[0]}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl refreshing={isFetching} onRefresh={onRefresh} />
        }
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
                <ThemedText style={styles.errorText}>{getErrorMessage(error)}</ThemedText>
              </ThemedCard>
            )}

            {outfit && (
              <>
                {/* Weather Warnings */}
                {outfit.warmCoatRecommended && (
                  <ThemedCard variant="warning" style={styles.warningCard} icon={{ type: 'MaterialIcons', name: 'severe-cold' }}>
                    <ThemedText>Warm Coat Recommended</ThemedText>
                  </ThemedCard>
                )}
                {outfit.rainGearRecommended && (
                  <ThemedCard variant="warning" style={styles.warningCard} icon={{ type: 'Ionicons', name: 'rainy-outline' }}>
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
            {isFetching && (
              <ActivityIndicator size="large" color={tintColor} style={styles.loadingIndicator} />
            )}
          </ThemedView>
          {!isFetching && !error && !outfit && (
            <ThemedText style={styles.description}>
              Pull down or press the button below to generate your outfit.
            </ThemedText>
          )}
          <ThemedButton
            onPress={() => refetch()}
            disabled={isFetching}
            style={styles.generateButton}
          >
            {isFetching ? 'Generating...' : data ? 'Regenerate Outfit' : 'Generate Outfit'}
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
    paddingVertical: 8
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
