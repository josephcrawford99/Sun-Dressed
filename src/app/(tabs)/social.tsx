import { theme, typography } from '@styles';
import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SocialScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: Platform.OS === 'ios' ? insets.top : 20 }]}>
        <Text style={styles.title}>Social</Text>
      </View>
      
      <View style={styles.content}>
        <View style={styles.placeholderBox}>
          <Text style={styles.comingSoonTitle}>Feature Coming Soon!</Text>
          <Text style={styles.comingSoonText}>
            Get ready to connect! We&apos;re building a community space where you can share your favorite outfits, get inspired by others, and see what&apos;s trending.
          </Text>
          <Text style={styles.stayTunedText}>
            Stay tuned!
          </Text>
        </View>
      </View>
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