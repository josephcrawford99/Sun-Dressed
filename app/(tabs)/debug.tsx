import { useState, useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useClothingRecommend } from '@/hooks/use-clothing-recommend';
import { useWeather } from '@/hooks/use-weather';
import { useStore } from '@/store/store';
import { buildOutfitPrompt } from '@/utils/prompt-generator';

export default function DebugScreen() {
  const { data: weather, isLoading: weatherLoading, error: weatherError } = useWeather();

  // Get user preferences from store
  const style = useStore((state) => state.style);
  const activity = useStore((state) => state.activity);
  const tempFormat = useStore((state) => state.tempFormat);

  // Get outfit mutation data
  const outfitMutation = useClothingRecommend();
  const outfitRawText = outfitMutation.data?.rawText;

  // Reconstruct the prompt that would be used
  const prompt = useMemo(() => {
    if (!weather) return null;
    return buildOutfitPrompt({ style, activity }, weather, tempFormat);
  }, [weather, style, activity, tempFormat]);
  // Collapsible state
  const [expanded, setExpanded] = useState({
    preferences: true,
    weather: false,
    prompt: true,
    outfit: true,
  });

  const toggleSection = (section: keyof typeof expanded) => {
    setExpanded((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <ThemedText type="title" style={styles.title}>
          Debug
        </ThemedText>

        {/* User Preferences Section */}
        <ThemedView style={styles.section}>
          <Pressable onPress={() => toggleSection('preferences')}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              {expanded.preferences ? '▼' : '▶'} User Preferences
            </ThemedText>
          </Pressable>
          {expanded.preferences && (
            <ThemedView style={styles.dataContainer}>
              <ThemedText style={styles.label}>Style:</ThemedText>
              <ThemedText style={styles.value}>{style || 'Not set'}</ThemedText>
              <ThemedText style={styles.label}>Temperature Format:</ThemedText>
              <ThemedText style={styles.value}>{tempFormat || 'Not set'}</ThemedText>

              <ThemedText style={styles.label}>Activity:</ThemedText>
              <ThemedText style={styles.value}>{activity || 'Not set'}</ThemedText>
            </ThemedView>
          )}
        </ThemedView>

        {/* Weather Data Section */}
        <ThemedView style={styles.section}>
          <Pressable onPress={() => toggleSection('weather')}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              {expanded.weather ? '▼' : '▶'} Weather Data
            </ThemedText>
          </Pressable>
          {expanded.weather && (
            <>
              {weatherLoading && (
                <ThemedText style={styles.infoText}>Loading weather data...</ThemedText>
              )}
              {weatherError && (
                <ThemedText style={styles.errorText}>
                  Error: {weatherError.message}
                </ThemedText>
              )}
              {weather && (
                <ThemedView style={styles.jsonContainer}>
                  <ThemedText style={styles.jsonText}>
                    {JSON.stringify(weather, null, 2)}
                  </ThemedText>
                </ThemedView>
              )}
            </>
          )}
        </ThemedView>

        {/* Gemini API - Prompt Section */}
        <ThemedView style={styles.section}>
          <Pressable onPress={() => toggleSection('prompt')}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              {expanded.prompt ? '▼' : '▶'} Current Gemini Prompt
            </ThemedText>
          </Pressable>
          {expanded.prompt && (
            <>
              {prompt ? (
                <ThemedView style={styles.dataContainer}>
                  <ThemedText style={styles.promptText}>{prompt}</ThemedText>
                </ThemedView>
              ) : (
                <ThemedText style={styles.infoText}>
                  Prompt unavailable. Weather data must be loaded first.
                </ThemedText>
              )}
            </>
          )}
        </ThemedView>

        {/* Gemini API - Outfit Response Section */}
        <ThemedView style={styles.section}>
          <Pressable onPress={() => toggleSection('outfit')}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              {expanded.outfit ? '▼' : '▶'} Last Outfit Recommendation
            </ThemedText>
          </Pressable>
          {expanded.outfit && (
            <>
              {outfitRawText ? (
                <ThemedView style={styles.dataContainer}>
                  <ThemedText style={styles.outfitText}>{outfitRawText}</ThemedText>
                </ThemedView>
              ) : (
                <ThemedText style={styles.infoText}>
                  No outfit yet. Generate an outfit to see the recommendation.
                </ThemedText>
              )}
            </>
          )}
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  title: {
    marginBottom: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    marginBottom: 10,
  },
  dataContainer: {
    padding: 15,
    backgroundColor: 'rgba(128, 128, 128, 0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(128, 128, 128, 0.2)',
  },
  jsonContainer: {
    padding: 15,
    backgroundColor: 'rgba(128, 128, 128, 0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(128, 128, 128, 0.2)',
  },
  jsonText: {
    fontFamily: 'monospace',
    fontSize: 12,
    lineHeight: 18,
  },
  label: {
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 4,
  },
  value: {
    marginBottom: 8,
    opacity: 0.8,
  },
  promptText: {
    fontSize: 13,
    lineHeight: 20,
    opacity: 0.9,
  },
  outfitText: {
    fontSize: 14,
    lineHeight: 22,
  },
  infoText: {
    opacity: 0.6,
    fontStyle: 'italic',
  },
  errorText: {
    color: '#ff6b6b',
  },
});
