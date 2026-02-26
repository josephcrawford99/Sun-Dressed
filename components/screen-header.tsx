import { StyleSheet, View } from 'react-native';

import { SettingsButton } from '@/components/settings-button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Shadows } from '@/constants/theme';

type ScreenHeaderProps = {
  title: string;
  showSettings?: boolean;
};

export function ScreenHeader({ title, showSettings = true }: ScreenHeaderProps) {
  return (
    <ThemedView style={styles.container}>
      <View style={styles.row}>
        <ThemedText type="title" style={styles.title}>
          {title}
        </ThemedText>
        {showSettings && <SettingsButton />}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    ...Shadows.stickyHeader,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 20,
  },
  title: {
    padding: 20,
    paddingVertical: 8,
  },
});
