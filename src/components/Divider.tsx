import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { typography } from '../styles/typography';
import { createTheme } from '../styles/theme';

const theme = createTheme();

interface DividerProps {
  text?: string;
}

const Divider: React.FC<DividerProps> = ({ text }) => (
  <View style={styles.row}>
    <View style={styles.line} />
    {text ? <Text style={styles.text}>{text}</Text> : null}
    <View style={styles.line} />
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.textSecondary,
  },
  text: {
    ...typography.caption,
    marginHorizontal: 8,
    color: theme.colors.textSecondary,
  },
});

export default Divider;
