import React, { useState } from 'react';
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
import { NewsletterManagement } from '../../components/admin/NewsletterManagement';
import { ConfirmModal } from '../../components/ui/ConfirmModal';
import toast from 'react-hot-toast';
import { ShimmerAdminDashboard } from '../../components/ui/Shimmer';
import { Calendar, Filter, Plus, Tag, Settings } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { CategoryModal } from '../../components/admin/CategoryModal';
import { getImageUrl } from '../../utils/imageUtils';

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

  const [dateFilter, setDateFilter] = useState('all'); // UI only - 'all', 'today', 'week', 'month'

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

  // Get first 3 pending campaigns for compact view
  const pendingCampaignsPreview = campaigns.slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50/50 py-8 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Premium Header Section */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-1">Welcome back, {user?.name}</h1>
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {currentDate}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-gray-700 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent cursor-pointer"
                  >
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                  </select>
                  <Filter className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Row: Summary Stats Cards */}
        {stats && <StatsCards stats={stats} />}

        {/* Middle Row: Analytics Charts */}
        {stats && <AnalyticsSection stats={stats} />}

        {/* Bottom Row: Management Section */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
          {/* Left Column (60%): Pending Actions */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Pending Actions</h2>
                    <p className="text-sm text-gray-500 mt-1">
                      {stats?.campaigns.pending || 0} campaigns awaiting review
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setActiveTab('pending');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    View All
                  </Button>
                </div>
              </div>
              <div className="p-6">
                {campaignsLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-16 bg-gray-100 rounded-lg" />
                      </div>
                    ))}
                  </div>
                ) : pendingCampaignsPreview.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No pending campaigns</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {pendingCampaignsPreview.map((campaign) => (
                      <div
                        key={campaign._id}
                        className="flex items-center gap-4 p-4 rounded-lg border border-gray-100 hover:bg-gray-50 hover:border-emerald-100 transition-all duration-200"
                      >
                        <img
                          src={getImageUrl(campaign.coverImage)}
                          alt={campaign.title}
                          className="h-12 w-12 rounded-lg object-cover border border-gray-200"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">{campaign.title}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {campaign.organizer || campaign.organizerId?.name || 'Unknown'}
                          </p>
                        </div>
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
                          Pending
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column (40%): Quick Actions */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-2 mb-1">
                  <Settings className="h-5 w-5 text-gray-600" />
                  <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
                </div>
                <p className="text-sm text-gray-500">Manage categories and settings</p>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-gray-700">Categories</h3>
                      <Button
                        size="sm"
                        onClick={() => setShowCategoryModal(true)}
                        className="bg-emerald-600 hover:bg-emerald-700"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add
                      </Button>
                    </div>
                    {categories.length === 0 ? (
                      <div className="text-center py-4 text-gray-500 text-sm">
                        <Tag className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                        <p>No categories</p>
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {categories.slice(0, 5).map((category) => (
                          <div
                            key={category._id}
                            className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              {category.icon && <span className="text-lg">{category.icon}</span>}
                              <span className="text-sm font-medium text-gray-700">{category.name}</span>
                            </div>
                            <button
                              onClick={() => handleDeleteCategory(category._id)}
                              disabled={deleteLoading === category._id}
                              className="text-red-500 hover:text-red-700 disabled:opacity-50 text-sm"
                            >
                              Delete
                            </button>
                          </div>
                        ))}
                        {categories.length > 5 && (
                          <p className="text-xs text-gray-500 text-center pt-2">
                            +{categories.length - 5} more categories
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

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
