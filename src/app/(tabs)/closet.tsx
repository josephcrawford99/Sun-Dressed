import { theme, typography } from '@/styles';
import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ClosetScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: Platform.OS === 'ios' ? insets.top : 20 }]}>
        <Text style={styles.title}>My Closet</Text>
      </View>
      
      <View style={styles.content}>
        <View style={styles.placeholderBox}>
          <Text style={styles.comingSoonTitle}>Feature Coming Soon!</Text>
          <Text style={styles.comingSoonText}>
            We're busy tailoring this space for you. Soon, you'll be able to add your own clothes, create custom outfits, and get even smarter recommendations.
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
    borderBottomColor: theme.colors.border,
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
    shadowColor: theme.colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: theme.borderRadius.medium,
    elevation: 5,
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