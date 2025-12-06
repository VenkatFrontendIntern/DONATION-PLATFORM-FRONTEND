import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { ConfirmModal } from '../ui/ConfirmModal';
import { CURRENCY_SYMBOL } from '../../constants';

interface Campaign {
  _id: string;
  title: string;
  coverImage: string;
  goalAmount: number;
  raisedAmount: number;
  status: string;
  category?: {
    name: string;
  };
}

interface CampaignsListProps {
  campaigns: Campaign[];
  deleteLoading: string | null;
  confirmModal: {
    isOpen: boolean;
    campaignId: string;
    campaignTitle: string;
  };
  onDeleteClick: (campaignId: string, campaignTitle: string) => void;
  onDeleteConfirm: (campaignId: string) => void;
  onDeleteCancel: () => void;
}

export const CampaignsList: React.FC<CampaignsListProps> = ({
  campaigns,
  deleteLoading,
  confirmModal,
  onDeleteClick,
  onDeleteConfirm,
  onDeleteCancel,
}) => {
  if (campaigns.length === 0) {
    return (
      <div className="text-center py-8 sm:py-10 bg-white rounded-lg sm:rounded-xl px-4">
        <p className="text-sm sm:text-base text-gray-500 mb-4 sm:mb-5">You haven't created any campaigns yet.</p>
        <Link to="/start-campaign">
          <Button className="min-h-[44px] touch-manipulation text-sm sm:text-base">
            Start Your First Campaign
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
        {campaigns.map((campaign) => (
          <div
            key={campaign._id}
            className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100 overflow-hidden active:shadow-md transition-shadow relative"
          >
            <Link to={`/campaign/${campaign._id}`} className="block">
              <img
                src={campaign.coverImage || 'https://via.placeholder.com/800x400?text=No+Image'}
                alt={campaign.title || 'Campaign'}
                className="w-full h-40 sm:h-48 md:h-52 object-cover"
              />
              <div className="p-3 sm:p-4 md:p-5">
                <div className="flex items-center justify-between mb-2 gap-2">
                  <span className="text-[10px] sm:text-xs bg-primary-50 text-primary-600 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded flex-shrink-0">
                    {campaign.category?.name || 'Category'}
                  </span>
                  <span
                    className={`text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded flex-shrink-0 ${
                      campaign.status === 'approved'
                        ? 'bg-green-100 text-green-700'
                        : campaign.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {campaign.status}
                  </span>
                </div>
                <h3 className="font-semibold text-sm sm:text-base text-gray-900 mb-2 line-clamp-2 break-words">{campaign.title}</h3>
                <div className="text-xs sm:text-sm text-gray-600">
                  <p className="break-words">
                    {CURRENCY_SYMBOL}{campaign.raisedAmount.toLocaleString('en-IN')} of{' '}
                    {CURRENCY_SYMBOL}{campaign.goalAmount.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            </Link>

            {/* Action Buttons */}
            <div className="absolute top-2 right-2 sm:top-3 sm:right-3 md:top-4 md:right-4 flex gap-1.5 sm:gap-2">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onDeleteClick(campaign._id, campaign.title);
                }}
                disabled={deleteLoading === campaign._id}
                className="bg-red-500 active:bg-red-600 text-white p-1.5 sm:p-2 rounded-lg shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation min-w-[36px] min-h-[36px] sm:min-w-[44px] sm:min-h-[44px] flex items-center justify-center"
                title="Delete campaign"
              >
                <Trash2 size={14} className="sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title="Delete Campaign"
        message={`Are you sure you want to delete "${confirmModal.campaignTitle}"? This action cannot be undone.`}
        variant="danger"
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={() => onDeleteConfirm(confirmModal.campaignId)}
        onCancel={onDeleteCancel}
        loading={deleteLoading !== null}
      />
    </>
  );
};

