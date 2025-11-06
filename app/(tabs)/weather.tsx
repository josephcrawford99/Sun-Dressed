import { ThemedBackground } from '@/components/themed-background';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Section } from '@/components/ui/section';
import { Shadows } from '@/constants/theme';
import { useWeather } from '@/hooks/use-weather';
import { useStore } from '@/store/store';
import { Image, ScrollView, StyleSheet } from 'react-native';

export default function WeatherScreen() {
    const { data: weather, isLoading: loading, error } = useWeather();
    const tempFormat = useStore((state) => state.tempFormat);
    const tempSymbol = tempFormat === 'metric' ? '°C' : '°F';

    return (
        <ThemedBackground style={styles.container}>
            <ScrollView
                style={{ flex: 1 }}
                stickyHeaderIndices={[0]}
                contentContainerStyle={{ flexGrow: 1 }}
            >
                <ThemedView style={styles.titleContainer}>
                    <ThemedText type="title" style={styles.title}>
                        Weather
                    </ThemedText>
                </ThemedView>
                <ThemedView style={styles.content}>
                    {loading && (
                        <ThemedText>Loading weather data...</ThemedText>
                    )}

                    {error && (
                        <ThemedText style={styles.error}>Error: {error.message}</ThemedText>
                    )}

                    {weather && (
                        <>
                            {/* Weather Description */}
                            <Section title="Conditions" style={styles.conditionsSection}>
                            <ThemedView style={styles.conditionsRow}>
                                <Image
                                    source={{ uri: `https://openweathermap.org/img/wn/${weather.daily[0].weather[0].icon}@2x.png` }}
                                    style={styles.weatherIcon}
                                />
                                <ThemedText style={styles.dataText}>
                                    {weather.daily[0].weather[0].description}
                                </ThemedText>
                            </ThemedView>
                        </Section>
                        {/* Temperature Display */}
                        <Section title="Temperature">
                            <ThemedText style={styles.dataText}>
                                High: {Math.round(weather.daily[0].temp.max)}{tempSymbol}
                            </ThemedText>
                            <ThemedText style={styles.dataText}>
                                Low: {Math.round(weather.daily[0].temp.min)}{tempSymbol}
                            </ThemedText>
                        </Section>

                        {/* Chance of Rain */}
                        <Section title="Precipitation">
                            <ThemedText style={styles.dataText}>
                                Chance of Rain: {Math.round(weather.daily[0].pop * 100)}%
                            </ThemedText>
                        </Section>

                        {/* UV Index */}
                        <Section title="UV Index">
                            <ThemedText style={styles.dataText}>
                                UV Index: {Math.round(weather.daily[0].uvi)}
                            </ThemedText>
                        </Section>
                    </>
                )}
                </ThemedView>
            </ScrollView>
        </ThemedBackground >

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
    },
    conditionsSection: {
        marginBottom: 8,
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
        marginRight: 6,
    },
    error: {
        color: '#ff6b6b',
    },
});
