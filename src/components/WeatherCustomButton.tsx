import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  View, 
  ActivityIndicator 
} from 'react-native';
import { WeatherIcon } from './WeatherIcon';
import { WeatherCode } from '../utils/weatherIcons';
import { typography } from '../styles/typography';
import { theme } from '../styles/theme';

interface WeatherCustomButtonProps {
  temperature?: number;
  weatherCode?: WeatherCode;
  temperatureUnit?: 'C' | 'F';
  isLoading?: boolean;
  onPress: () => void;
}

const WeatherCustomButton: React.FC<WeatherCustomButtonProps> = ({
  temperature,
  weatherCode = '01d',
  temperatureUnit = 'C',
  isLoading = false,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.buttonContent}>
        {isLoading ? (
          <>
            <ActivityIndicator size="small" color="#FFF" />
            <Text style={styles.temperatureText}>--°</Text>
          </>
        ) : (
          <>
            <WeatherIcon
              weatherCode={weatherCode}
              size={20}
              color="#FFF"
            />
            <Text style={styles.temperatureText}>
              {temperature !== undefined ? `${temperature}°${temperatureUnit}` : '--°'}
            </Text>
          </>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: theme.colors.black,
    borderRadius: theme.borderRadius.medium,
    paddingHorizontal: theme.spacing.sm,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 90,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    paddingHorizontal: 6,
  },
  temperatureText: {
    ...typography.tempButton,
    color: theme.colors.white,
    marginLeft: 8,
  },
});

export default WeatherCustomButton;