import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { getErrorMessage } from '../utils/apiResponse';

// Use relative URL in development (via Vite proxy) or full URL in production
// Always ensure /api is included in the baseURL
let API_URL: string = import.meta.env.VITE_API_URL as string;

// If VITE_API_URL is explicitly set, use it (even in dev mode)
if (API_URL && API_URL.trim() !== '') {
  // If VITE_API_URL is set, ensure it ends with /api
  if (!API_URL.endsWith('/api')) {
    API_URL = API_URL.endsWith('/') ? `${API_URL}api` : `${API_URL}/api`;
  }
} else {
  // If VITE_API_URL is NOT set (commented or empty), use localhost
  // In dev mode: use proxy (/api -> localhost:5000)
  // In production: use localhost directly (for local testing)
  API_URL = import.meta.env.DEV 
    ? '/api'  // Proxy to localhost:5000
    : 'http://localhost:5000/api';  // Direct localhost for production builds
}


// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token
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

// Response interceptor - Handle errors
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: any) => {

    // Skip token refresh for public endpoints and if already on login page
    const publicEndpoints = ['/auth/login', '/auth/signup', '/auth/refresh', '/auth/forgot', '/auth/reset-password'];
    const isPublicEndpoint = error.config?.url && publicEndpoints.some(endpoint => error.config.url.includes(endpoint));
    const isOnLoginPage = window.location.pathname === '/login' || window.location.pathname === '/signup';

    if (error.response?.status === 401 && !isPublicEndpoint && !isOnLoginPage) {
      // Token expired, try to refresh
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_URL}/auth/refresh`, {
            refreshToken,
          });
          // Handle new standardized response format
          const responseData = response.data.data || response.data;
          const { token, refreshToken: newRefreshToken } = responseData;
          localStorage.setItem('token', token);
          localStorage.setItem('refreshToken', newRefreshToken);
          
          // Retry original request
          if (error.config) {
            error.config.headers.Authorization = `Bearer ${token}`;
            return api.request(error.config);
          }
        } catch (refreshError) {
          // Refresh failed, logout user (but don't redirect if already on login page)
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          if (!isOnLoginPage) {
            window.location.href = '/login';
          }
        }
      } else {
        // No refresh token, clear auth (but don't redirect if already on login page)
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        if (!isOnLoginPage) {
          window.location.href = '/login';
        }
      }
    }
    
    if (error.response?.status === 403) {
      // Access denied - insufficient permissions
      const errorData = error.response?.data;
      // Handle new standardized response format
      const errorMessage = errorData?.message || errorData?.data?.message || 'Access denied. You do not have permission to access this resource.';
      
      // If user is on an admin page but doesn't have admin role, redirect to dashboard
      if (window.location.pathname.startsWith('/admin')) {
        // Clear auth if token is invalid
        if (errorData?.code === 'INVALID_TOKEN' || errorData?.code === 'AUTH_REQUIRED') {
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
        } else {
          // User is authenticated but not admin - redirect to user dashboard
          window.location.href = '/dashboard';
        }
      }
    }

    // Handle rate limit errors (429) gracefully
    if (error.response?.status === 429) {
      const errorData = error.response?.data;
      const errorMessage = errorData?.message || 'Too many requests. Please wait a moment and try again.';
      
      // For rate limit errors, we'll let the component handle it gracefully
      // by returning a structured error that won't break the UI
      error.isRateLimit = true;
      error.userMessage = errorMessage;
    }

    // Attach user-friendly error message to error object for easy access
    error.userMessage = getErrorMessage(error);

    return Promise.reject(error);
  }
);

export default api;

