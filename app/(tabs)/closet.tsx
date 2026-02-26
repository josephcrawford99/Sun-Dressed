import { ScrollView, StyleSheet } from 'react-native';

import { ScreenHeader } from '@/components/screen-header';
import { ThemedBackground } from '@/components/themed-background';
import { ThemedView } from '@/components/themed-view';

export default function ClosetScreen() {
  return (
    <ThemedBackground style={styles.container}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        stickyHeaderIndices={[0]}
      >
        <ScreenHeader title="Closet" />
        <ThemedView style={styles.content} />
      </ScrollView>
    </ThemedBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingTop: 15,
    flex: 1,
  },
});
