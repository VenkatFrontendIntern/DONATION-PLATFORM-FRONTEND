import { useState, useEffect, useRef } from 'react';
import { campaignService } from '../../services/campaignService';
import { donationService } from '../../services/donationService';
import { usePagination } from './usePagination';
import { AdminTab } from './types';
import toast from 'react-hot-toast';

export const useAdminMyData = (activeTab: AdminTab) => {
  const [myCampaigns, setMyCampaigns] = useState<any[]>([]);
  const [myDonations, setMyDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  const campaignsPagination = usePagination(10);
  const donationsPagination = usePagination(10);
  const loadingRef = useRef(false);

  const loadMyCampaigns = async () => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    try {
      setLoading(true);
      const campaignsRes = await campaignService.getMyCampaigns({
        page: campaignsPagination.pagination.page,
        limit: campaignsPagination.pagination.limit,
      });
      setMyCampaigns(campaignsRes.campaigns || []);
      if (campaignsRes.pages !== undefined) {
        campaignsPagination.updatePagination({
          total: campaignsRes.total,
          pages: campaignsRes.pages,
        });
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to load campaigns';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  };

  const loadMyDonations = async () => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    try {
      setLoading(true);
      const donationsRes = await donationService.getMyDonations({
        page: donationsPagination.pagination.page,
        limit: donationsPagination.pagination.limit,
      });
      setMyDonations(donationsRes.donations || []);
      if (donationsRes.pagination) {
        donationsPagination.updatePagination(donationsRes.pagination);
      } else if (donationsRes.total !== undefined) {
        donationsPagination.updatePagination({
          total: donationsRes.total,
          pages: Math.ceil(donationsRes.total / donationsPagination.pagination.limit),
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

  const loadMyData = async () => {
    setLoading(true);
    try {
      const [donationsRes, campaignsRes] = await Promise.all([
        donationService.getMyDonations({
          page: donationsPagination.pagination.page,
          limit: donationsPagination.pagination.limit,
        }),
        campaignService.getMyCampaigns({
          page: campaignsPagination.pagination.page,
          limit: campaignsPagination.pagination.limit,
        }),
      ]);
      setMyDonations(donationsRes.donations || []);
      setMyCampaigns(campaignsRes.campaigns || []);
      if (campaignsRes.pages !== undefined) {
        campaignsPagination.updatePagination({
          total: campaignsRes.total,
          pages: campaignsRes.pages,
        });
      }
      if (donationsRes.pagination) {
        donationsPagination.updatePagination(donationsRes.pagination);
      } else if (donationsRes.total !== undefined) {
        donationsPagination.updatePagination({
          total: donationsRes.total,
          pages: Math.ceil(donationsRes.total / donationsPagination.pagination.limit),
        });
      }
    } catch (error: any) {
      toast.error('Failed to load your data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'my-campaigns') {
      loadMyCampaigns();
    } else if (activeTab === 'my-donations') {
      loadMyDonations();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    activeTab,
    campaignsPagination.pagination.page,
    campaignsPagination.pagination.limit,
    donationsPagination.pagination.page,
    donationsPagination.pagination.limit,
  ]);

  useEffect(() => {
    if (activeTab === 'my-campaigns') {
      campaignsPagination.resetPage();
    } else if (activeTab === 'my-donations') {
      donationsPagination.resetPage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  return {
    myCampaigns,
    myDonations,
    loading,
    campaignsPagination: {
      pagination: campaignsPagination.pagination,
      handlePageChange: campaignsPagination.handlePageChange,
      handleLimitChange: campaignsPagination.handleLimitChange,
    },
    donationsPagination: {
      pagination: donationsPagination.pagination,
      handlePageChange: donationsPagination.handlePageChange,
      handleLimitChange: donationsPagination.handleLimitChange,
    },
    loadMyData,
    loadMyCampaigns,
    loadMyDonations,
    setMyCampaigns,
  };
};

