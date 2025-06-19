import { theme, typography } from '@styles';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ComingSoonPlaceholder from '@/components/ComingSoonPlaceholder';

export default function ClosetScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: Platform.OS === 'ios' ? insets.top : 20 }]}>
        <Text style={styles.title}>My Closet</Text>
      </View>
      
      <ComingSoonPlaceholder
        title="My Closet"
        description="We're busy tailoring this space for you. Soon, you'll be able to add your own clothes, create custom outfits, and get even smarter recommendations."
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.lightGray,
    backgroundColor: theme.colors.white,
  },
  title: {
    ...typography.heading,
    color: theme.colors.black,
  },
});