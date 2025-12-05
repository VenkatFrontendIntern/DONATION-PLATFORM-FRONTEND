import React, { useState, useEffect, useRef, useCallback } from 'react';
import { adminService } from '../../services/adminService';
import { useAuth } from '../../contexts/AuthContext';
import { StatsCards } from '../../components/admin/StatsCards';
import { CategoryManagement } from '../../components/admin/CategoryManagement';
import { PendingCampaignsList } from '../../components/admin/PendingCampaignsList';
import { ConfirmModal } from '../../components/ui/ConfirmModal';
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
  campaigns: { total: number; pending: number; approved: number; rejected?: number };
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
    limit: 6, // Reduced to 6 items per page to show pagination more easily
    total: 0,
    pages: 0,
  });
  const [activeTab, setActiveTab] = useState<'pending' | 'rejected'>('pending');
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    variant?: 'danger' | 'warning' | 'info';
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    variant: 'warning',
  });

  const loadingRef = useRef(false);
  const prevTabRef = useRef(activeTab);

  useEffect(() => {
    loadData();
    loadCategories();
  }, []);

  // Reset page to 1 when tab changes
  useEffect(() => {
    if (prevTabRef.current !== activeTab) {
      prevTabRef.current = activeTab;
      setPagination(prev => ({ ...prev, page: 1 }));
    }
  }, [activeTab]);

  // Load campaigns when page or tab changes
  useEffect(() => {
    // Prevent duplicate calls
    if (loadingRef.current) {
      return;
    }

    loadCampaigns();
  }, [pagination.page, activeTab]);

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
    // Prevent duplicate calls
    if (loadingRef.current) {
      return;
    }

    loadingRef.current = true;
    try {
      setCampaignsLoading(true);
      const response = await adminService.getPendingCampaigns(activeTab, pagination.page, pagination.limit);
      
      setCampaigns(response.campaigns || []);
      
      if (response.pagination) {
        setPagination(prev => ({
          ...prev,
          ...response.pagination,
        }));
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
    setConfirmModal({
      isOpen: true,
      title: 'Delete Category',
      message: 'Are you sure you want to delete this category? This action cannot be undone.',
      variant: 'danger',
      onConfirm: async () => {
        setConfirmModal({ ...confirmModal, isOpen: false });
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
      },
    });
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

        {/* Tabs for Pending and Rejected Campaigns */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('pending')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'pending'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Pending Campaigns
                {stats && stats.campaigns.pending > 0 && (
                  <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                    {stats.campaigns.pending}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('rejected')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'rejected'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Rejected Campaigns
                {stats && stats.campaigns.rejected && stats.campaigns.rejected > 0 && (
                  <span className="ml-2 bg-red-100 text-red-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                    {stats.campaigns.rejected}
                  </span>
                )}
              </button>
            </nav>
          </div>
        </div>

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
          showActions={activeTab === 'pending'}
          isRejectedView={activeTab === 'rejected'}
        />

        {/* Confirmation Modal */}
        <ConfirmModal
          isOpen={confirmModal.isOpen}
          title={confirmModal.title}
          message={confirmModal.message}
          variant={confirmModal.variant}
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={confirmModal.onConfirm}
          onCancel={() => setConfirmModal({ ...confirmModal, isOpen: false })}
          loading={deleteLoading !== null}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
