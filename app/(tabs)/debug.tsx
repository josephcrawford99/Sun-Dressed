import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet } from 'react-native';

import { ThemedBackground } from '@/components/themed-background';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ThemedCard } from '@/components/ui/card';
import { useWeather } from '@/hooks/use-weather';
import { useStore } from '@/store/store';
import { buildOutfitPrompt } from '@/utils/prompt-generator';
import { useQueryClient } from '@tanstack/react-query';
import { OutfitGenerationResult } from '@/services/gemini-service';
import { Weather30Result, Weather25Result } from '@/services/openweathermap-service';

export default function DebugScreen() {
  const { data: weather, isLoading: weatherLoading, error: weatherError } = useWeather();

  // Get user preferences from store
  const style = useStore((state) => state.style);
  const activity = useStore((state) => state.activity);
  const tempFormat = useStore((state) => state.tempFormat);

  // Access React Query cache to get full weather API results (includes raw data)
  const queryClient = useQueryClient();
  const weather30State = queryClient.getQueryState<Weather30Result>(['weather-3.0', tempFormat]);
  const weather25State = queryClient.getQueryState<Weather25Result>(['weather-2.5', tempFormat]);

  // Access mutation cache to get last outfit data
  const mutationCache = queryClient.getMutationCache();
  const mutations = mutationCache.findAll({ mutationKey: ['outfit-generation'] });
  const lastMutation = mutations[mutations.length - 1];
  const outfitRawText = (lastMutation?.state.data as OutfitGenerationResult | undefined)?.rawText || null;

  // Reconstruct the prompt that would be used
  const prompt = useMemo(() => {
    if (!weather) return null;
    return buildOutfitPrompt({ style, activity }, weather, tempFormat);
  }, [weather, style, activity, tempFormat]);

  // Collapsible state
  const [expanded, setExpanded] = useState({
    preferences: true,
    weather30: false,
    weather25: false,
    weatherMerged: false,
    prompt: true,
    outfit: true,
  });

  const toggleSection = (section: keyof typeof expanded) => {
    setExpanded((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <ThemedBackground style={styles.container}>
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
            <ThemedCard variant="data">
              <ThemedText style={styles.label}>Style:</ThemedText>
              <ThemedText style={styles.value}>{style || 'Not set'}</ThemedText>
              <ThemedText style={styles.label}>Temperature Format:</ThemedText>
              <ThemedText style={styles.value}>{tempFormat || 'Not set'}</ThemedText>

              <ThemedText style={styles.label}>Activity:</ThemedText>
              <ThemedText style={styles.value}>{activity || 'Not set'}</ThemedText>
            </ThemedCard>
          )}
        </ThemedView>

        {/* Weather 3.0 API Section */}
        <ThemedView style={styles.section}>
          <Pressable onPress={() => toggleSection('weather30')}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              {expanded.weather30 ? '▼' : '▶'} Weather 3.0 API (12hr stale)
            </ThemedText>
          </Pressable>
          {expanded.weather30 ? (
            <>
              {weather30State?.dataUpdatedAt ? (
                <ThemedText style={styles.infoText}>
                  Last updated: {new Date(weather30State.dataUpdatedAt).toLocaleString()}
                </ThemedText>
              ) : null}
              {weather30State?.data?.raw ? (
                <ThemedCard variant="data">
                  <ThemedText style={styles.jsonText}>
                    {JSON.stringify(weather30State.data.raw, null, 2)}
                  </ThemedText>
                </ThemedCard>
              ) : (
                <ThemedText style={styles.infoText}>
                  3.0 API data not yet loaded
                </ThemedText>
              )}
            </>
          ) : null}
        </ThemedView>

        {/* Weather 2.5 API Section */}
        <ThemedView style={styles.section}>
          <Pressable onPress={() => toggleSection('weather25')}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              {expanded.weather25 ? '▼' : '▶'} Weather 2.5 API (5min stale)
            </ThemedText>
          </Pressable>
          {expanded.weather25 ? (
            <>
              {weather25State?.dataUpdatedAt ? (
                <ThemedText style={styles.infoText}>
                  Last updated: {new Date(weather25State.dataUpdatedAt).toLocaleString()}
                </ThemedText>
              ) : null}
              {weather25State?.data?.raw ? (
                <>
                  <ThemedText style={styles.infoText}>Current Weather (/weather):</ThemedText>
                  <ThemedCard variant="data">
                    <ThemedText style={styles.jsonText}>
                      {JSON.stringify(weather25State.data.raw.current, null, 2)}
                    </ThemedText>
                  </ThemedCard>
                  {weather25State.data.raw.forecast ? (
                    <>
                      <ThemedText style={[styles.infoText, { marginTop: 12 }]}>Forecast (/forecast):</ThemedText>
                      <ThemedCard variant="data">
                        <ThemedText style={styles.jsonText}>
                          {JSON.stringify(weather25State.data.raw.forecast, null, 2)}
                        </ThemedText>
                      </ThemedCard>
                    </>
                  ) : (
                    <ThemedText style={[styles.infoText, { marginTop: 12 }]}>
                      Forecast endpoint disabled (not needed - 3.0 provides better daily data)
                    </ThemedText>
                  )}
                </>
              ) : (
                <ThemedText style={styles.infoText}>
                  2.5 API data not yet loaded
                </ThemedText>
              )}
            </>
          ) : null}
        </ThemedView>

        {/* Merged Weather Data Section */}
        <ThemedView style={styles.section}>
          <Pressable onPress={() => toggleSection('weatherMerged')}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              {expanded.weatherMerged ? '▼' : '▶'} Merged Weather Data (Synthesis)
            </ThemedText>
          </Pressable>
          {expanded.weatherMerged ? (
            <>
              {weatherLoading ? (
                <ThemedText style={styles.infoText}>Loading weather data...</ThemedText>
              ) : null}
              {weatherError ? (
                <ThemedText style={styles.errorText}>
                  Error: {weatherError.message}
                </ThemedText>
              ) : null}
              {weather ? (
                <>
                  <ThemedText style={styles.infoText}>
                    Strategy: Current conditions from 2.5 (fresher), UV + daily from 3.0 (comprehensive)
                  </ThemedText>
                  <ThemedCard variant="data">
                    <ThemedText style={styles.jsonText}>
                      {JSON.stringify(weather, null, 2)}
                    </ThemedText>
                  </ThemedCard>
                </>
              ) : null}
            </>
          ) : null}
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
                <ThemedCard variant="data">
                  <ThemedText style={styles.promptText}>{prompt}</ThemedText>
                </ThemedCard>
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
          {outfitRawText && (
            <ThemedCard variant="data">
              <ThemedText style={styles.outfitText}>{outfitRawText}</ThemedText>
            </ThemedCard>
          )}
        </ThemedView>
      </ScrollView>
    </ThemedBackground>
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
  jsonText: {
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
