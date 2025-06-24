import { theme, typography } from '@styles';
import { StyleSheet, Text, View } from 'react-native';
import ComingSoonPlaceholder from '@/components/ComingSoonPlaceholder';
import SafeAreaWrapper from '@/components/SafeAreaWrapper';

export default function ClosetScreen() {
  return (
    <SafeAreaWrapper style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Closet</Text>
      </View>
      
      <ComingSoonPlaceholder
        title="My Closet"
        description="We're busy tailoring this space for you. Soon, you'll be able to add your own clothes, create custom outfits, and get even smarter recommendations."
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