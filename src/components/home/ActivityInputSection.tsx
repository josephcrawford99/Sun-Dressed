import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput } from '@/components/ui/TextInput';
import { theme } from '@styles';

interface ActivityInputSectionProps {
  value: string;
  onChangeText: (text: string) => void;
}

export const ActivityInputSection: React.FC<ActivityInputSectionProps> = ({
  value,
  onChangeText,
}) => {
  return (
    <View style={styles.activityContainer}>
      <TextInput
        placeholder="Activity"
        size="medium"
        value={value}
        onChangeText={onChangeText}
        editable={true}
        returnKeyType="done"
        blurOnSubmit={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  activityContainer: {
    display: 'flex',
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.none,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.lightGray,
    backgroundColor: theme.colors.white,
  },
});