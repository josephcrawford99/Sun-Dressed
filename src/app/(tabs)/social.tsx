import { theme, typography } from '@styles';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ComingSoonPlaceholder from '@/components/ComingSoonPlaceholder';

export default function SocialScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: Platform.OS === 'ios' ? insets.top : 20 }]}>
        <Text style={styles.title}>Social</Text>
      </View>
      
      <ComingSoonPlaceholder
        title="Social"
        description="Get ready to connect! We're building a community space where you can share your favorite outfits, get inspired by others, and see what's trending."
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