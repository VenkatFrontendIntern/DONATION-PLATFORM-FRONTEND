export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  message: string;
  data: T | null;
}

export interface PaginatedResponse<T = any> {
  status: 'success' | 'error';
  message: string;
  data: {
    items: T[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  } | null;
}

export const extractData = <T>(response: ApiResponse<T>): T => {
  if (response.status === 'error') {
    throw new Error(response.message);
  }
  return response.data as T;
};

export const extractPaginatedData = <T>(response: PaginatedResponse<T>) => {
  if (response.status === 'error') {
    throw new Error(response.message);
  }
  if (!response.data) {
    throw new Error('No data available');
  }
  return {
    items: response.data.items,
    pagination: response.data.pagination,
  };
};

export const getErrorMessage = (error: any): string => {
  if (error.response) {
    const errorData = error.response.data;
    
    if (errorData?.status === 'error' && errorData?.message) {
      return errorData.message;
    }
    
    if (errorData?.message) {
      return errorData.message;
    }
    
    if (Array.isArray(errorData?.errors)) {
      return errorData.errors.map((e: any) => e.message || e).join(', ');
    }
    
    const status = error.response.status;
    switch (status) {
      case 400:
        return 'Invalid request. Please check your input and try again.';
      case 401:
        return 'Authentication required. Please login to continue.';
      case 403:
        return 'You do not have permission to perform this action.';
      case 404:
        return 'The requested resource was not found.';
      case 409:
        return 'This record already exists. Please use a different value.';
      case 422:
        return 'Validation failed. Please check your input.';
      case 429:
        return 'Too many requests. Please wait a moment and try again.';
      case 500:
        return 'Server error. Please try again later.';
      case 503:
        return 'Service temporarily unavailable. Please try again later.';
      default:
        return `Request failed with status ${status}. Please try again.`;
    }
  }
  
  if (error.request) {
    return 'Network error. Please check your internet connection and try again.';
  }
  
  if (error.message) {
    return error.message;
  }
  
  return 'An unexpected error occurred. Please try again.';
};

