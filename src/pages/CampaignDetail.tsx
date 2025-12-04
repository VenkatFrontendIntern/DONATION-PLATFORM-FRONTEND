import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { campaignService } from '../services/campaignService';
import { donationService } from '../services/donationService';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Button } from '../components/ui/Button';
import { SocialShare } from '../components/campaign/SocialShare';
import { CampaignInfo } from '../components/campaign/CampaignInfo';
import { OrganizerSection } from '../components/campaign/OrganizerSection';
import { RecentDonations } from '../components/campaign/RecentDonations';
import { DonationCard } from '../components/campaign/DonationCard';
import { DonationModal } from '../components/campaign/DonationModal';
import { RejectionAlert } from '../components/campaign/RejectionAlert';
import { useDonation } from '../hooks/useDonation';
import { getImageUrl } from '../utils/imageUtils';
import { Loader } from 'lucide-react';
import { CURRENCY_SYMBOL } from '../constants';
import toast from 'react-hot-toast';
import { Campaign, Donation } from '../types';

interface CampaignWithPopulated extends Omit<Campaign, 'id' | 'category' | 'imageUrl'> {
  _id: string;
  coverImage: string;
  category?: { _id: string; name: string; slug?: string };
  organizerId?: { _id: string; name: string; email: string; avatar?: string };
  organizer: string;
  rejectionReason?: string;
  socialMedia?: {
    facebook?: string | null;
    instagram?: string | null;
    twitter?: string | null;
    linkedin?: string | null;
    whatsapp?: string | null;
    youtube?: string | null;
  };
  [key: string]: any;
}

interface DonationWithPopulated extends Omit<Donation, 'id' | 'campaignId'> {
  _id: string;
  campaignId?: { _id: string; title: string };
  donorName: string;
  amount: number;
  message?: string;
  createdAt: string;
  [key: string]: any;
}

const CampaignDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [campaign, setCampaign] = useState<CampaignWithPopulated | null>(null);
  const [donations, setDonations] = useState<DonationWithPopulated[]>([]);
  const [loading, setLoading] = useState(true);

  const {
    donationAmount,
    setDonationAmount,
    isAnonymous,
    setIsAnonymous,
    donorName,
    setDonorName,
    donorEmail,
    setDonorEmail,
    donorPhone,
    setDonorPhone,
    donorPan,
    setDonorPan,
    showDonateModal,
    setShowDonateModal,
    processing,
    success,
    donationId,
    handleDonate,
    handleDownloadCertificate,
    resetModal,
  } = useDonation({
    campaignId: id,
    campaignTitle: campaign?.title || '',
    onSuccess: () => {
      loadCampaign();
      loadDonations();
    },
  });

  useEffect(() => {
    if (id) {
      loadCampaign();
      loadDonations();
    }
  }, [id]);

  const loadCampaign = async () => {
    try {
      const response = await campaignService.getById(id!);
      setCampaign(response.campaign);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to load campaign. Please check your connection.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const loadDonations = async () => {
    try {
      const response = await donationService.getCampaignDonations(id!, { limit: 10 });
      setDonations(response.donations || []);
    } catch (error) {
      // Silent fail for donations
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="animate-spin h-8 w-8 text-primary-600" />
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="p-10 text-center">
        <p className="text-gray-500">Campaign not found</p>
        <Link to="/campaigns">
          <Button className="mt-4">Browse Campaigns</Button>
        </Link>
      </div>
    );
  }

  const campaignUrl = `${window.location.origin}/campaign/${campaign._id}`;

  return (
    <div className="bg-gray-50 min-h-screen pb-24 md:pb-12">
      <div className="max-w-5xl mx-auto md:py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column: Image & Content */}
          <div className="md:col-span-2 space-y-6">
            <CampaignInfo
              title={campaign.title}
              description={campaign.description}
              category={campaign.category}
              status={campaign.status}
              rejectionReason={campaign.rejectionReason}
              coverImage={getImageUrl(campaign.coverImage)}
            />

            {/* Mobile Stats */}
            <div className="p-4 md:hidden bg-white shadow-sm">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{campaign.title}</h1>
              <ProgressBar goal={campaign.goalAmount} raised={campaign.raisedAmount} />
              
              {campaign.status === 'rejected' && campaign.rejectionReason && (
                <div className="mt-4 mb-4">
                  <RejectionAlert reason={campaign.rejectionReason} />
                </div>
              )}
              
              <div className="mt-4 flex gap-2">
                <Button 
                  onClick={() => {
                    if (campaign.status === 'rejected') {
                      toast.error('This campaign has been rejected and is not accepting donations.');
                      return;
                    }
                    setShowDonateModal(true);
                  }} 
                  fullWidth
                  disabled={campaign.status === 'rejected'}
                >
                  {campaign.status === 'rejected' ? 'Campaign Rejected' : 'Donate Now'}
                </Button>
                <SocialShare url={campaignUrl} title={campaign.title} description={campaign.description} />
              </div>
            </div>

            {/* Mobile description */}
            <div className="bg-white p-6 md:hidden shadow-sm">
              <h3 className="text-lg font-bold mb-2">About the fundraiser</h3>
              
              {campaign.status === 'rejected' && campaign.rejectionReason && (
                <div className="mb-4">
                  <RejectionAlert reason={campaign.rejectionReason} />
                </div>
              )}
              
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                {campaign.description}
              </p>
            </div>

            <OrganizerSection 
              organizer={campaign.organizer}
              socialMedia={campaign.socialMedia}
            />

            <RecentDonations donations={donations} />
          </div>

          {/* Right Column: Donation Card */}
          <div className="md:col-span-1">
            <DonationCard
              campaign={{
                _id: campaign._id,
                title: campaign.title,
                description: campaign.description,
                raisedAmount: campaign.raisedAmount,
                goalAmount: campaign.goalAmount,
                donorCount: campaign.donorCount,
                status: campaign.status,
                rejectionReason: campaign.rejectionReason,
              }}
              campaignUrl={campaignUrl}
              onDonateClick={() => setShowDonateModal(true)}
            />
          </div>
        </div>
      </div>

      <DonationModal
        isOpen={showDonateModal}
        onClose={resetModal}
        campaignTitle={campaign.title}
        donationAmount={donationAmount}
        onAmountChange={setDonationAmount}
        isAnonymous={isAnonymous}
        onAnonymousChange={setIsAnonymous}
        donorName={donorName}
        onDonorNameChange={setDonorName}
        donorEmail={donorEmail}
        onDonorEmailChange={setDonorEmail}
        donorPhone={donorPhone}
        onDonorPhoneChange={setDonorPhone}
        donorPan={donorPan}
        onDonorPanChange={setDonorPan}
        processing={processing}
        success={success}
        donationId={donationId}
        onDonate={handleDonate}
        onDownloadCertificate={handleDownloadCertificate}
      />
    </div>
  );
};

export default CampaignDetail;
