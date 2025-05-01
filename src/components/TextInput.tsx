import React, { useState } from 'react';
import { 
  TextInput as RNTextInput, 
  StyleSheet, 
  View, 
  Text, 
  ViewStyle,
  TextStyle,
  TextInputProps as RNTextInputProps,
  TouchableOpacity,
} from 'react-native';
import { inputStyles, colors } from '../styles/theme';
import { Ionicons } from '@expo/vector-icons';

interface TextInputProps extends RNTextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  inputStyle?: ViewStyle;
  secureTextEntry?: boolean;
  showPasswordToggle?: boolean;
}

/**
 * A standardized text input component following the app's design system.
 * Uses the theme's inputStyles for consistent styling.
 */
const TextInput: React.FC<TextInputProps> = ({
  label,
  error,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  containerStyle,
  labelStyle,
  inputStyle,
  showPasswordToggle = false,
  ...rest
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const inputType = 'standard'; // We could allow different input types in the future
  const inputStyleConfig = inputStyles[inputType];
  
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(prev => !prev);
  };

  const finalSecureTextEntry = secureTextEntry && !isPasswordVisible;

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.label, labelStyle]}>
          {label}
        </Text>
      )}
      
      <View style={styles.inputContainer}>
        <RNTextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={inputStyleConfig.placeholderColor}
          secureTextEntry={finalSecureTextEntry}
          style={[
            styles.input,
            {
              backgroundColor: inputStyleConfig.backgroundColor,
              color: inputStyleConfig.textColor,
              borderColor: error 
                ? inputStyleConfig.errorColor 
                : inputStyleConfig.borderColor,
            },
            inputStyle,
          ]}
          autoCapitalize="none"
          {...rest}
        />
        
        {secureTextEntry && showPasswordToggle && (
          <TouchableOpacity 
            style={styles.passwordToggle}
            onPress={togglePasswordVisibility}
          >
            <Ionicons 
              name={isPasswordVisible ? 'eye-off' : 'eye'} 
              size={20} 
              color={colors.black} 
            />
          </TouchableOpacity>
        )}
      </View>
      
      {error && (
        <Text style={styles.errorText}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
    width: '100%',
  },
  label: {
    marginBottom: 5,
    fontWeight: '500',
    color: colors.black,
    fontSize: 14,
  },
  inputContainer: {
    position: 'relative',
    width: '100%',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    width: '100%',
  },
  passwordToggle: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: [{ translateY: -10 }], // Adjust based on icon size
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: 5,
  },
});

export default TextInput;
