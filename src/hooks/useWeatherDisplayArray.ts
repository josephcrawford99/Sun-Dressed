import { useCallback } from 'react';
import { Weather, WeatherDisplay } from '@/types/weather';
import { useSettings } from '@/contexts/SettingsContext';
import { convertTemperature, convertSpeed, getTemperatureSymbol, getSpeedSymbol } from '@/utils/unitConversions';

export const useWeatherDisplayArray = () => {
  const { settings } = useSettings();

  const convertToDisplayArray = useCallback((weatherArray: Weather[]): WeatherDisplay[] => {
    const tempSymbol = getTemperatureSymbol(settings.temperatureUnit);
    const speedSymbol = getSpeedSymbol(settings.speedUnit);

    return weatherArray.map(weather => ({
      ...weather,
      displayTemp: {
        feelsLike: `${convertTemperature(weather.feelsLikeTemp, settings.temperatureUnit)}${tempSymbol}`,
        high: `${convertTemperature(weather.dailyHighTemp, settings.temperatureUnit)}${tempSymbol}`,
        low: `${convertTemperature(weather.dailyLowTemp, settings.temperatureUnit)}${tempSymbol}`,
        current: `${convertTemperature(weather.feelsLikeTemp, settings.temperatureUnit)}${tempSymbol}`
      },
      displayWind: {
        speed: `${convertSpeed(weather.windiness, settings.speedUnit)}`,
        unit: speedSymbol
      },
      temperatureUnit: tempSymbol
    }));
  }, [settings.temperatureUnit, settings.speedUnit]);

  return { convertToDisplayArray };
};