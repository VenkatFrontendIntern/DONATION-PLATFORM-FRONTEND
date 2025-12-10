import React from 'react';
import { donationService } from '../../services/donationService';
import { useAuth } from '../../contexts/AuthContext';
import { useAdminDashboard } from '../../hooks/useAdminDashboard';
import { useAdminActions } from '../../hooks/useAdminActions';
import { StatsCards } from '../../components/admin/StatsCards';
import { AnalyticsSection } from '../../components/admin/AnalyticsSection';
import { CategoryManagement } from '../../components/admin/CategoryManagement';
import { PendingCampaignsList } from '../../components/admin/PendingCampaignsList';
import { AdminTabs } from '../../components/admin/AdminTabs';
import { MyCampaignsSection } from '../../components/admin/MyCampaignsSection';
import { MyDonationsSection } from '../../components/admin/MyDonationsSection';
import { AllDonationsList } from '../../components/admin/AllDonationsList';
import { NewsletterManagement } from '../../components/admin/NewsletterManagement';
import { ConfirmModal } from '../../components/ui/ConfirmModal';
import toast from 'react-hot-toast';
import { ShimmerAdminDashboard } from '../../components/ui/Shimmer';
import { Calendar } from 'lucide-react';
import { CategoryModal } from '../../components/admin/CategoryModal';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const {
    stats,
    campaigns,
    categories,
    myCampaigns,
    myDonations,
    allDonations,
    loading,
    campaignsLoading,
    myDataLoading,
    donationsLoading,
    pagination,
    donationsPagination,
    myCampaignsPagination,
    myDonationsPagination,
    activeTab,
    setActiveTab,
    loadCategories,
    loadMyData,
    loadCampaigns,
    loadData,
    handlePageChange,
    handleDonationsPageChange,
    handleMyCampaignsPageChange,
    handleMyDonationsPageChange,
    handleLimitChange,
    handleDonationsLimitChange,
    handleMyCampaignsLimitChange,
    handleMyDonationsLimitChange,
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

  // Get current date for display
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  if (loading) {
    return <ShimmerAdminDashboard animationType="glow" statsCount={stats?.campaigns.rejected !== undefined ? 5 : 4} />;
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-8 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Premium Header Section */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">Welcome back, {user?.name}</h1>
              <p className="text-sm text-gray-500 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {currentDate}
              </p>
            </div>
          </div>
        </div>

        {/* Top Row: Summary Stats Cards */}
        {stats && <StatsCards stats={stats} />}

        {/* Middle Row: Analytics Charts */}
        {stats && <AnalyticsSection stats={stats} />}

        {/* Tab Navigation */}
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
            onLimitChange={handleLimitChange}
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
            pagination={myCampaignsPagination}
            loading={myDataLoading}
            onDelete={handleDeleteMyCampaign}
            onPageChange={handleMyCampaignsPageChange}
            onLimitChange={handleMyCampaignsLimitChange}
          />
        ) : activeTab === 'my-donations' ? (
          <MyDonationsSection
            donations={myDonations}
            pagination={myDonationsPagination}
            loading={myDataLoading}
            onDownloadCertificate={handleDownloadCertificate}
            onPageChange={handleMyDonationsPageChange}
            onLimitChange={handleMyDonationsLimitChange}
          />
        ) : activeTab === 'all-donations' ? (
          <AllDonationsList
            donations={allDonations}
            pagination={donationsPagination}
            loading={donationsLoading}
            onPageChange={handleDonationsPageChange}
            onLimitChange={handleDonationsLimitChange}
            onDownloadCertificate={handleDownloadCertificate}
          />
        ) : activeTab === 'newsletter' ? (
          <NewsletterManagement campaigns={campaigns} />
        ) : null}

        {/* Category Modal */}
        <CategoryModal
          isOpen={showCategoryModal}
          onClose={() => {
            setShowCategoryModal(false);
            setNewCategory({ name: '', description: '', icon: '' });
          }}
          category={newCategory}
          onCategoryChange={handleCategoryChange}
          onSubmit={handleCreateCategory}
          loading={createLoading}
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
