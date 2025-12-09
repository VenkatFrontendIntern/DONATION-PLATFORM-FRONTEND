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
          // Only logout if it's an authentication error (401/403), not network errors
          if (error.response?.status === 401 || error.response?.status === 403) {
            if (isMounted) {
              authService.logout();
              setUser(null);
            }
          } else {
            // For network errors, keep the token but don't set user
            // This allows retry on next page load
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

