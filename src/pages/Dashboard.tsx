import React, { useEffect, useState } from 'react';
import { donationService } from '../services/donationService';
import { campaignService } from '../services/campaignService';
import { Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { StatsCards } from '../components/dashboard/StatsCards';
import { TabNavigation } from '../components/dashboard/TabNavigation';
import { DonationsList } from '../components/dashboard/DonationsList';
import { CampaignsList } from '../components/dashboard/CampaignsList';
import { getErrorMessage } from '../utils/apiResponse';
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
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || 'Failed to download certificate');
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
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
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

        <StatsCards
          totalDonated={totalDonated}
          campaignCount={campaigns.length}
          donationCount={donations.length}
        />

        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : activeTab === 'donations' ? (
          <DonationsList
            donations={donations}
            onDownloadCertificate={handleDownloadCertificate}
          />
        ) : (
          <CampaignsList
            campaigns={campaigns}
            deleteLoading={deleteLoading}
            confirmModal={confirmModal}
            onDeleteClick={openDeleteModal}
            onDeleteConfirm={handleDeleteCampaign}
            onDeleteCancel={() => setConfirmModal({ ...confirmModal, isOpen: false })}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
