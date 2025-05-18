import React from 'react';
import { TextInput, StyleSheet, View, Text, TextInputProps } from 'react-native';
import { typography } from '../styles/typography';
import { createTheme } from '../styles/theme';

const theme = createTheme();

interface InputFieldProps extends TextInputProps {
  error?: string | null;
}

const InputField: React.FC<InputFieldProps> = ({ error, style, ...props }) => {
  return (
    <View style={{ marginBottom: 12 }}>
      <TextInput
        style={[
          typography.body,
          styles.input,
          error ? styles.inputError : null,
          style,
        ]}
        placeholderTextColor={theme.colors.textSecondary}
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    height: 44,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: theme.colors.textSecondary,
  },
  inputError: {
    borderColor: '#b94a48', // fallback error color
  },
  errorText: {
    color: '#b94a48', // fallback error color
    fontSize: 12,
    marginTop: 2,
    marginLeft: 2,
    textAlign: 'left',
  },
});

export default InputField;
