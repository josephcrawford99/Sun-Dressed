import { useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthQuery } from './queries/useAuthQuery';
import { ProfileService } from '@/services/profileService';
import { UserSettings } from '@/types/settings';
import { useQueryClient } from '@tanstack/react-query';

const SETTINGS_KEY = '@sun_dressed_settings';
const MIGRATION_COMPLETE_KEY = '@sun_dressed_migration_v1';

/**
 * Hook to handle one-time migration of legacy settings to Supabase profile
 * This runs once per user and then marks migration as complete
 */
export function useLegacyMigration() {
  const { data: authData } = useAuthQuery();
  const queryClient = useQueryClient();
  const migrationAttempted = useRef(false);

  useEffect(() => {
    // Only run if authenticated and haven't attempted migration yet
    if (!authData?.user || migrationAttempted.current) return;

    const migrateLegacySettings = async () => {
      try {
        // Check if migration already completed for this user
        const migrationKey = `${MIGRATION_COMPLETE_KEY}_${authData.user!.id}`;
        const migrationComplete = await AsyncStorage.getItem(migrationKey);
        
        if (migrationComplete === 'true') {
          return; // Migration already done
        }

        // Check if profile already exists
        const profileExists = await ProfileService.profileExists();
        if (profileExists) {
          // Mark migration as complete since profile exists
          await AsyncStorage.setItem(migrationKey, 'true');
          return;
        }

        // Try to load legacy settings
        const legacySettingsStr = await AsyncStorage.getItem(SETTINGS_KEY);
        if (!legacySettingsStr) {
          // No legacy settings, mark as complete
          await AsyncStorage.setItem(migrationKey, 'true');
          return;
        }

        const legacySettings = JSON.parse(legacySettingsStr) as UserSettings;
        
        // Only migrate if we have meaningful data
        if (legacySettings.name && legacySettings.stylePreference) {
          await ProfileService.createOrUpdateFromLegacy({
            name: legacySettings.name,
            email: legacySettings.email || authData.user!.email || '',
            temperatureUnit: legacySettings.temperatureUnit,
            speedUnit: legacySettings.speedUnit,
            stylePreference: legacySettings.stylePreference,
          });

          // Invalidate queries to refetch with new data
          queryClient.invalidateQueries({ queryKey: ['settings'] });
          queryClient.invalidateQueries({ queryKey: ['profile'] });
        }

        // Mark migration as complete for this user
        await AsyncStorage.setItem(migrationKey, 'true');
        
        // Optionally, clean up old settings key
        // await AsyncStorage.removeItem(SETTINGS_KEY);
        
      } catch (error) {
        console.error('Failed to migrate legacy settings:', error);
        // Don't throw - we don't want to break the app if migration fails
      }
    };

    migrationAttempted.current = true;
    migrateLegacySettings();
  }, [authData?.user, queryClient]);
}