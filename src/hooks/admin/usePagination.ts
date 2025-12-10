import { useState, useCallback } from 'react';
import { Pagination } from './types';

export const usePagination = (initialLimit: number = 10) => {
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: initialLimit,
    total: 0,
    pages: 0,
  });

  const handlePageChange = useCallback((newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      setPagination(prev => ({ ...prev, page: newPage }));
    }
  }, [pagination.pages]);

  const handleLimitChange = useCallback((newLimit: number) => {
    setPagination(prev => ({ ...prev, limit: newLimit, page: 1 }));
  }, []);

  const resetPage = useCallback(() => {
    setPagination(prev => ({ ...prev, page: 1 }));
  }, []);

  const updatePagination = useCallback((updates: Partial<Pagination>) => {
    setPagination(prev => ({ ...prev, ...updates }));
  }, []);

  return {
    pagination,
    setPagination,
    handlePageChange,
    handleLimitChange,
    resetPage,
    updatePagination,
  };
};

