import React from 'react';
import { Button } from '../ui/Button';
import { ProgressBar } from '../ui/ProgressBar';
import { SocialShare } from './SocialShare';
import { RejectionAlert } from './RejectionAlert';
import { ShieldCheck, AlertCircle } from 'lucide-react';
import { CURRENCY_SYMBOL } from '../../constants';
import toast from 'react-hot-toast';

interface DonationCardProps {
  campaign: {
    _id: string;
    title: string;
    description: string;
    raisedAmount: number;
    goalAmount: number;
    donorCount: number;
    status: string;
    rejectionReason?: string | null;
  };
  campaignUrl: string;
  onDonateClick: () => void;
}

export const DonationCard: React.FC<DonationCardProps> = ({
  campaign,
  campaignUrl,
  onDonateClick,
}) => {
  const handleDonateClick = () => {
    if (campaign.status === 'rejected') {
      toast.error('This campaign has been rejected and is not accepting donations.');
      return;
    }
    onDonateClick();
  };

  return (
    <div className="sticky top-24 bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hidden md:block">
      <div className="mb-6">
        <p className="text-3xl font-bold text-gray-900 mb-1">
          {CURRENCY_SYMBOL}{campaign.raisedAmount.toLocaleString('en-IN')}
        </p>
        <p className="text-sm text-gray-500 mb-3">
          raised of {CURRENCY_SYMBOL}{campaign.goalAmount.toLocaleString('en-IN')} goal
        </p>
        <ProgressBar goal={campaign.goalAmount} raised={campaign.raisedAmount} showLabels={false} />
        <p className="text-xs text-gray-400 mt-2">{campaign.donorCount} donors</p>
      </div>

      {campaign.status === 'rejected' && campaign.rejectionReason && (
        <div className="mb-6">
          <RejectionAlert reason={campaign.rejectionReason} />
        </div>
      )}

      <div className="space-y-4">
        <Button
          onClick={handleDonateClick}
          fullWidth
          size="lg"
          disabled={campaign.status === 'rejected'}
        >
          {campaign.status === 'rejected' ? 'Campaign Rejected' : 'Donate Now'}
        </Button>
        <div className="flex justify-center">
          <SocialShare url={campaignUrl} title={campaign.title} description={campaign.description} />
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-100">
        <div className="flex items-start gap-3 text-sm text-gray-600">
          <ShieldCheck className="w-5 h-5 text-green-600 shrink-0" />
          <p>Donations are 100% secure and tax deductible (80G).</p>
        </div>
      </div>
    </div>
  );
};

