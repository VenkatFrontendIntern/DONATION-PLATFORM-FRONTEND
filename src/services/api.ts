import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

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

// Debug log to see which API URL is being used
if (import.meta.env.DEV) {
  console.log('🔧 API Base URL:', API_URL);
  console.log('🔧 VITE_API_URL from env:', import.meta.env.VITE_API_URL || '(not set - using localhost)');
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
    // Log API requests in development
    if (import.meta.env.DEV) {
      const fullUrl = config.baseURL && config.url 
        ? `${config.baseURL}${config.url.startsWith('/') ? '' : '/'}${config.url}`
        : config.url;
      console.log(`🌐 API Request: ${config.method?.toUpperCase()} ${fullUrl}`, {
        baseURL: config.baseURL,
        url: config.url,
        params: config.params,
        data: config.data,
      });
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
    // Log successful API responses in development
    if (import.meta.env.DEV) {
      console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        data: response.data,
      });
    }
    return response;
  },
  async (error: any) => {
    // Log API errors in development
    if (import.meta.env.DEV) {
      console.error(`❌ API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
        status: error.response?.status,
        message: error.message,
        responseData: error.response?.data,
      });
    }
    if (error.response?.status === 401) {
      // Token expired, try to refresh
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_URL}/auth/refresh`, {
            refreshToken,
          });
          const { token, refreshToken: newRefreshToken } = response.data;
          localStorage.setItem('token', token);
          localStorage.setItem('refreshToken', newRefreshToken);
          
          // Retry original request
          if (error.config) {
            error.config.headers.Authorization = `Bearer ${token}`;
            return api.request(error.config);
          }
        } catch (refreshError) {
          // Refresh failed, logout user
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
        }
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

