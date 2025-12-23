import { ThemedBackground } from '@/components/themed-background';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Section } from '@/components/ui/section';
import { Shadows } from '@/constants/theme';
import { useWeather } from '@/hooks/use-weather';
import { useStore } from '@/store/store';
import { capitalizeAllWords } from '@/utils/strings';
import { useIsFetching, useQueryClient } from '@tanstack/react-query';
import { Image, Linking, Pressable, RefreshControl, ScrollView, StyleSheet } from 'react-native';

export default function WeatherScreen() {
    const { data: weather, isLoading: loading, error, dataUpdatedAt } = useWeather();
    const tempFormat = useStore((state) => state.tempFormat);
    const tempSymbol = tempFormat === 'metric' ? '°C' : '°F';

    const queryClient = useQueryClient();

    // Check if the weather query is currently fetching
    const isFetching = useIsFetching({ queryKey: ['weather', tempFormat] }) > 0;

    // Pull-to-refresh handler
    const onRefresh = async () => {
        await queryClient.invalidateQueries({
            queryKey: ['weather', tempFormat]
        });
    };

    return (
        <ThemedBackground style={styles.container}>
            <ScrollView
                style={{ flex: 1 }}
                stickyHeaderIndices={[0]}
                contentContainerStyle={{ flexGrow: 1 }}
                refreshControl={
                    <RefreshControl refreshing={isFetching} onRefresh={onRefresh} />
                }
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
                        <Pressable onPress={() => Linking.openSettings()}>
                            <ThemedText style={styles.error}>
                                Error: {error.message}
                                {'\n\n'}
                                <ThemedText style={styles.errorLink}>Tap to open settings →</ThemedText>
                            </ThemedText>
                        </Pressable>
                    )}

                    {weather && dataUpdatedAt && (
                        <>
                            {weather.name && (
                                <ThemedText style={styles.metadataText}>Location: {weather.name}</ThemedText>
                            )}

                            {/* Weather Description */}
                            <ThemedView style={styles.conditionsRow}>
                                <Image
                                    source={{ uri: `https://openweathermap.org/img/wn/${weather.icon}@4x.png` }}
                                    style={styles.weatherIcon}
                                />
                                <ThemedText style={{fontSize: 24}}>
                                    {capitalizeAllWords(weather.description)}
                                </ThemedText>
                                <ThemedText style={{ fontSize: 24 }}>
                                    {"  " + Math.round(weather.temp.current)} {tempSymbol}
                                </ThemedText>
                            </ThemedView>
                        {/* Temperature Display */}
                        <Section title="Temperature">
                            <ThemedText style={styles.dataText}>
                                Feels Like: {Math.round(weather.temp.feels_like)}{tempSymbol}
                            </ThemedText>
                            <ThemedText style={styles.dataText}>
                                High: {Math.round(weather.temp.max)}{tempSymbol}
                            </ThemedText>
                            <ThemedText style={styles.dataText}>
                                Low: {Math.round(weather.temp.min)}{tempSymbol}
                            </ThemedText>

                        </Section>

                        {/* Chance of Rain */}
                        <Section title="Precipitation">
                            <ThemedText style={styles.dataText}>
                                Chance of Rain: {Math.round(weather.pop * 100)}%
                            </ThemedText>
                        </Section>

                        {/* Wind */}
                        <Section title="Wind">
                            <ThemedText style={styles.dataText}>
                                Wind Speed: {Math.round(weather.wind.speed)} {tempFormat === 'imperial' ? 'mph' : 'm/s'}
                            </ThemedText>
                            {weather.wind.gust !== undefined && (
                                <ThemedText style={styles.dataText}>
                                    Wind Gust: {Math.round(weather.wind.gust)} {tempFormat === 'imperial' ? 'mph' : 'm/s'}
                                </ThemedText>
                            )}
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
        paddingVertical: 8,
    },
    content: {
        padding: 20,
        paddingTop: 6,
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
        width: 75,
        height: 75,
        marginRight: 6,
    },
    error: {
        color: '#ff6b6b',
    },
    errorLink: {
        textDecorationLine: 'underline',
        fontWeight: '600',
    },
    hintText: {
        fontSize: 12,
        opacity: 0.6,
        marginBottom: 8,
    },
    metadataText: {
        fontSize: 12,
        marginBottom: 2,
    },
});
