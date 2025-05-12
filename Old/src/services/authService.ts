import AsyncStorage from '@react-native-async-storage/async-storage';

// Check if AuthContext is available in the project
let authContext = null;
try {
  // We try to import dynamically, but this is just to check if it exists
  authContext = require('../utils/AuthContext');
} catch (e) {
  console.log('AuthContext not available, using AsyncStorage only for auth');
}

/**
 * Sign in a user with email and password
 * For development purposes, this just simulates a successful login
 */
export const signIn = async (email: string, password: string) => {
  try {
    // In a real app, we would validate credentials with an API
    // For dev purposes, we just simulate successful login
    const userData = {
      email,
      isAuthenticated: true,
      lastLogin: new Date().toISOString()
    };

    await AsyncStorage.setItem('@auth_data', JSON.stringify(userData));

    // If using AuthContext, update the context
    if (authContext && authContext.useAuth) {
      try {
        const { setUser } = authContext.useAuth();
        if (setUser && typeof setUser === 'function') {
          setUser(userData);
        }
      } catch (contextError) {
        // AuthContext might be available but not properly initialized
        console.log('Error updating AuthContext:', contextError);
      }
    }

    console.log(`Dev login successful for ${email}`);
    return userData;
  } catch (error) {
    console.error('Sign in error:', error);
    throw new Error('Failed to sign in. Please try again.');
  }
};

/**
 * Sign out the current user
 */
export const signOut = async () => {
  try {
    await AsyncStorage.removeItem('@auth_data');

    // If using AuthContext, update the context
    if (authContext && authContext.useAuth) {
      try {
        const { setUser } = authContext.useAuth();
        if (setUser && typeof setUser === 'function') {
          setUser(null);
        }
      } catch (contextError) {
        console.log('Error updating AuthContext:', contextError);
      }
    }

    console.log('User logged out successfully');
  } catch (error) {
    console.error('Sign out error:', error);
    throw new Error('Failed to sign out. Please try again.');
  }
};

/**
 * Check if a user is currently signed in
 */
export const isSignedIn = async (): Promise<boolean> => {
  try {
    const userData = await AsyncStorage.getItem('@auth_data');
    return userData !== null;
  } catch (error) {
    console.error('Auth check error:', error);
    return false;
  }
};

/**
 * Get the current user data
 */
export const getCurrentUser = async () => {
  try {
    const userData = await AsyncStorage.getItem('@auth_data');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Get user error:', error);
    return null;
  }
};
