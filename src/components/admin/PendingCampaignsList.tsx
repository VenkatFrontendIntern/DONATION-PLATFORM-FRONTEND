import React from 'react';
import { Button } from '../ui/Button';
import { AlertCircle, Check, X, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { getImageUrl } from '../../utils/imageUtils';
import { CURRENCY_SYMBOL } from '../../constants';
import { Link } from 'react-router-dom';

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
}) => {
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
            <h2 className="text-xl font-bold text-gray-900">Pending Campaign Reviews</h2>
          </div>
          <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-semibold">
            {pagination.total} {pagination.total === 1 ? 'campaign' : 'campaigns'}
          </span>
        </div>
      </div>

      {campaigns.length === 0 ? (
        <div className="p-12 text-center">
          <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No pending campaigns to review</p>
        </div>
      ) : (
        <>
          <div className="divide-y divide-gray-200">
            {campaigns.map((campaign) => (
              <div key={campaign._id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex gap-6">
                  <img
                    src={getImageUrl(campaign.coverImage)}
                    alt={campaign.title}
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {campaign.title}
                        </h3>
                        <p className="text-sm text-gray-500">
                          by {campaign.organizer}
                        </p>
                      </div>
                      <Link to={`/campaign/${campaign._id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                      </Link>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                      {campaign.category && (
                        <span className="bg-primary-50 text-primary-600 px-2 py-1 rounded">
                          {campaign.category.name}
                        </span>
                      )}
                      <span>
                        Goal: {CURRENCY_SYMBOL}{campaign.goalAmount.toLocaleString('en-IN')}
                      </span>
                    </div>

                    {rejectingId === campaign._id ? (
                      <div className="space-y-3">
                        <textarea
                          value={rejectionReason}
                          onChange={(e) => onRejectionReasonChange(e.target.value)}
                          placeholder="Enter rejection reason..."
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                          rows={3}
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => onReject(campaign._id)}
                            loading={actionLoading === campaign._id}
                            disabled={!rejectionReason.trim()}
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
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => onApprove(campaign._id)}
                          loading={actionLoading === campaign._id}
                        >
                          <Check className="w-4 h-4 mr-2" />
                          Approve
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onSetRejectingId(campaign._id)}
                          disabled={actionLoading === campaign._id}
                        >
                          <X className="w-4 h-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {pagination.pages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
                {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                {pagination.total} campaigns
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <div className="flex gap-1">
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1)
                    .filter((page) => {
                      return (
                        page === 1 ||
                        page === pagination.pages ||
                        (page >= pagination.page - 1 && page <= pagination.page + 1)
                      );
                    })
                    .map((page, idx, arr) => (
                      <React.Fragment key={page}>
                        {idx > 0 && arr[idx - 1] !== page - 1 && (
                          <span className="px-2">...</span>
                        )}
                        <Button
                          variant={pagination.page === page ? 'primary' : 'outline'}
                          size="sm"
                          onClick={() => onPageChange(page)}
                        >
                          {page}
                        </Button>
                      </React.Fragment>
                    ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

