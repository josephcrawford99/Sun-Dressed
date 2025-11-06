import { StyleSheet, type ViewProps } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export type SectionProps = ViewProps & {
  title?: string;
  children: React.ReactNode;
};

export function Section({ title, style, children, ...rest }: SectionProps) {
  return (
    <ThemedView style={[styles.section, style]} {...rest}>
      {title && (
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          {title}
        </ThemedText>
      )}
      {children}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 20,
    width: '100%',
  },
  sectionTitle: {
    marginBottom: 10,
  },
});
