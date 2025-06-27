import { supabase } from '@/utils/supabase';

export interface UserProfile {
  id: string;
  name: string | null;
  style_preference: 'masculine' | 'feminine' | 'neutral' | null;
  temperature_unit: 'fahrenheit' | 'celsius';
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProfileUpdateData {
  name?: string;
  style_preference?: 'masculine' | 'feminine' | 'neutral';
  temperature_unit?: 'fahrenheit' | 'celsius';
  onboarding_completed?: boolean;
}

export interface LegacySettings {
  name: string;
  email: string;
  temperatureUnit: 'Celsius' | 'Fahrenheit';
  speedUnit: 'mph' | 'kph';
  stylePreference: 'masculine' | 'feminine' | 'neutral';
}

export class ProfileService {
  /**
   * Get user's profile by ID
   */
  static async getProfile(userId: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }

    return data;
  }

  /**
   * Get current user's profile (legacy - prefer getProfile with userId)
   */
  static async getCurrentProfile(): Promise<UserProfile | null> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return null;
    }

    return this.getProfile(user.id);
  }

  /**
   * Update user's profile by ID
   */
  static async updateProfileById(userId: string, updates: ProfileUpdateData): Promise<UserProfile | null> {
    // First, try a regular update without updated_at (let DB trigger handle it)
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      // If the profile doesn't exist or column is missing, use upsert
      if (error.code === 'PGRST116' || error.message?.includes('column') || error.message?.includes('does not exist')) {
        return this.upsertProfile(userId, updates);
      }
      throw error;
    }

    return data;
  }

  /**
   * Upsert user's profile (create if doesn't exist, update if exists)
   */
  static async upsertProfile(userId: string, updates: ProfileUpdateData): Promise<UserProfile | null> {
    // Build the profile data with safe defaults
    const profileData = {
      id: userId,
      name: updates.name || null,
      style_preference: updates.style_preference || null,
      temperature_unit: updates.temperature_unit || 'fahrenheit',
      onboarding_completed: updates.onboarding_completed || false,
    };

    // Use upsert with onConflict to handle both insert and update
    const { data, error } = await supabase
      .from('profiles')
      .upsert(profileData, {
        onConflict: 'id',
        ignoreDuplicates: false
      })
      .select()
      .single();

    if (error) {
      console.error('Upsert profile error:', error);
      // If upsert fails, try a simple insert/update pattern
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (existingProfile) {
        // Profile exists, update only the fields that are provided
        const { data: updatedProfile, error: updateError } = await supabase
          .from('profiles')
          .update(updates)
          .eq('id', userId)
          .select()
          .single();
        
        if (updateError) {
          console.error('Update fallback error:', updateError);
          throw new Error('Failed to update profile');
        }
        return updatedProfile;
      } else {
        // Profile doesn't exist, create it
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert([profileData])
          .select()
          .single();
        
        if (insertError) {
          console.error('Insert fallback error:', insertError);
          throw new Error('Failed to create profile');
        }
        return newProfile;
      }
    }

    return data;
  }

  /**
   * Update current user's profile (legacy - prefer updateProfileById)
   */
  static async updateProfile(updates: ProfileUpdateData): Promise<UserProfile | null> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('No authenticated user');
    }

    return this.updateProfileById(user.id, updates);
  }

  /**
   * Complete onboarding for user
   */
  static async completeOnboardingForUser(
    userId: string,
    name: string,
    style_preference: 'masculine' | 'feminine' | 'neutral',
    temperature_unit: 'fahrenheit' | 'celsius'
  ): Promise<UserProfile | null> {
    // Use upsert directly to handle missing profiles or columns
    return this.upsertProfile(userId, {
      name,
      style_preference,
      temperature_unit,
      onboarding_completed: true,
    });
  }

  /**
   * Complete onboarding for current user (legacy)
   */
  static async completeOnboarding(
    name: string,
    style_preference: 'masculine' | 'feminine' | 'neutral',
    temperature_unit: 'fahrenheit' | 'celsius'
  ): Promise<UserProfile | null> {
    return this.updateProfile({
      name,
      style_preference,
      temperature_unit,
      onboarding_completed: true,
    });
  }

  /**
   * Check if user has completed onboarding
   */
  static async hasUserCompletedOnboarding(userId: string): Promise<boolean> {
    const profile = await this.getProfile(userId);
    return profile?.onboarding_completed ?? false;
  }

  /**
   * Check if current user has completed onboarding (legacy)
   */
  static async hasCompletedOnboarding(): Promise<boolean> {
    const profile = await this.getCurrentProfile();
    return profile?.onboarding_completed ?? false;
  }

  /**
   * Create or update profile from legacy settings
   */
  static async createOrUpdateFromLegacy(legacySettings: LegacySettings): Promise<UserProfile | null> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('No authenticated user');
    }

    // Check if profile already exists
    const existingProfile = await this.getCurrentProfile();
    
    if (existingProfile) {
      // Profile exists, only update if it's missing key data
      if (!existingProfile.name || !existingProfile.style_preference) {
        return this.updateProfile({
          name: existingProfile.name || legacySettings.name,
          style_preference: existingProfile.style_preference || legacySettings.stylePreference,
          temperature_unit: existingProfile.temperature_unit || 
            (legacySettings.temperatureUnit.toLowerCase() as 'fahrenheit' | 'celsius'),
          onboarding_completed: true,
        });
      }
      return existingProfile;
    }

    // No profile exists, create one from legacy settings
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        name: legacySettings.name,
        style_preference: legacySettings.stylePreference,
        temperature_unit: legacySettings.temperatureUnit.toLowerCase() as 'fahrenheit' | 'celsius',
        onboarding_completed: true,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating profile from legacy:', error);
      return null;
    }

    return data;
  }

  /**
   * Check if profile exists for current user
   */
  static async profileExists(): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return false;
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .single();

    return !!data && !error;
  }
}