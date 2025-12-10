import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/authService';
import { User, AuthResponse } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthResponse>;
  signup: (userData: SignupData) => Promise<AuthResponse>;
  logout: () => void;
  isAuthenticated: boolean;
}

interface SignupData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  pan?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    let timeoutId: NodeJS.Timeout;

    const checkAuth = async (): Promise<void> => {
      if (authService.isAuthenticated()) {
        try {
          const response = await authService.getMe();
          if (isMounted) {
            setUser(response.user);
          }
        } catch (error: any) {
          // Handle different error scenarios gracefully
          const status = error.response?.status;
          const isNetworkError = error.code === 'ERR_NETWORK' || !error.response;
          const isServerError = status >= 500;
          const isServiceUnavailable = status === 503;
          
          // Only logout on clear authentication failures (401/403), not on:
          // - Network errors (might be temporary)
          // - Server errors (500+) which might be DB connection issues
          // - Service unavailable (503) which might be DB connection issues
          if ((status === 401 || status === 403) && !isNetworkError && !isServerError && !isServiceUnavailable) {
            // Clear authentication error - token is invalid
            if (isMounted) {
              authService.logout();
              setUser(null);
            }
          } else {
            // For network/server errors, keep the token but don't set user
            // This allows retry on next page load or refresh
            // The user can still use the app, just not authenticated
            if (isMounted) {
              setUser(null);
            }
          }
        }
      }
      if (isMounted) {
        setLoading(false);
      }
    };

    // Set a timeout to prevent infinite loading
    timeoutId = setTimeout(() => {
      if (isMounted) {
        setLoading(false);
      }
    }, 10000); // 10 second max loading time

    checkAuth();

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, []);

  const login = async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const response = await authService.login(email, password);
      setUser(response.user);
      return response;
    } catch (error: any) {
      // Re-throw error so Login component can handle it
      throw error;
    }
  };

  const signup = async (userData: SignupData): Promise<AuthResponse> => {
    try {
      const response = await authService.signup(userData);
      setUser(response.user);
      return response;
    } catch (error: any) {
      // Re-throw error so Signup component can handle it
      throw error;
    }
  };

  const logout = (): void => {
    authService.logout();
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

