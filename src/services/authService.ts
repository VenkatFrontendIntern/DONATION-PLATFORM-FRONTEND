import api from './api';
import { AuthResponse, User } from '../types';

interface SignupData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  pan?: string;
}

interface GetMeResponse {
  user: User;
}

export const authService = {
  signup: async (userData: SignupData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/signup', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      if (response.data.refreshToken) {
        localStorage.setItem('refreshToken', response.data.refreshToken);
      }
    }
    return response.data;
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      if (response.data.refreshToken) {
        localStorage.setItem('refreshToken', response.data.refreshToken);
      }
    }
    return response.data;
  },

  logout: (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  },

  getMe: async (): Promise<GetMeResponse> => {
    const response = await api.get<GetMeResponse>('/auth/me');
    return response.data;
  },

  forgotPassword: async (email: string): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>('/auth/forgot', { email });
    return response.data;
  },

  resetPassword: async (token: string, password: string): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>('/auth/reset-password', { token, password });
    return response.data;
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },

  getToken: (): string | null => {
    return localStorage.getItem('token');
  },
};

