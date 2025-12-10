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
  timeout: 30000, // 30 seconds timeout
  validateStatus: (status) => status < 500, // Don't throw for 4xx errors
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
    // Handle request cancellation (component unmounted)
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }

    // Handle timeout errors
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      error.userMessage = 'Request timeout. Please check your connection and try again.';
      return Promise.reject(error);
    }

    const publicEndpoints = ['/auth/login', '/auth/signup', '/auth/refresh', '/auth/forgot', '/auth/reset-password', '/newsletter/subscribe'];
    const isPublicEndpoint = error.config?.url && publicEndpoints.some(endpoint => error.config.url.includes(endpoint));
    const isOnLoginPage = window.location.pathname === '/login' || window.location.pathname === '/signup';
    
    // Special handling for /auth/me endpoint - might fail due to DB connection issues on initial load
    const isAuthMeEndpoint = error.config?.url?.includes('/auth/me');
    const isStatsEndpoint = error.config?.url?.includes('/stats');
    
    // For /auth/me and /stats endpoints, handle 500/503 errors gracefully (likely DB connection issues)
    if ((isAuthMeEndpoint || isStatsEndpoint) && (error.response?.status === 500 || error.response?.status === 503)) {
      // Mark as silent error - these are likely temporary DB connection issues
      (error as any).isSilent = true;
      (error as any).isTemporaryError = true;
      (error as any).userMessage = '';
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !isPublicEndpoint && !isOnLoginPage) {
      // Prevent infinite refresh loops
      if (error.config?.url?.includes('/auth/refresh')) {
        localStorage.removeItem('token');
        if (!isOnLoginPage) {
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }

      // For /auth/me endpoint, don't try to refresh if it's a server error (likely DB issue)
      // Just let it fail silently and let the AuthContext handle it
      if (isAuthMeEndpoint && (error.response?.status === 500 || error.response?.status === 503)) {
        (error as any).isSilent = true;
        (error as any).isTemporaryError = true;
        return Promise.reject(error);
      }

      // refreshToken is now in httpOnly cookie, so we just call the refresh endpoint
      try {
        const response = await api.post('/auth/refresh', {}, {
          timeout: 10000, // Shorter timeout for refresh
        });
        const responseData = response.data.data || response.data;
        const { token } = responseData;
        if (token) {
          localStorage.setItem('token', token);
          // refreshToken cookie is automatically updated by server
          
          if (error.config && !error.config._retry) {
            error.config._retry = true; // Prevent infinite retry loops
            error.config.headers.Authorization = `Bearer ${token}`;
            return api.request(error.config);
          }
        }
      } catch (refreshError: any) {
        localStorage.removeItem('token');
        // refreshToken cookie will be cleared by server on invalid token
        if (!isOnLoginPage && !refreshError.config?.url?.includes('/auth/refresh')) {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
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

    // Handle network errors
    if (error.code === 'ERR_NETWORK' || !error.response) {
      error.userMessage = 'Network error. Please check your internet connection and try again.';
      error.isNetworkError = true;
      return Promise.reject(error);
    }

    // Handle 503 Service Unavailable
    if (error.response?.status === 503) {
      error.userMessage = 'Service temporarily unavailable. Please try again in a moment.';
      return Promise.reject(error);
    }

    error.userMessage = getErrorMessage(error);

    return Promise.reject(error);
  }
);

// Export cancel token source creator for request cancellation
export const createCancelToken = () => axios.CancelToken.source();

export default api;

