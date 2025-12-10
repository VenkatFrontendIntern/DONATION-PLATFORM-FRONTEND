import { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';
import { useAdminStats } from './admin/useAdminStats';
import { useAdminCampaigns } from './admin/useAdminCampaigns';
import { useAdminDonations } from './admin/useAdminDonations';
import { useAdminMyData } from './admin/useAdminMyData';
import { AdminTab } from './admin/types';
import toast from 'react-hot-toast';

export const useAdminDashboard = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<AdminTab>('pending');

  // Use modular hooks
  const { stats, loading: statsLoading } = useAdminStats();
  const campaignsData = useAdminCampaigns(activeTab);
  const donationsData = useAdminDonations(activeTab);
  const myData = useAdminMyData(activeTab);

  const loadCategories = async () => {
    try {
      const response = await adminService.getAllCategories();
      setCategories(response.categories || []);
    } catch (error: any) {
      toast.error('Failed to load categories');
    }
  };

  useEffect(() => {
    loadCategories();
    myData.loadMyData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    // Stats
    stats,
    loading: statsLoading,
    loadData: () => {}, // Stats are loaded automatically

    // Campaigns
    campaigns: campaignsData.campaigns,
    campaignsLoading: campaignsData.loading,
    pagination: campaignsData.pagination,
    handlePageChange: campaignsData.handlePageChange,
    handleLimitChange: campaignsData.handleLimitChange,
    loadCampaigns: campaignsData.loadCampaigns,

    // All Donations
    allDonations: donationsData.allDonations,
    donationsLoading: donationsData.loading,
    donationsPagination: donationsData.pagination,
    handleDonationsPageChange: donationsData.handlePageChange,
    handleDonationsLimitChange: donationsData.handleLimitChange,

    // My Data
    myCampaigns: myData.myCampaigns,
    myDonations: myData.myDonations,
    myDataLoading: myData.loading,
    myCampaignsPagination: myData.campaignsPagination.pagination,
    myDonationsPagination: myData.donationsPagination.pagination,
    handleMyCampaignsPageChange: myData.campaignsPagination.handlePageChange,
    handleMyCampaignsLimitChange: myData.campaignsPagination.handleLimitChange,
    handleMyDonationsPageChange: myData.donationsPagination.handlePageChange,
    handleMyDonationsLimitChange: myData.donationsPagination.handleLimitChange,
    loadMyData: myData.loadMyData,
    loadMyCampaigns: myData.loadMyCampaigns,

    // Categories
    categories,
    setCategories,
    loadCategories,

    // Tab management
    activeTab,
    setActiveTab,
    setMyCampaigns: myData.setMyCampaigns,
    setPagination: () => {}, // Handled by individual hooks
  };
};
