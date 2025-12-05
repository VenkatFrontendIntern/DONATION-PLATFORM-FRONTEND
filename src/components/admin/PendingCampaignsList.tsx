import React from 'react';
import { Pagination } from '../ui/Pagination';
import { PendingCampaignCard } from './PendingCampaignCard';
import { RejectionForm } from './RejectionForm';
import { EmptyCampaignsState } from './EmptyCampaignsState';

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
        <EmptyCampaignsState isRejected={isRejected} />
      ) : (
        <>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {campaigns.map((campaign) => (
                <div key={campaign._id}>
                  {rejectingId === campaign._id ? (
                    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-5">
                      <h3 className="text-lg font-bold text-gray-900 mb-4 line-clamp-2">
                        {campaign.title}
                      </h3>
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
                    <PendingCampaignCard
                      campaign={campaign}
                      isRejected={isRejected}
                      showActions={showActions}
                      rejectingId={rejectingId}
                      actionLoading={actionLoading}
                      onApprove={onApprove}
                      onRejectClick={onSetRejectingId}
                    />
                  )}
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

