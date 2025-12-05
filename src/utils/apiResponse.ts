/**
 * Standard API Response Structure
 * 
 * Success Response:
 * {
 *   status: 'success',
 *   message: string,
 *   data: any
 * }
 * 
 * Error Response:
 * {
 *   status: 'error',
 *   message: string,
 *   data: null
 * }
 * 
 * Paginated Response:
 * {
 *   status: 'success',
 *   message: string,
 *   data: {
 *     items: any[],
 *     pagination: {
 *       page: number,
 *       limit: number,
 *       total: number,
 *       pages: number
 *     }
 *   }
 * }
 */

export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  message: string;
  data: T | null;
}

export interface PaginatedResponse<T = any> {
  status: 'success';
  message: string;
  data: {
    items: T[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

/**
 * Extract data from standardized API response
 */
export const extractData = <T>(response: ApiResponse<T>): T => {
  if (response.status === 'error') {
    throw new Error(response.message);
  }
  return response.data as T;
};

/**
 * Extract paginated data from standardized API response
 */
export const extractPaginatedData = <T>(response: PaginatedResponse<T>) => {
  if (response.status === 'error') {
    throw new Error(response.message);
  }
  return {
    items: response.data.items,
    pagination: response.data.pagination,
  };
};

/**
 * Extract user-friendly error message from axios error
 * Handles various error types: network errors, validation errors, server errors
 */
export const getErrorMessage = (error: any): string => {
  // Check if it's an axios error with response
  if (error.response) {
    const errorData = error.response.data;
    
    // Handle standardized API response format
    if (errorData?.status === 'error' && errorData?.message) {
      return errorData.message;
    }
    
    // Handle direct message in response
    if (errorData?.message) {
      return errorData.message;
    }
    
    // Handle validation errors (array of messages)
    if (Array.isArray(errorData?.errors)) {
      return errorData.errors.map((e: any) => e.message || e).join(', ');
    }
    
    // Handle HTTP status code specific messages
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
  
  // Network error (no response received)
  if (error.request) {
    return 'Network error. Please check your internet connection and try again.';
  }
  
  // Error in request setup
  if (error.message) {
    return error.message;
  }
  
  // Default fallback
  return 'An unexpected error occurred. Please try again.';
};

