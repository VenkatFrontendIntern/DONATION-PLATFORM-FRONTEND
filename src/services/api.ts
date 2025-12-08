import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { getErrorMessage } from '../utils/apiResponse';

// Strictly prioritize VITE_API_URL environment variable
// Only fallback to localhost if the env var is undefined
let API_URL: string;

if (import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL.trim() !== '') {
  API_URL = import.meta.env.VITE_API_URL.trim();
  if (!API_URL.endsWith('/api')) {
    API_URL = API_URL.endsWith('/') ? `${API_URL}api` : `${API_URL}/api`;
  }
} else {
  // Only use localhost fallback if VITE_API_URL is not set
  API_URL = import.meta.env.DEV 
    ? '/api'
    : 'http://localhost:5000/api';
}

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable sending cookies (for refreshToken httpOnly cookie)
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Mark admin donation-trends requests to suppress errors
    if (config.url?.includes('/admin/donation-trends')) {
      (config as any).__suppressErrors = true;
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
    const publicEndpoints = ['/auth/login', '/auth/signup', '/auth/refresh', '/auth/forgot', '/auth/reset-password', '/newsletter/subscribe'];
    const isPublicEndpoint = error.config?.url && publicEndpoints.some(endpoint => error.config.url.includes(endpoint));
    const isOnLoginPage = window.location.pathname === '/login' || window.location.pathname === '/signup';

    if (error.response?.status === 401 && !isPublicEndpoint && !isOnLoginPage) {
      // refreshToken is now in httpOnly cookie, so we just call the refresh endpoint
      try {
        const response = await api.post(`${API_URL}/auth/refresh`);
        const responseData = response.data.data || response.data;
        const { token } = responseData;
        localStorage.setItem('token', token);
        // refreshToken cookie is automatically updated by server
        
        if (error.config) {
          error.config.headers.Authorization = `Bearer ${token}`;
          return api.request(error.config);
        }
      } catch (refreshError) {
        localStorage.removeItem('token');
        // refreshToken cookie will be cleared by server on invalid token
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
          // refreshToken cookie is handled by server
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

    // Silently handle errors for admin donation-trends endpoint
    const isDonationTrendsRequest = error.config?.url?.includes('/admin/donation-trends') || 
                                     error.config?.__suppressErrors;
    
    if (isDonationTrendsRequest) {
      // Mark as silent to prevent all logging
      (error as any).isSilent = true;
      (error as any).userMessage = '';
      (error as any).__suppressed = true;
      // Still reject but mark as handled
      return Promise.reject(error);
    }

    // Silently handle 404 errors for other admin endpoints
    if (error.response?.status === 404 && error.config?.url?.includes('/admin/')) {
      (error as any).isSilent = true;
      (error as any).userMessage = '';
      return Promise.reject(error);
    }

    // Suppress network errors for admin endpoints
    if (
      (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) &&
      error.config?.url?.includes('/admin/')
    ) {
      (error as any).isSilent = true;
      (error as any).userMessage = '';
      return Promise.reject(error);
    }

    error.userMessage = getErrorMessage(error);

    return Promise.reject(error);
  }
);

export default api;

