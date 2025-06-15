import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme, typography } from '@styles';
import { getTimeBasedGreeting } from '@/utils/timeUtils';

interface HomeHeaderProps {
  userName?: string;
}

export const HomeHeader: React.FC<HomeHeaderProps> = ({ userName }) => {
  return (
    <View style={styles.greetingRow}>
      <View>
        <Text style={typography.label}>{getTimeBasedGreeting()},</Text>
        <Text style={styles.name}>{userName || 'Name!'}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  greetingRow: {
    marginHorizontal: theme.spacing.md,
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.md,
    paddingLeft: theme.spacing.xs,
  },
  name: {
    ...typography.headingItalic,
    marginTop: -4,
    paddingLeft: theme.spacing.xs,
    fontSize: theme.fontSize.display,
  },
});