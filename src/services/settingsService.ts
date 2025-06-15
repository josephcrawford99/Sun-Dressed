import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserSettings, DEFAULT_SETTINGS } from '@/types/settings';

const SETTINGS_KEY = '@sun_dressed_settings';

export class SettingsService {
  static async loadSettings(): Promise<UserSettings> {
    try {
      const storedSettings = await AsyncStorage.getItem(SETTINGS_KEY);
      if (storedSettings) {
        const parsed = JSON.parse(storedSettings);
        // Merge with defaults to ensure all properties exist
        return { ...DEFAULT_SETTINGS, ...parsed };
      }
      return DEFAULT_SETTINGS;
    } catch (error) {
      // Failed to load settings
      return DEFAULT_SETTINGS;
    }
  }

  static async saveSettings(settings: UserSettings): Promise<void> {
    try {
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      // Failed to save settings
      throw error;
    }
  }

  static async updateSetting<K extends keyof UserSettings>(
    key: K,
    value: UserSettings[K]
  ): Promise<void> {
    try {
      const currentSettings = await this.loadSettings();
      const updatedSettings = { ...currentSettings, [key]: value };
      await this.saveSettings(updatedSettings);
    } catch (error) {
      // Failed to update setting
      throw error;
    }
  }

  static async resetSettings(): Promise<void> {
    try {
      await AsyncStorage.removeItem(SETTINGS_KEY);
    } catch (error) {
      // Failed to reset settings
      throw error;
    }
  }
}