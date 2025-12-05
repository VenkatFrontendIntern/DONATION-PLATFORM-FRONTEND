import { useState, useEffect, useRef } from 'react';
import { adminService } from '../services/adminService';
import { campaignService } from '../services/campaignService';
import { donationService } from '../services/donationService';
import toast from 'react-hot-toast';

interface Stats {
  users: { total: number };
  campaigns: { total: number; pending: number; approved: number; rejected?: number };
  donations: { total: number; totalAmount: number };
  recentDonations: any[];
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export const useAdminDashboard = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [myCampaigns, setMyCampaigns] = useState<any[]>([]);
  const [myDonations, setMyDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [campaignsLoading, setCampaignsLoading] = useState(true);
  const [myDataLoading, setMyDataLoading] = useState(false);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 6,
    total: 0,
    pages: 0,
  });
  const [activeTab, setActiveTab] = useState<'pending' | 'rejected' | 'my-campaigns' | 'my-donations'>('pending');

  const loadingRef = useRef(false);
  const prevTabRef = useRef(activeTab);

  const loadData = async () => {
    try {
      const statsRes = await adminService.getStats();
      const backendStats = statsRes.stats;
      
      setStats({
        users: { total: backendStats.totalUsers || 0 },
        campaigns: {
          total: backendStats.totalCampaigns || 0,
          pending: backendStats.pendingCampaigns || 0,
          approved: backendStats.approvedCampaigns || 0,
          rejected: backendStats.rejectedCampaigns || 0,
        },
        donations: {
          total: backendStats.totalDonations || 0,
          totalAmount: backendStats.totalAmount || 0,
        },
        recentDonations: [],
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to load data';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const loadCampaigns = async () => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    try {
      setCampaignsLoading(true);
      const response = await adminService.getPendingCampaigns(activeTab, pagination.page, pagination.limit);
      setCampaigns(response.campaigns || []);
      if (response.pagination) {
        setPagination(prev => ({ ...prev, ...response.pagination }));
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || `Failed to load ${activeTab} campaigns`;
      toast.error(errorMessage);
    } finally {
      setCampaignsLoading(false);
      loadingRef.current = false;
    }
  };

  const loadCategories = async () => {
    try {
      const response = await adminService.getAllCategories();
      setCategories(response.categories || []);
    } catch (error: any) {
      toast.error('Failed to load categories');
    }
  };

  const loadMyData = async () => {
    setMyDataLoading(true);
    try {
      const [donationsRes, campaignsRes] = await Promise.all([
        donationService.getMyDonations(),
        campaignService.getMyCampaigns(),
      ]);
      setMyDonations(donationsRes.donations || []);
      setMyCampaigns(campaignsRes.campaigns || []);
    } catch (error: any) {
      toast.error('Failed to load your data');
    } finally {
      setMyDataLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    loadCategories();
    loadMyData();
  }, []);

  useEffect(() => {
    if (activeTab === 'my-campaigns' || activeTab === 'my-donations') {
      loadMyData();
    }
  }, [activeTab]);

  useEffect(() => {
    if (prevTabRef.current !== activeTab) {
      prevTabRef.current = activeTab;
      setPagination(prev => ({ ...prev, page: 1 }));
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'pending' || activeTab === 'rejected') {
      loadCampaigns();
    }
  }, [pagination.page, activeTab]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      setPagination(prev => ({ ...prev, page: newPage }));
    }
  };

  return {
    stats,
    campaigns,
    categories,
    myCampaigns,
    myDonations,
    loading,
    campaignsLoading,
    myDataLoading,
    pagination,
    activeTab,
    setActiveTab,
    setCategories,
    setMyCampaigns,
    setPagination,
    loadCategories,
    loadMyData,
    loadCampaigns,
    loadData,
    handlePageChange,
  };
};

