import { Image, ScrollView, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useWeather } from '@/hooks/use-weather';

export default function WeatherScreen() {
    const { data: weather, isLoading: loading, error } = useWeather();

    return (
        <ThemedView style={styles.container}>
            <ScrollView style={{ flex: 1, padding: 20 }}>
                <ThemedText type="title" style={styles.title}>Weather</ThemedText>

                {loading && (
                    <ThemedText>Loading weather data...</ThemedText>
                )}

                {error && (
                    <ThemedText style={styles.error}>Error: {error.message}</ThemedText>
                )}

                {weather && (
                    <ThemedView style={styles.weatherContent}>
                        {/* Temperature Display */}
                        <ThemedView style={styles.section}>
                            <ThemedText type="subtitle" style={styles.sectionTitle}>Temperature</ThemedText>
                            <ThemedText style={styles.dataText}>
                                High: {Math.round(weather.daily[0].temp.max)}°C
                            </ThemedText>
                            <ThemedText style={styles.dataText}>
                                Low: {Math.round(weather.daily[0].temp.min)}°C
                            </ThemedText>
                        </ThemedView>

                        {/* Chance of Rain */}
                        <ThemedView style={styles.section}>
                            <ThemedText type="subtitle" style={styles.sectionTitle}>Precipitation</ThemedText>
                            <ThemedText style={styles.dataText}>
                                Chance of Rain: {Math.round(weather.daily[0].pop * 100)}%
                            </ThemedText>
                        </ThemedView>

                        {/* UV Index */}
                        <ThemedView style={styles.section}>
                            <ThemedText type="subtitle" style={styles.sectionTitle}>UV Index</ThemedText>
                            <ThemedText style={styles.dataText}>
                                UV Index: {Math.round(weather.daily[0].uvi)}
                            </ThemedText>
                        </ThemedView>

                        {/* Weather Description */}
                        <ThemedView style={styles.section}>
                            <ThemedText type="subtitle" style={styles.sectionTitle}>Conditions</ThemedText>
                            <ThemedView style={styles.conditionsRow}>
                                <Image
                                    source={{ uri: `https://openweathermap.org/img/wn/${weather.daily[0].weather[0].icon}@2x.png` }}
                                    style={styles.weatherIcon}
                                />
                                <ThemedText style={styles.dataText}>
                                    {weather.daily[0].weather[0].description}
                                </ThemedText>
                            </ThemedView>
                        </ThemedView>
                    </ThemedView>
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
        marginBottom: 0,
    },
    weatherContent: {
        flex: 1,
    },
    section: {
        marginBottom: 0,
    },
    sectionTitle: {
        marginBottom: 0,
    },
    dataText: {
        fontSize: 18,
        marginVertical: 4,
    },
    conditionsRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    weatherIcon: {
        width: 50,
        height: 50,
        marginRight: 8,
    },
    error: {
        color: '#ff6b6b',
    },
});
