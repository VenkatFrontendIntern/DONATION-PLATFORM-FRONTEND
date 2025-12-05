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
      <div className="text-center py-10 bg-white rounded-xl">
        <p className="text-gray-500 mb-4">You haven't created any campaigns yet.</p>
        <Link to="/start-campaign">
          <Button>Start Your First Campaign</Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {campaigns.map((campaign) => (
          <div
            key={campaign._id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow relative"
          >
            <Link to={`/campaign/${campaign._id}`} className="block">
              <img
                src={campaign.coverImage || 'https://via.placeholder.com/800x400?text=No+Image'}
                alt={campaign.title || 'Campaign'}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs bg-primary-50 text-primary-600 px-2 py-1 rounded">
                    {campaign.category?.name}
                  </span>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
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
                <h3 className="font-semibold text-gray-900 mb-2">{campaign.title}</h3>
                <div className="text-sm text-gray-600">
                  <p>
                    {CURRENCY_SYMBOL}{campaign.raisedAmount.toLocaleString('en-IN')} of{' '}
                    {CURRENCY_SYMBOL}{campaign.goalAmount.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            </Link>

            {/* Action Buttons */}
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onDeleteClick(campaign._id, campaign.title);
                }}
                disabled={deleteLoading === campaign._id}
                className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Delete campaign"
              >
                <Trash2 size={16} />
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

