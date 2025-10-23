import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useStore } from '@/store/store';

export default function OutfitScreen() {
  const style = useStore((state) => state.style);
  const activity = useStore((state) => state.activity);
  const weather = useStore((state) => state.weather);
  const weatherLoading = useStore((state) => state.weatherLoading);
  const weatherError = useStore((state) => state.weatherError);

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Outfit
      </ThemedText>

      <ThemedView style={styles.infoContainer}>
        <ThemedView style={styles.infoRow}>
          <ThemedText type="defaultSemiBold">Style: </ThemedText>
          <ThemedText>{style || 'Not set'}</ThemedText>
        </ThemedView>

        <ThemedView style={styles.infoRow}>
          <ThemedText type="defaultSemiBold">Activity: </ThemedText>
          <ThemedText>{activity || 'Not set'}</ThemedText>
        </ThemedView>

        <ThemedView style={styles.infoRow}>
          <ThemedText type="defaultSemiBold">Temperature: </ThemedText>
          {weatherLoading && <ThemedText>Loading...</ThemedText>}
          {weatherError && <ThemedText style={styles.error}>{weatherError}</ThemedText>}
          {weather?.current?.temp && (
            <ThemedText>{Math.round(weather.current.temp)}°C</ThemedText>
          )}
          {!weatherLoading && !weatherError && !weather?.current?.temp && (
            <ThemedText>Not available</ThemedText>
          )}
        </ThemedView>
      </ThemedView>

      <ThemedText style={styles.description}>
        Your outfit recommendations will appear here based on your preferences.
      </ThemedText>
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
  infoContainer: {
    width: '100%',
    marginBottom: 30,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  description: {
    marginTop: 20,
    opacity: 0.7,
  },
  error: {
    color: '#ff6b6b',
  },
});
