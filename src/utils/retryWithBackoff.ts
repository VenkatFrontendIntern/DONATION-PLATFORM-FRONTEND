export const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> => {
  let lastError: any;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      
      if (error.response?.status >= 400 && error.response?.status < 500) {
        throw error;
      }
      
      const isNetworkError = 
        !error.response ||
        error.code === 'ECONNABORTED' ||
        error.code === 'ETIMEDOUT' ||
        error.message?.includes('Network Error') ||
        error.message?.includes('timeout') ||
        error.message?.includes('network');
      
      if (!isNetworkError && attempt < maxRetries - 1) {
        throw error;
      }
      
      if (attempt < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
};

export const isNetworkError = (error: any): boolean => {
  return (
    !error.response ||
    error.code === 'ECONNABORTED' ||
    error.message?.includes('Network Error')
  );
};

