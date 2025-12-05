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

