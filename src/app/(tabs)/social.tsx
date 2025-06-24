import { theme, typography } from '@styles';
import { StyleSheet, Text, View } from 'react-native';
import ComingSoonPlaceholder from '@/components/ComingSoonPlaceholder';
import SafeAreaWrapper from '@/components/SafeAreaWrapper';

export default function SocialScreen() {
  return (
    <SafeAreaWrapper style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Social</Text>
      </View>
      
      <ComingSoonPlaceholder
        title="Social"
        description="Get ready to connect! We're building a community space where you can share your favorite outfits, get inspired by others, and see what's trending."
      />
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
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