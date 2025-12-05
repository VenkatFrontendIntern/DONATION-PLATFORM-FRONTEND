import { useState } from 'react';
import { adminService } from '../services/adminService';
import { campaignService } from '../services/campaignService';
import toast from 'react-hot-toast';

interface UseAdminActionsProps {
  loadCampaigns: () => void;
  loadData: () => void;
  loadCategories: () => void;
  loadMyData: () => void;
}

export const useAdminActions = ({
  loadCampaigns,
  loadData,
  loadCategories,
  loadMyData,
}: UseAdminActionsProps) => {
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', description: '', icon: '' });
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [createLoading, setCreateLoading] = useState(false);
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

  const handleDeleteMyCampaign = async (campaignId: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Campaign',
      message: 'Are you sure you want to delete this campaign? This action cannot be undone.',
      variant: 'danger',
      onConfirm: async () => {
        setConfirmModal({ ...confirmModal, isOpen: false });
        try {
          await campaignService.delete(campaignId);
          toast.success('Campaign deleted successfully');
          loadMyData();
        } catch (error: any) {
          toast.error(error.response?.data?.message || 'Failed to delete campaign');
        }
      },
    });
  };

  const handleCategoryChange = (field: string, value: string) => {
    setNewCategory(prev => ({ ...prev, [field]: value }));
  };

  return {
    actionLoading,
    rejectionReason,
    rejectingId,
    showCategoryModal,
    newCategory,
    deleteLoading,
    createLoading,
    confirmModal,
    setRejectionReason,
    setRejectingId,
    setShowCategoryModal,
    setNewCategory,
    setConfirmModal,
    handleApprove,
    handleReject,
    handleCreateCategory,
    handleDeleteCategory,
    handleDeleteMyCampaign,
    handleCategoryChange,
  };
};

