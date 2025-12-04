import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { useAuth } from '../../contexts/AuthContext';
import { StatsCards } from '../../components/admin/StatsCards';
import { CategoryManagement } from '../../components/admin/CategoryManagement';
import { PendingCampaignsList } from '../../components/admin/PendingCampaignsList';
import toast from 'react-hot-toast';
import { Donation as DonationType, Campaign as CampaignType } from '../../types';

interface CampaignWithPopulated extends Omit<CampaignType, 'id' | 'category' | 'imageUrl' | 'endDate'> {
  _id: string;
  coverImage: string;
  category?: { _id: string; name: string; slug?: string };
  organizerId?: { _id: string; name: string; email: string };
  organizer: string;
  createdAt?: string;
  endDate?: string;
}

interface Stats {
  users: { total: number };
  campaigns: { total: number; pending: number; approved: number };
  donations: { total: number; totalAmount: number };
  recentDonations: DonationType[];
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

interface Category {
  _id: string;
  name: string;
  description?: string;
  icon?: string;
  slug?: string;
  isActive?: boolean;
}

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [campaigns, setCampaigns] = useState<CampaignWithPopulated[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [campaignsLoading, setCampaignsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', description: '', icon: '' });
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [createLoading, setCreateLoading] = useState(false);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  useEffect(() => {
    loadData();
    loadCategories();
  }, []);

  useEffect(() => {
    loadCampaigns();
  }, [pagination.page]);

  const loadData = async () => {
    try {
      const statsRes = await adminService.getStats();
      const backendStats = statsRes.stats || statsRes;
      
      setStats({
        users: { total: backendStats.totalUsers || 0 },
        campaigns: {
          total: backendStats.totalCampaigns || 0,
          pending: backendStats.pendingCampaigns || 0,
          approved: backendStats.approvedCampaigns || 0,
        },
        donations: {
          total: backendStats.totalDonations || 0,
          totalAmount: backendStats.totalAmount || 0,
        },
        recentDonations: [],
      });
    } catch (error: any) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const loadCampaigns = async () => {
    try {
      setCampaignsLoading(true);
      const response = await adminService.getPendingCampaigns('pending', pagination.page, pagination.limit);
      setCampaigns(response.campaigns || []);
      
      if (response.pagination) {
        setPagination(response.pagination);
      } else if (response.total !== undefined && response.page !== undefined && response.limit !== undefined) {
        setPagination({
          page: response.page,
          limit: response.limit,
          total: response.total,
          pages: Math.ceil(response.total / response.limit),
        });
      }
    } catch (error: any) {
      toast.error('Failed to load pending campaigns');
    } finally {
      setCampaignsLoading(false);
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

  const handleCreateCategory = async () => {
    if (!newCategory.name.trim()) {
      toast.error('Category name is required');
      return;
    }

    setCreateLoading(true);
    try {
      await adminService.createCategory({
        name: newCategory.name,
        description: newCategory.description,
        icon: newCategory.icon,
      });
      toast.success('Category created successfully');
      setShowCategoryModal(false);
      setNewCategory({ name: '', description: '', icon: '' });
      loadCategories();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create category');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    setDeleteLoading(id);
    try {
      await adminService.deleteCategory(id);
      toast.success('Category deleted successfully');
      loadCategories();
    } catch (error: any) {
      toast.error('Failed to delete category');
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleApprove = async (id: string) => {
    setActionLoading(id);
    try {
      await adminService.approveCampaign(id);
      toast.success('Campaign approved');
      loadCampaigns();
      loadData();
    } catch (error: any) {
      toast.error('Failed to approve campaign');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id: string) => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }

    setActionLoading(id);
    try {
      await adminService.rejectCampaign(id, rejectionReason);
      toast.success('Campaign rejected');
      setRejectingId(null);
      setRejectionReason('');
      loadCampaigns();
      loadData();
    } catch (error: any) {
      toast.error('Failed to reject campaign');
    } finally {
      setActionLoading(null);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      setPagination(prev => ({ ...prev, page: newPage }));
    }
  };

  const handleCategoryChange = (field: string, value: string) => {
    setNewCategory(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">Welcome back, {user?.name}</p>
          </div>
        </div>

        {stats && <StatsCards stats={stats} />}

        <CategoryManagement
          categories={categories}
          showModal={showCategoryModal}
          newCategory={newCategory}
          deleteLoading={deleteLoading}
          onShowModal={() => setShowCategoryModal(true)}
          onCloseModal={() => {
            setShowCategoryModal(false);
            setNewCategory({ name: '', description: '', icon: '' });
          }}
          onCategoryChange={handleCategoryChange}
          onCreateCategory={handleCreateCategory}
          onDeleteCategory={handleDeleteCategory}
          createLoading={createLoading}
        />

        <PendingCampaignsList
          campaigns={campaigns}
          pagination={pagination}
          loading={campaignsLoading}
          actionLoading={actionLoading}
          rejectionReason={rejectionReason}
          rejectingId={rejectingId}
          onPageChange={handlePageChange}
          onApprove={handleApprove}
          onReject={handleReject}
          onRejectionReasonChange={setRejectionReason}
          onSetRejectingId={setRejectingId}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
