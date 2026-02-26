import { Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useThemeColor } from '@/hooks/use-theme-color';

export function SettingsButton() {
  const router = useRouter();
  const iconColor = useThemeColor({}, 'icon');

  return (
    <Pressable
      onPress={() => router.push('/settings')}
      hitSlop={8}
      style={styles.button}
    >
      <Ionicons name="settings-sharp" size={22} color={iconColor} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 4,
  },
});
