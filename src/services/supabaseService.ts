import { createClient, AuthError, User, Session } from '@supabase/supabase-js';

// Get environment variables (they're exposed via app.config.js extra)
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.');
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface AuthResult {
  user: User | null;
  session: Session | null;
}

export interface SignUpData {
  email: string;
  password: string;
  name?: string;
}

export interface SignInData {
  email: string;
  password: string;
}

/**
 * Supabase authentication service
 * Handles all authentication operations following the same pattern as TripsQueryService
 */
export class SupabaseAuthService {
  /**
   * Get the current authenticated user session
   */
  static async getCurrentSession(): Promise<AuthResult> {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        throw new AuthError(error.message);
      }

      return {
        user: session?.user || null,
        session: session,
      };
    } catch (error) {
      // Return null user/session on error - let UI handle error states
      return {
        user: null,
        session: null,
      };
    }
  }

  /**
   * Sign in with email and password
   */
  static async signIn({ email, password }: SignInData): Promise<AuthResult> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new AuthError(error.message);
    }

    return {
      user: data.user,
      session: data.session,
    };
  }

  /**
   * Sign up with email and password
   */
  static async signUp({ email, password, name }: SignUpData): Promise<AuthResult> {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name || '',
        },
      },
    });

    if (error) {
      throw new AuthError(error.message);
    }

    return {
      user: data.user,
      session: data.session,
    };
  }

  /**
   * Sign out the current user
   */
  static async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      throw new AuthError(error.message);
    }
  }

  /**
   * Update user password
   */
  static async updatePassword(newPassword: string): Promise<AuthResult> {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      throw new AuthError(error.message);
    }

    return {
      user: data.user,
      session: null, // Session doesn't change when updating password
    };
  }

  /**
   * Send password reset email
   */
  static async resetPassword(email: string): Promise<void> {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    
    if (error) {
      throw new AuthError(error.message);
    }
  }

  /**
   * Update user profile information
   */
  static async updateProfile(updates: { name?: string; email?: string }): Promise<AuthResult> {
    const { data, error } = await supabase.auth.updateUser({
      email: updates.email,
      data: {
        name: updates.name,
      },
    });

    if (error) {
      throw new AuthError(error.message);
    }

    return {
      user: data.user,
      session: null, // Session doesn't change when updating profile
    };
  }

  /**
   * Sign in with Apple using ID token
   */
  static async signInWithApple(idToken: string, nonce?: string): Promise<AuthResult> {
    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: 'apple',
      token: idToken,
      nonce,
    });

    if (error) {
      throw new AuthError(error.message);
    }

    return {
      user: data.user,
      session: data.session,
    };
  }

  /**
   * Listen to auth state changes
   * Returns unsubscribe function
   */
  static onAuthStateChange(callback: (user: User | null, session: Session | null) => void) {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      callback(session?.user || null, session);
    });

    return () => subscription.unsubscribe();
  }
}