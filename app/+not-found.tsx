// app/+not-found.tsx
import { Link, Stack } from 'expo-router';
import { Text, View } from 'react-native';

export default function NotFoundScreen() {
    return (
        <>
            <Stack.Screen options={{ title: 'Oops!' }} />
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 24, marginBottom: 16 }}>This screen doesn&apos;t exist.</Text>
                <Link href="/" style={{ color: 'blue', textDecorationLine: 'underline' }}>
                    Go to home screen!
                </Link>
            </View>
        </>
    );
}
