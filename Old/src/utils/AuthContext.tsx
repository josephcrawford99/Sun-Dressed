import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../services/supabase';
import { Platform } from 'react-native';

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  signup: (email: string, password: string, name?: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserName: (name: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data.session && data.session.user) {
          setUser({
            id: data.session.user.id,
            email: data.session.user.email || '',
            name: data.session.user.user_metadata?.name || '',
          });
        }
      } catch (err) {
        console.error("Error initializing auth:", err);
        setError(err instanceof Error ? err.message : "Authentication error");
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    try {
      const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session && session.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.name || '',
          });
        } else {
          setUser(null);
        }
      });

      return () => {
        if (listener && listener.subscription) {
          listener.subscription.unsubscribe();
        }
      };
    } catch (err) {
      console.error("Error setting up auth listener:", err);
      setError(err instanceof Error ? err.message : "Authentication listener error");
      setIsLoading(false);
    }
  }, []);

  const updateUserName = async (name: string) => {
    setError(null);
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: { name }
      });
      if (error) {
        setError(error.message);
        throw error;
      }
      if (data.user) {
        setUser(prev => prev ? {
          ...prev,
          name
        } : null);
      }
    } catch (err) {
      console.error("Error updating user name:", err);
      setError(err instanceof Error ? err.message : "Failed to update user name");
      throw err;
    }
  };

  const signup = async (email: string, password: string, name?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } },
      });
      if (error) {
        setError(error.message);
        return;
      }
      if (data.user) {
        setUser({
          id: data.user.id,
          email: data.user.email || '',
          name: name || '',
        });
      }
    } catch (err) {
      console.error("Error signing up:", err);
      setError(err instanceof Error ? err.message : "Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
        return;
      }
      if (data.user) {
        setUser({
          id: data.user.id,
          email: data.user.email || '',
          name: data.user.user_metadata?.name || '',
        });
      }
    } catch (err) {
      console.error("Error logging in:", err);
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (err) {
      console.error("Error logging out:", err);
      setError(err instanceof Error ? err.message : "Logout failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, error, signup, login, logout, updateUserName }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
