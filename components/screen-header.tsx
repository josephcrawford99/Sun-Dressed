import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { SettingsButton } from '@/components/settings-button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Shadows } from '@/constants/theme';

type ScreenHeaderProps = {
  title: string;
  showBack?: boolean;
  showSettings?: boolean;
};

export function ScreenHeader({ title, showBack = false, showSettings = true }: ScreenHeaderProps) {
  const router = useRouter();
  const iconColor = useThemeColor({}, 'text');

  return (
    <ThemedView style={styles.container}>
      <View style={styles.row}>
        <View style={styles.left}>
          {showBack && (
            <Pressable onPress={() => router.back()} hitSlop={16} style={styles.backButton}>
              <Ionicons name="chevron-back" size={24} color={iconColor} />
            </Pressable>
          )}
          <ThemedText type="title" style={styles.title}>
            {title}
          </ThemedText>
        </View>
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
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    paddingLeft: 20,
    paddingBottom: 15,
    justifyContent: 'center',
  },
  title: {
    padding: 20,
    paddingVertical: 8,
  },
});
