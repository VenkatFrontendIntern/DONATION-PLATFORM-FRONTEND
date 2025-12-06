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
import { ShimmerList } from '../components/ui/Shimmer';

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

  useEffect(() => {
    if (user?.role === 'admin') {
      navigate('/admin', { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
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
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 md:py-8 pb-20 sm:pb-24">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">My Dashboard</h1>
          <Link to="/start-campaign" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto min-h-[44px] touch-manipulation text-sm sm:text-base">
              <Plus size={16} className="sm:w-[18px] sm:h-[18px] mr-1.5 sm:mr-2" />
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
          <ShimmerList items={3} animationType="wave" />
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
