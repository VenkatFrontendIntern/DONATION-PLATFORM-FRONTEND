import { useState, useEffect, useRef } from 'react';
import { adminService } from '../../services/adminService';
import { usePagination } from './usePagination';
import { AdminTab } from './types';
import toast from 'react-hot-toast';

export const useAdminCampaigns = (activeTab: AdminTab) => {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { pagination, handlePageChange, handleLimitChange, resetPage, updatePagination } = usePagination(10);
  const loadingRef = useRef(false);

  const loadCampaigns = async () => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    try {
      setLoading(true);
      const response = await adminService.getPendingCampaigns(activeTab, pagination.page, pagination.limit);
      setCampaigns(response.campaigns || []);
      if (response.pagination) {
        updatePagination(response.pagination);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || `Failed to load ${activeTab} campaigns`;
      toast.error(errorMessage);
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  };

  useEffect(() => {
    if (activeTab === 'pending' || activeTab === 'rejected') {
      loadCampaigns();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page, pagination.limit, activeTab]);

  useEffect(() => {
    if (activeTab === 'pending' || activeTab === 'rejected') {
      resetPage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  return {
    campaigns,
    loading,
    pagination,
    handlePageChange,
    handleLimitChange,
    loadCampaigns,
  };
};

