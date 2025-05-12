import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define types
interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  // These methods will be implemented later
  signup: (email: string, password: string, name?: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserName: (name: string) => Promise<void>;
}

// Create context with undefined initial value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // For phase 1, these functions will be placeholders
  const signup = async (email: string, password: string, name?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // Mock implementation - simulates API call
      setTimeout(() => {
        setUser({
          id: 'mock-user-id',
          email,
          name: name || 'User'
        });
        setIsLoading(false);
      }, 1000);
    } catch (err) {
      console.error("Error signing up:", err);
      setError(err instanceof Error ? err.message : "Signup failed");
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // Mock implementation - simulates API call
      setTimeout(() => {
        setUser({
          id: 'mock-user-id',
          email,
          name: 'User'
        });
        setIsLoading(false);
      }, 1000);
    } catch (err) {
      console.error("Error logging in:", err);
      setError(err instanceof Error ? err.message : "Login failed");
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Mock logout
      setTimeout(() => {
        setUser(null);
        setIsLoading(false);
      }, 500);
    } catch (err) {
      console.error("Error logging out:", err);
      setError(err instanceof Error ? err.message : "Logout failed");
      setIsLoading(false);
    }
  };

  const updateUserName = async (name: string) => {
    setError(null);
    try {
      // Mock implementation
      setUser(prev => prev ? {
        ...prev,
        name
      } : null);
    } catch (err) {
      console.error("Error updating user name:", err);
      setError(err instanceof Error ? err.message : "Failed to update user name");
    }
  };

  // Initialize with a mock user for Phase 1
  React.useEffect(() => {
    setUser({
      id: 'mock-user-id',
      email: 'user@example.com',
      name: 'Joey'
    });
    setIsLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      error, 
      signup, 
      login, 
      logout, 
      updateUserName 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};