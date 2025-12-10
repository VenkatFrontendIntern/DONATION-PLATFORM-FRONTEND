import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { Stats } from './types';
import toast from 'react-hot-toast';

export const useAdminStats = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  const loadStats = async () => {
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

  useEffect(() => {
    loadStats();
  }, []);

  return { stats, loading, loadStats };
};

