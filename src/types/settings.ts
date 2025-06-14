export interface UserSettings {
  name: string;
  email: string;
  temperatureUnit: 'Celsius' | 'Fahrenheit';
  speedUnit: 'mph' | 'kph';
  stylePreference: 'masculine' | 'feminine' | 'neutral';
}

export const DEFAULT_SETTINGS: UserSettings = {
  name: '',
  email: '',
  temperatureUnit: 'Fahrenheit',
  speedUnit: 'mph',
  stylePreference: 'neutral'
};

export type TemperatureUnit = UserSettings['temperatureUnit'];
export type SpeedUnit = UserSettings['speedUnit'];
export type StylePreference = UserSettings['stylePreference'];