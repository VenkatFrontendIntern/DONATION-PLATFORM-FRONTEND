import React from 'react';
import { Pagination } from '../ui/Pagination';
import { EmptyCampaignsState } from './EmptyCampaignsState';
import { CampaignTableHeader } from './CampaignTableHeader';
import { CampaignTableRow } from './CampaignTableRow';
import { CampaignTableLoading } from './CampaignTableLoading';

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
  onLimitChange?: (limit: number) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onRejectionReasonChange: (reason: string) => void;
  onSetRejectingId: (id: string | null) => void;
  showActions?: boolean;
  isRejectedView?: boolean;
}

export const PendingCampaignsList: React.FC<PendingCampaignsListProps> = ({
  campaigns,
  pagination,
  loading,
  actionLoading,
  rejectionReason,
  rejectingId,
  onPageChange,
  onLimitChange,
  onApprove,
  onReject,
  onRejectionReasonChange,
  onSetRejectingId,
  showActions = true,
  isRejectedView = false,
}) => {
  const isRejected = isRejectedView || (campaigns.length > 0 && campaigns[0]?.status === 'rejected');

  if (loading) {
    return <CampaignTableLoading />;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-white to-gray-50/50">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {isRejected ? 'Rejected Campaigns' : 'Pending Campaign Reviews'}
            </h2>
            {isRejected && (
              <p className="text-sm text-gray-500 mt-1">
                View campaigns that have been rejected with their rejection reasons
              </p>
            )}
          </div>
          <span
            className={`px-3 py-1.5 rounded-full text-sm font-semibold shadow-sm ${
              isRejected ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
            }`}
          >
            {pagination.total} {pagination.total === 1 ? 'campaign' : 'campaigns'}
          </span>
        </div>
      </div>

      {campaigns.length === 0 ? (
        <EmptyCampaignsState isRejected={isRejected} />
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <CampaignTableHeader showActions={showActions} isRejected={isRejected} />
              <tbody className="bg-white divide-y divide-gray-100">
                {campaigns.map((campaign) => (
                  <CampaignTableRow
                    key={campaign._id}
                    campaign={campaign}
                    rejectingId={rejectingId}
                    actionLoading={actionLoading}
                    rejectionReason={rejectionReason}
                    showActions={showActions}
                    isRejected={isRejected}
                    onApprove={onApprove}
                    onReject={onReject}
                    onRejectionReasonChange={onRejectionReasonChange}
                    onSetRejectingId={onSetRejectingId}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {(pagination.pages > 1 || onLimitChange) && (
            <div className="px-6 py-4 border-t border-gray-200">
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.pages}
                totalItems={pagination.total}
                itemsPerPage={pagination.limit}
                onPageChange={onPageChange}
                onLimitChange={onLimitChange}
                showInfo={true}
                showLimitSelector={!!onLimitChange}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};
