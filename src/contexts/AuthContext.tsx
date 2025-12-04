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
    checkAuth();
  }, []);

  const checkAuth = async (): Promise<void> => {
    if (authService.isAuthenticated()) {
      try {
        const response = await authService.getMe();
        setUser(response.user);
      } catch (error) {
        authService.logout();
        setUser(null);
      }
    }
    setLoading(false);
  };

  const login = async (email: string, password: string): Promise<AuthResponse> => {
    const response = await authService.login(email, password);
    setUser(response.user);
    return response;
  };

  const signup = async (userData: SignupData): Promise<AuthResponse> => {
    const response = await authService.signup(userData);
    setUser(response.user);
    return response;
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

