import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { WeatherCode, weatherIconMap } from '../utils/weatherIcons';

interface WeatherIconProps {
  weatherCode: WeatherCode;
  size?: number;
  color?: string;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({
  weatherCode,
  size = 24,
  color = '#000'
}) => {
  const iconName = weatherIconMap[weatherCode] || 'help-circle-outline';

  return (
    <Ionicons
      name={iconName}
      size={size}
      color={color}
    />
  );
};