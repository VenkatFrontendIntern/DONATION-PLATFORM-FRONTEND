import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Check, X, Eye } from 'lucide-react';
import { getImageUrl } from '../../utils/imageUtils';
import { CURRENCY_SYMBOL } from '../../constants';

interface Campaign {
  _id: string;
  title: string;
  coverImage: string;
  description?: string;
  goalAmount: number;
  category?: { _id: string; name: string; slug?: string };
  organizer: string;
  status: string;
  rejectionReason?: string;
}

interface PendingCampaignCardProps {
  campaign: Campaign;
  isRejected: boolean;
  showActions: boolean;
  rejectingId: string | null;
  actionLoading: string | null;
  onApprove: (id: string) => void;
  onRejectClick: (id: string) => void;
}

export const PendingCampaignCard: React.FC<PendingCampaignCardProps> = ({
  campaign,
  isRejected,
  showActions,
  rejectingId,
  actionLoading,
  onApprove,
  onRejectClick,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 hover:border-gray-300 overflow-hidden transition-all duration-300 hover:shadow-lg">
      {/* Campaign Image */}
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={getImageUrl(campaign.coverImage)}
          alt={campaign.title}
          className="w-full h-full object-cover"
        />
        {/* Status Badge */}
        <div
          className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${
            isRejected ? 'bg-red-500 text-white' : 'bg-yellow-500 text-white'
          }`}
        >
          {isRejected ? 'Rejected' : 'Pending'}
        </div>
        {/* Category Badge */}
        {campaign.category && (
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
            <span className="text-xs font-medium text-gray-700">
              {campaign.category.name}
            </span>
          </div>
        )}
      </div>

      {/* Campaign Content */}
      <div className="p-5">
        {/* Title and Organizer */}
        <div className="mb-3">
          <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2">
            {campaign.title}
          </h3>
          <p className="text-sm text-gray-500">
            by <span className="font-medium">{campaign.organizer}</span>
          </p>
        </div>

        {/* Description */}
        {campaign.description && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {campaign.description}
          </p>
        )}

        {/* Goal Amount */}
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500 mb-1">Goal Amount</p>
          <p className="text-lg font-bold text-gray-900">
            {CURRENCY_SYMBOL}{campaign.goalAmount.toLocaleString('en-IN')}
          </p>
        </div>

        {/* Rejection Reason for Rejected Campaigns */}
        {isRejected && campaign.rejectionReason && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-xs font-semibold text-red-800 mb-1">Rejection Reason:</p>
            <p className="text-sm text-red-700 line-clamp-3">{campaign.rejectionReason}</p>
          </div>
        )}

        {/* Action Buttons */}
        {showActions && (
          <div className="space-y-2">
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => onApprove(campaign._id)}
                loading={actionLoading === campaign._id && rejectingId !== campaign._id}
                className="flex-1"
              >
                <Check className="w-4 h-4 mr-2" />
                Approve
              </Button>
              {rejectingId !== campaign._id && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onRejectClick(campaign._id)}
                  disabled={actionLoading === campaign._id}
                  className="flex-1 border-red-500 text-red-600 hover:bg-red-50"
                >
                  <X className="w-4 h-4 mr-2" />
                  Reject
                </Button>
              )}
            </div>
            <Link to={`/campaign/${campaign._id}`} className="block">
              <Button variant="outline" size="sm" className="w-full">
                <Eye className="w-4 h-4 mr-2" />
                View Campaign
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

