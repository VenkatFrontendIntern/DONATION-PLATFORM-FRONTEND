import React from 'react';
import { Button } from '../ui/Button';
import { AlertCircle, Check, X, Eye } from 'lucide-react';
import { getImageUrl } from '../../utils/imageUtils';
import { CURRENCY_SYMBOL } from '../../constants';
import { Link } from 'react-router-dom';
import { Pagination } from '../ui/Pagination';

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

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

interface PendingCampaignsListProps {
  campaigns: Campaign[];
  pagination: Pagination;
  loading: boolean;
  actionLoading: string | null;
  rejectionReason: string;
  rejectingId: string | null;
  onPageChange: (page: number) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onRejectionReasonChange: (reason: string) => void;
  onSetRejectingId: (id: string | null) => void;
  showActions?: boolean; // Hide actions for rejected campaigns
  isRejectedView?: boolean; // Indicates if this is showing rejected campaigns
}

export const PendingCampaignsList: React.FC<PendingCampaignsListProps> = ({
  campaigns,
  pagination,
  loading,
  actionLoading,
  rejectionReason,
  rejectingId,
  onPageChange,
  onApprove,
  onReject,
  onRejectionReasonChange,
  onSetRejectingId,
  showActions = true,
  isRejectedView = false,
}) => {
  const isRejected = isRejectedView || (campaigns.length > 0 && campaigns[0]?.status === 'rejected');
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading campaigns...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {isRejected ? 'Rejected Campaigns' : 'Pending Campaign Reviews'}
            </h2>
            {isRejected && (
              <p className="text-sm text-gray-500 mt-1">View campaigns that have been rejected with their rejection reasons</p>
            )}
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
            isRejected 
              ? 'bg-red-100 text-red-700' 
              : 'bg-gray-100 text-gray-700'
          }`}>
            {pagination.total} {pagination.total === 1 ? 'campaign' : 'campaigns'}
          </span>
        </div>
      </div>

      {campaigns.length === 0 ? (
        <div className="p-12 text-center">
          <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">
            {isRejected ? 'No rejected campaigns' : 'No pending campaigns to review'}
          </p>
        </div>
      ) : (
        <>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {campaigns.map((campaign) => (
                <div
                  key={campaign._id}
                  className="bg-white rounded-xl shadow-md border border-gray-200 hover:border-gray-300 overflow-hidden transition-all duration-300 hover:shadow-lg"
                >
                  {/* Campaign Image */}
                  <div className="relative h-48 w-full overflow-hidden">
                    <img
                      src={getImageUrl(campaign.coverImage)}
                      alt={campaign.title}
                      className="w-full h-full object-cover"
                    />
                    {/* Status Badge */}
                    <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${
                      isRejected
                        ? 'bg-red-500 text-white'
                        : 'bg-yellow-500 text-white'
                    }`}>
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
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {campaign.description}
                    </p>

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
                    {rejectingId === campaign._id ? (
                      <div className="space-y-3">
                        <textarea
                          value={rejectionReason}
                          onChange={(e) => onRejectionReasonChange(e.target.value)}
                          placeholder="Enter rejection reason..."
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          rows={3}
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => onReject(campaign._id)}
                            loading={actionLoading === campaign._id}
                            disabled={!rejectionReason.trim()}
                            className="flex-1"
                          >
                            Confirm Reject
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              onSetRejectingId(null);
                              onRejectionReasonChange('');
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {showActions && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => onApprove(campaign._id)}
                              loading={actionLoading === campaign._id}
                              className="flex-1"
                            >
                              <Check className="w-4 h-4 mr-2" />
                              Approve
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onSetRejectingId(campaign._id)}
                              disabled={actionLoading === campaign._id}
                              className="flex-1 border-red-500 text-red-600 hover:bg-red-50"
                            >
                              <X className="w-4 h-4 mr-2" />
                              Reject
                            </Button>
                          </div>
                        )}
                        <Link to={`/campaign/${campaign._id}`} className="block">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Campaign
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {pagination.pages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200">
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.pages}
                totalItems={pagination.total}
                itemsPerPage={pagination.limit}
                onPageChange={onPageChange}
                showInfo={false}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

