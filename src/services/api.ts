import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { getErrorMessage } from '../utils/apiResponse';

let API_URL: string = import.meta.env.VITE_API_URL as string;

if (API_URL && API_URL.trim() !== '') {
  if (!API_URL.endsWith('/api')) {
    API_URL = API_URL.endsWith('/') ? `${API_URL}api` : `${API_URL}/api`;
  }
} else {
  API_URL = import.meta.env.DEV 
    ? '/api'
    : 'http://localhost:5000/api';
}

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: any) => {
    const publicEndpoints = ['/auth/login', '/auth/signup', '/auth/refresh', '/auth/forgot', '/auth/reset-password'];
    const isPublicEndpoint = error.config?.url && publicEndpoints.some(endpoint => error.config.url.includes(endpoint));
    const isOnLoginPage = window.location.pathname === '/login' || window.location.pathname === '/signup';

    if (error.response?.status === 401 && !isPublicEndpoint && !isOnLoginPage) {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_URL}/auth/refresh`, {
            refreshToken,
          });
          const responseData = response.data.data || response.data;
          const { token, refreshToken: newRefreshToken } = responseData;
          localStorage.setItem('token', token);
          localStorage.setItem('refreshToken', newRefreshToken);
          
          if (error.config) {
            error.config.headers.Authorization = `Bearer ${token}`;
            return api.request(error.config);
          }
        } catch (refreshError) {
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          if (!isOnLoginPage) {
            window.location.href = '/login';
          }
        }
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        if (!isOnLoginPage) {
          window.location.href = '/login';
        }
      }
    }
    
    if (error.response?.status === 403) {
      const errorData = error.response?.data;
      const errorMessage = errorData?.message || errorData?.data?.message || 'Access denied. You do not have permission to access this resource.';
      
      if (window.location.pathname.startsWith('/admin')) {
        if (errorData?.code === 'INVALID_TOKEN' || errorData?.code === 'AUTH_REQUIRED') {
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
        } else {
          window.location.href = '/dashboard';
        }
      }
    }

    if (error.response?.status === 429) {
      const errorData = error.response?.data;
      const errorMessage = errorData?.message || 'Too many requests. Please wait a moment and try again.';
      
      error.isRateLimit = true;
      error.userMessage = errorMessage;
    }

    error.userMessage = getErrorMessage(error);

    return Promise.reject(error);
  }
);

export default api;

