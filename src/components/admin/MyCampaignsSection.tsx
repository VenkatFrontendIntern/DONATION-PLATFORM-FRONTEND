import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus } from 'lucide-react';
import { CURRENCY_SYMBOL } from '../../constants';
import { Button } from '../ui/Button';

interface Campaign {
  _id: string;
  title: string;
  coverImage?: string;
  category?: { name: string };
  status: string;
  raisedAmount: number;
  goalAmount: number;
}

interface MyCampaignsSectionProps {
  campaigns: Campaign[];
  loading: boolean;
  onDelete: (campaignId: string) => void;
}

export const MyCampaignsSection: React.FC<MyCampaignsSectionProps> = ({
  campaigns,
  loading,
  onDelete,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">My Campaigns</h2>
        <Link to="/start-campaign">
          <Button>
            <Plus size={18} className="mr-2" />
            Start Campaign
          </Button>
        </Link>
      </div>
      {loading ? (
        <div className="p-6 space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : campaigns.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 mb-4">You haven't created any campaigns yet.</p>
          <Link to="/start-campaign">
            <Button>Start Your First Campaign</Button>
          </Link>
        </div>
      ) : (
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {campaigns.map((campaign) => (
              <div
                key={campaign._id}
                className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow relative"
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
                <div className="absolute top-4 right-4">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onDelete(campaign._id);
                    }}
                    className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg shadow-md transition-colors"
                    title="Delete campaign"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

