import React from 'react';
import { donationService } from '../../services/donationService';
import { useAuth } from '../../contexts/AuthContext';
import { useAdminDashboard } from '../../hooks/useAdminDashboard';
import { useAdminActions } from '../../hooks/useAdminActions';
import { StatsCards } from '../../components/admin/StatsCards';
import { CategoryManagement } from '../../components/admin/CategoryManagement';
import { PendingCampaignsList } from '../../components/admin/PendingCampaignsList';
import { AdminTabs } from '../../components/admin/AdminTabs';
import { MyCampaignsSection } from '../../components/admin/MyCampaignsSection';
import { MyDonationsSection } from '../../components/admin/MyDonationsSection';
import { ConfirmModal } from '../../components/ui/ConfirmModal';
import toast from 'react-hot-toast';
import { ShimmerStats, ShimmerText, Shimmer, ShimmerList } from '../../components/ui/Shimmer';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const {
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
    loadCategories,
    loadMyData,
    loadCampaigns,
    loadData,
    handlePageChange,
  } = useAdminDashboard();

  const {
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
  } = useAdminActions({
    loadCampaigns,
    loadData,
    loadCategories,
    loadMyData,
  });

  const handleDownloadCertificate = async (donationId: string) => {
    try {
      const blob = await donationService.getCertificate(donationId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `80G-Certificate-${donationId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Certificate downloaded');
    } catch (error: any) {
      toast.error('Failed to download certificate');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <Shimmer className="h-8 w-48 rounded mb-2" animationType="glow" />
              <Shimmer className="h-4 w-32 rounded" animationType="glow" />
            </div>
          </div>
          <ShimmerStats count={5} className="mb-8" animationType="glow" />
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <Shimmer className="h-6 w-40 rounded mb-4" animationType="glow" />
            <ShimmerText lines={3} className="mb-4" animationType="glow" />
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <Shimmer className="h-6 w-32 rounded mb-4" animationType="glow" />
            <ShimmerList items={5} animationType="glow" />
          </div>
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

        <AdminTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          pendingCount={stats?.campaigns.pending}
          rejectedCount={stats?.campaigns.rejected}
          myCampaignsCount={myCampaigns.length}
          myDonationsCount={myDonations.length}
        />

        {/* Content based on active tab */}
        {activeTab === 'pending' || activeTab === 'rejected' ? (
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
        ) : activeTab === 'my-campaigns' ? (
          <MyCampaignsSection
            campaigns={myCampaigns}
            loading={myDataLoading}
            onDelete={handleDeleteMyCampaign}
          />
        ) : activeTab === 'my-donations' ? (
          <MyDonationsSection
            donations={myDonations}
            loading={myDataLoading}
            onDownloadCertificate={handleDownloadCertificate}
          />
        ) : null}

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
