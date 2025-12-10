import { useState, useEffect, useRef } from 'react';
import { adminService } from '../../services/adminService';
import { usePagination } from './usePagination';
import { AdminTab } from './types';
import toast from 'react-hot-toast';

export const useAdminDonations = (activeTab: AdminTab) => {
  const [allDonations, setAllDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { pagination, handlePageChange, handleLimitChange, resetPage, updatePagination } = usePagination(10);
  const loadingRef = useRef(false);

  const loadAllDonations = async () => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    try {
      setLoading(true);
      const response = await adminService.getAllDonations({
        page: pagination.page,
        limit: pagination.limit,
      });
      setAllDonations(response.donations || []);
      if (response.pagination) {
        updatePagination(response.pagination);
      } else if (response.total !== undefined) {
        updatePagination({
          total: response.total,
          pages: Math.ceil(response.total / pagination.limit),
        });
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to load donations';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  };

  useEffect(() => {
    if (activeTab === 'all-donations') {
      loadAllDonations();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page, pagination.limit, activeTab]);

  useEffect(() => {
    if (activeTab === 'all-donations') {
      resetPage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  return {
    allDonations,
    loading,
    pagination,
    handlePageChange,
    handleLimitChange,
    loadAllDonations,
  };
};

