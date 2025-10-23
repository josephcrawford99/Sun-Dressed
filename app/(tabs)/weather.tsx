import {  ScrollView, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useStore } from '@/store/store';

export default function WeatherScreen() {
    const weather = useStore((state) => state.weather);
    const loading = useStore((state) => state.weatherLoading);
    const error = useStore((state) => state.weatherError);

    return (
        <ThemedView style={styles.container}>
            <ThemedText type="title" style={styles.title}>Weather</ThemedText>

            {loading && (
                <ThemedText>Loading weather data...</ThemedText>
            )}

            {error && (
                <ThemedText style={styles.error}>Error: {error}</ThemedText>
            )}

            {weather && (
                <ScrollView style={styles.scrollView}>
                    <ThemedText style={styles.jsonText}>
                        {JSON.stringify(weather, null, 2)}
                    </ThemedText>
                </ScrollView>
            )}
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    title: {
        marginBottom: 20,
    },
    scrollView: {
        flex: 1,
    },
    jsonText: {
        fontFamily: 'monospace',
        fontSize: 12,
    },
    error: {
        color: '#ff6b6b',
    },
});
