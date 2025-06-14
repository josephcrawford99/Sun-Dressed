import { TemperatureUnit, SpeedUnit } from '@/types/settings';

export const convertTemperature = (
  tempF: number, 
  targetUnit: TemperatureUnit
): number => {
  if (targetUnit === 'Celsius') {
    return Math.round((tempF - 32) * 5/9);
  }
  return Math.round(tempF);
};

export const convertSpeed = (
  speedMph: number, 
  targetUnit: SpeedUnit
): number => {
  if (targetUnit === 'kph') {
    return Math.round(speedMph * 1.609344);
  }
  return Math.round(speedMph);
};

export const getTemperatureSymbol = (unit: TemperatureUnit): string => {
  return unit === 'Celsius' ? '°C' : '°F';
};

export const getSpeedSymbol = (unit: SpeedUnit): string => {
  return unit === 'kph' ? 'km/h' : 'mph';
};