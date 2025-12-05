import React, { useEffect, useState } from 'react';
import { donationService } from '../services/donationService';
import { campaignService } from '../services/campaignService';
import { Download, Calendar, Plus, Heart, Trash2, Edit } from 'lucide-react';
import { CURRENCY_SYMBOL } from '../constants';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { ConfirmModal } from '../components/ui/ConfirmModal';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [donations, setDonations] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'donations' | 'campaigns'>('donations');
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    campaignId: string;
    campaignTitle: string;
  }>({
    isOpen: false,
    campaignId: '',
    campaignTitle: '',
  });

  // Redirect admins to admin dashboard
  useEffect(() => {
    if (user?.role === 'admin') {
      navigate('/admin', { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    // Only load data if user is not admin (to prevent unnecessary API calls)
    if (user?.role !== 'admin') {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      const [donationsRes, campaignsRes] = await Promise.all([
        donationService.getMyDonations(),
        campaignService.getMyCampaigns(),
      ]);
      setDonations(donationsRes.donations || []);
      setCampaigns(campaignsRes.campaigns || []);
    } catch (error: any) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

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

  const handleDeleteCampaign = async (campaignId: string) => {
    setConfirmModal({ ...confirmModal, isOpen: false });
    setDeleteLoading(campaignId);
    try {
      await campaignService.delete(campaignId);
      toast.success('Campaign deleted successfully');
      // Reload campaigns after deletion
      const campaignsRes = await campaignService.getMyCampaigns();
      setCampaigns(campaignsRes.campaigns || []);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete campaign');
    } finally {
      setDeleteLoading(null);
    }
  };

  const openDeleteModal = (campaignId: string, campaignTitle: string) => {
    setConfirmModal({
      isOpen: true,
      campaignId,
      campaignTitle,
    });
  };

  const totalDonated = donations.reduce((acc, curr) => acc + (curr.amount || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50 py-8 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Dashboard</h1>
          <Link to="/start-campaign">
            <Button>
              <Plus size={18} className="mr-2" />
              Start Campaign
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 mb-1">Total Donated</p>
            <p className="text-3xl font-bold text-primary-600">{CURRENCY_SYMBOL}{totalDonated.toLocaleString('en-IN')}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 mb-1">My Campaigns</p>
            <p className="text-3xl font-bold text-gray-900">{campaigns.length}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 mb-1">Total Donations</p>
            <p className="text-3xl font-bold text-gray-900">{donations.length}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('donations')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'donations'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            My Donations
          </button>
          <button
            onClick={() => setActiveTab('campaigns')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'campaigns'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            My Campaigns
          </button>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : activeTab === 'donations' ? (
          donations.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-xl">
              <Heart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500">You haven't made any donations yet.</p>
              <Link to="/campaigns" className="mt-4 inline-block">
                <Button>Explore Campaigns</Button>
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="divide-y divide-gray-100">
                {donations.map((donation) => (
                  <div
                    key={donation._id}
                    className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {donation.campaignId?.title || 'Campaign'}
                      </h4>
                      <div className="flex items-center text-sm text-gray-500 gap-4">
                        <span className="flex items-center">
                          <Calendar size={14} className="mr-1" />{' '}
                          {new Date(donation.createdAt).toLocaleDateString()}
                        </span>
                        <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-medium uppercase tracking-wide">
                          {donation.status}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                      <span className="font-bold text-lg text-gray-900">
                        {CURRENCY_SYMBOL}{donation.amount.toLocaleString('en-IN')}
                      </span>

                      {donation.certificateUrl && (
                        <button
                          onClick={() => handleDownloadCertificate(donation._id)}
                          className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium px-3 py-2 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
                        >
                          <Download size={16} />
                          <span className="hidden sm:inline">80G Certificate</span>
                          <span className="sm:hidden">80G</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        ) : campaigns.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-xl">
            <p className="text-gray-500 mb-4">You haven't created any campaigns yet.</p>
            <Link to="/start-campaign">
              <Button>Start Your First Campaign</Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {campaigns.map((campaign) => (
                <div
                  key={campaign._id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow relative"
                >
                  <Link to={`/campaign/${campaign._id}`} className="block">
                    <img
                      src={campaign.coverImage || 'https://via.placeholder.com/800x400?text=No+Image'}
                      alt={campaign.title || 'Campaign'}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs bg-primary-50 text-primary-600 px-2 py-1 rounded">
                          {campaign.category?.name}
                        </span>
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            campaign.status === 'approved'
                              ? 'bg-green-100 text-green-700'
                              : campaign.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {campaign.status}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">{campaign.title}</h3>
                      <div className="text-sm text-gray-600">
                        <p>
                          {CURRENCY_SYMBOL}{campaign.raisedAmount.toLocaleString('en-IN')} of{' '}
                          {CURRENCY_SYMBOL}{campaign.goalAmount.toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                  </Link>
                  
                  {/* Action Buttons */}
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        openDeleteModal(campaign._id, campaign.title);
                      }}
                      disabled={deleteLoading === campaign._id}
                      className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Delete campaign"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Delete Confirmation Modal */}
            <ConfirmModal
              isOpen={confirmModal.isOpen}
              title="Delete Campaign"
              message={`Are you sure you want to delete "${confirmModal.campaignTitle}"? This action cannot be undone.`}
              variant="danger"
              confirmText="Delete"
              cancelText="Cancel"
              onConfirm={() => handleDeleteCampaign(confirmModal.campaignId)}
              onCancel={() => setConfirmModal({ ...confirmModal, isOpen: false })}
              loading={deleteLoading !== null}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
