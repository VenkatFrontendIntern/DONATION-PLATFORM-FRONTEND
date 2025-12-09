import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { RejectionForm } from './RejectionForm';
import { getImageUrl } from '../../utils/imageUtils';
import { CURRENCY_SYMBOL } from '../../constants';
import { Check, X, Eye, Calendar } from 'lucide-react';

interface Campaign {
  _id: string;
  title: string;
  coverImage: string;
  goalAmount: number;
  raisedAmount: number;
  category?: { _id: string; name: string; slug?: string };
  organizerId?: { _id: string; name: string; email: string };
  organizer: string;
  status: string;
  rejectionReason?: string;
  createdAt?: string;
}

interface CampaignTableRowProps {
  campaign: Campaign;
  rejectingId: string | null;
  actionLoading: string | null;
  rejectionReason: string;
  showActions: boolean;
  isRejected: boolean;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onRejectionReasonChange: (reason: string) => void;
  onSetRejectingId: (id: string | null) => void;
}

const formatDate = (dateString?: string) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[date.getMonth()];
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
  } catch {
    return 'N/A';
  }
};

export const CampaignTableRow: React.FC<CampaignTableRowProps> = ({
  campaign,
  rejectingId,
  actionLoading,
  rejectionReason,
  showActions,
  isRejected,
  onApprove,
  onReject,
  onRejectionReasonChange,
  onSetRejectingId,
}) => {
  return (
    <tr
      key={campaign._id}
      className="hover:bg-emerald-50/50 transition-all duration-200 group"
    >
      <td className="px-6 py-4 whitespace-nowrap">
        {rejectingId === campaign._id ? (
          <div className="max-w-md">
            <RejectionForm
              rejectionReason={rejectionReason}
              onReasonChange={onRejectionReasonChange}
              onConfirm={() => onReject(campaign._id)}
              onCancel={() => {
                onSetRejectingId(null);
                onRejectionReasonChange('');
              }}
              loading={actionLoading === campaign._id}
            />
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <img
              src={getImageUrl(campaign.coverImage)}
              alt={campaign.title}
              className="h-16 w-16 rounded-lg object-cover border border-gray-200 group-hover:border-emerald-300 transition-colors duration-200 shadow-sm"
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-emerald-700 transition-colors">
                {campaign.title}
              </p>
              {campaign.category && (
                <p className="text-xs text-gray-500 mt-1">
                  {campaign.category.name}
                </p>
              )}
            </div>
          </div>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">
          {campaign.organizer || campaign.organizerId?.name || 'Unknown'}
        </div>
        {campaign.organizerId?.email && (
          <div className="text-xs text-gray-500">{campaign.organizerId.email}</div>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-bold text-gray-900">
          {CURRENCY_SYMBOL}
          {campaign.goalAmount.toLocaleString('en-IN')}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span className="font-medium">{formatDate(campaign.createdAt)}</span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm ${
            isRejected
              ? 'bg-red-100 text-red-700 border border-red-200'
              : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
          }`}
        >
          {isRejected ? 'Rejected' : 'Pending'}
        </span>
      </td>
      {showActions && rejectingId !== campaign._id && (
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <div className="flex items-center justify-end gap-2">
            <Link to={`/campaign/${campaign._id}`}>
              <Button variant="outline" size="sm" className="hover:bg-gray-100">
                <Eye className="h-4 w-4 mr-1" />
                View
              </Button>
            </Link>
            <Button
              size="sm"
              onClick={() => onApprove(campaign._id)}
              loading={actionLoading === campaign._id}
              className="bg-emerald-600 hover:bg-emerald-700 shadow-sm hover:shadow-md transition-all"
            >
              <Check className="h-4 w-4 mr-1" />
              Approve
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSetRejectingId(campaign._id)}
              disabled={actionLoading === campaign._id}
              className="border-red-500 text-red-600 hover:bg-red-50 hover:border-red-600 transition-all"
            >
              <X className="h-4 w-4 mr-1" />
              Reject
            </Button>
          </div>
        </td>
      )}
      {isRejected && (
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <div className="flex items-center justify-end gap-2">
            <Link to={`/campaign/${campaign._id}`}>
              <Button variant="outline" size="sm" className="hover:bg-gray-100">
                <Eye className="h-4 w-4 mr-1" />
                View Details
              </Button>
            </Link>
          </div>
        </td>
      )}
      {isRejected && (
        <td className="px-6 py-4">
          {campaign.rejectionReason && (
            <div className="max-w-md">
              <p className="text-xs font-semibold text-red-800 mb-1">
                Rejection Reason:
              </p>
              <p className="text-xs text-red-700 line-clamp-2">
                {campaign.rejectionReason}
              </p>
            </div>
          )}
        </td>
      )}
    </tr>
  );
};

