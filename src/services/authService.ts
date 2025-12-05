import api from './api';
import { AuthResponse, User } from '../types';
import { ApiResponse, extractData } from '../utils/apiResponse';

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
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/signup', userData);
    const data = extractData(response.data);
    if (data.token) {
      localStorage.setItem('token', data.token);
      if (data.refreshToken) {
        localStorage.setItem('refreshToken', data.refreshToken);
      }
    }
    return data;
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', { email, password });
    const data = extractData(response.data);
    if (data.token) {
      localStorage.setItem('token', data.token);
      if (data.refreshToken) {
        localStorage.setItem('refreshToken', data.refreshToken);
      }
    }
    return data;
  },

  logout: (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  },

  getMe: async (): Promise<GetMeResponse> => {
    const response = await api.get<ApiResponse<GetMeResponse>>('/auth/me');
    return extractData(response.data);
  },

  forgotPassword: async (email: string): Promise<{ message: string }> => {
    const response = await api.post<ApiResponse<{ message: string }>>('/auth/forgot', { email });
    return extractData(response.data);
  },

  resetPassword: async (token: string, password: string): Promise<{ message: string }> => {
    const response = await api.post<ApiResponse<{ message: string }>>('/auth/reset-password', { token, password });
    return extractData(response.data);
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },

  getToken: (): string | null => {
    return localStorage.getItem('token');
  },
};

