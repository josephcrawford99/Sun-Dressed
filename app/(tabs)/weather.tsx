import { ThemedBackground } from '@/components/themed-background';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Section } from '@/components/ui/section';
import { Shadows } from '@/constants/theme';
import { useWeather } from '@/hooks/use-weather';
import { useStore } from '@/store/store';
import { capitalizeAllWords } from '@/utils/strings';
import { useIsFetching, useQueryClient } from '@tanstack/react-query';
import { Image, RefreshControl, ScrollView, StyleSheet } from 'react-native';

export default function WeatherScreen() {
    const { data: weather, isLoading: loading, error, dataUpdatedAt } = useWeather();
    const tempFormat = useStore((state) => state.tempFormat);
    const tempSymbol = tempFormat === 'metric' ? '°C' : '°F';

    const queryClient = useQueryClient();

    // Check if the 2.5 query is currently fetching
    const isFetching25 = useIsFetching({ queryKey: ['weather-2.5', tempFormat] }) > 0;

    // Pull-to-refresh handler - only invalidates the 2.5 API query
    const onRefresh = async () => {
        await queryClient.invalidateQueries({
            queryKey: ['weather-2.5', tempFormat]
        });
    };

    return (
        <ThemedBackground style={styles.container}>
            <ScrollView
                style={{ flex: 1 }}
                stickyHeaderIndices={[0]}
                contentContainerStyle={{ flexGrow: 1 }}
                refreshControl={
                    <RefreshControl refreshing={isFetching25} onRefresh={onRefresh} />
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
                        <ThemedText style={styles.error}>Error: {error.message}</ThemedText>
                    )}

                    {weather && dataUpdatedAt && (
                        <>
                            <ThemedText style={{ fontSize: 12 }}>Last updated: {new Date(dataUpdatedAt).toLocaleString()}</ThemedText>
                            {weather.name && (
                                <ThemedText style={{ fontSize: 12 }}>Location: {weather.name}</ThemedText>
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
                        {weather.uvi !== undefined && (
                            <Section title="UV Index">
                                <ThemedText style={styles.dataText}>
                                    UV Index: {Math.round(weather.uvi)}
                                </ThemedText>
                            </Section>
                        )}
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
        width: 75,
        height: 75,
        marginRight: 6,
    },
    error: {
        color: '#ff6b6b',
    },
    hintText: {
        fontSize: 12,
        opacity: 0.6,
        marginBottom: 8,
    },
});
