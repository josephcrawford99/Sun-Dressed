import { StyleSheet, Text, View } from 'react-native';
import { theme, typography } from '@/styles';

interface ComingSoonPlaceholderProps {
  title: string;
  description: string;
}

export default function ComingSoonPlaceholder({ title, description }: ComingSoonPlaceholderProps) {
  return (
    <View style={styles.content}>
      <View style={styles.placeholderBox}>
        <Text style={styles.comingSoonTitle}>Feature Coming Soon!</Text>
        <Text style={styles.comingSoonText}>
          {description}
        </Text>
        <Text style={styles.stayTunedText}>
          Stay tuned!
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  placeholderBox: {
    width: '90%',
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.large,
    alignItems: 'center',
    ...theme.shadows.medium,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  comingSoonTitle: {
    ...typography.subheading,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  comingSoonText: {
    ...typography.body,
    color: theme.colors.gray,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: theme.spacing.lg,
  },
  stayTunedText: {
    ...typography.body,
    fontWeight: '600',
    fontStyle: 'italic',
  },
});