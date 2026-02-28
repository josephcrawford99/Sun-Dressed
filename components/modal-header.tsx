import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Fonts, Shadows } from '@/constants/theme';

type ModalHeaderProps = {
  title: string;
};

export function ModalHeader({ title }: ModalHeaderProps) {
  const router = useRouter();
  const iconColor = useThemeColor({}, 'text');

  return (
    <ThemedView style={styles.container}>
      <View style={styles.row}>
        <ThemedText style={styles.title}>{title}</ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    ...Shadows.stickyHeader,
    paddingTop: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontFamily: Fonts.title,
    fontStyle: 'italic',
    paddingVertical: 10,
    marginLeft: 10,
    marginTop: 10,
  },
});
