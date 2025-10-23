import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function WeatherScreen() {
    return (
        <ThemedView style={styles.container}>
            <ThemedText type="title">Weather</ThemedText>
            <ThemedText>Weather data will appear here.</ThemedText>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
});
