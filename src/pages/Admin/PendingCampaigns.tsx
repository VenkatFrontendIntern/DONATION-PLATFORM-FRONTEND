import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { Button } from '../../components/ui/Button';
import toast from 'react-hot-toast';
import { 
  Check, 
  X, 
  Eye,
  AlertCircle,
  ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../../utils/imageUtils';
import { Campaign as CampaignType } from '../../types';
import { CURRENCY_SYMBOL } from '../../constants';
import { ShimmerList, Shimmer } from '../../components/ui/Shimmer';

interface CampaignWithPopulated extends Omit<CampaignType, 'id' | 'category' | 'imageUrl'> {
  _id: string;
  coverImage: string;
  category?: { _id: string; name: string; slug?: string };
  organizerId?: { _id: string; name: string; email: string };
  organizer: string;
  createdAt?: string;
  endDate?: string;
}

const PendingCampaigns: React.FC = () => {
  const [campaigns, setCampaigns] = useState<CampaignWithPopulated[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectingId, setRejectingId] = useState<string | null>(null);

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    try {
      setLoading(true);
      const response = await adminService.getPendingCampaigns('pending');
      setCampaigns(response.campaigns);
    } catch (error: any) {
      toast.error('Failed to load pending campaigns');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    setActionLoading(id);
    try {
      await adminService.approveCampaign(id);
      toast.success('Campaign approved successfully!');
      loadCampaigns();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to approve');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id: string) => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }

    setActionLoading(id);
    try {
      await adminService.rejectCampaign(id, rejectionReason);
      toast.success('Campaign rejected');
      setRejectionReason('');
      setRejectingId(null);
      loadCampaigns();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to reject');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Shimmer className="h-8 w-64 rounded mb-2" />
            <Shimmer className="h-4 w-48 rounded" />
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <Shimmer className="h-6 w-48 rounded" />
            </div>
            <div className="p-6">
              <ShimmerList items={5} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link to="/admin">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft size={18} />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Pending Campaign Reviews</h1>
            <p className="text-sm text-gray-500 mt-1">Review and approve or reject campaign submissions</p>
          </div>
        </div>

        {/* Pending Campaigns */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-gray-600" />
                <h2 className="text-xl font-bold text-gray-900">Campaigns Awaiting Review</h2>
              </div>
              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-semibold">
                {campaigns.length} {campaigns.length === 1 ? 'campaign' : 'campaigns'}
              </span>
            </div>
          </div>

          <div className="divide-y">
            {campaigns.length === 0 ? (
              <div className="p-12 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-4">
                  <Check className="h-6 w-6 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">All Caught Up!</h3>
                <p className="text-gray-500">There are no pending campaigns to review.</p>
              </div>
            ) : (
              campaigns.map((campaign) => (
                <div key={campaign._id} className="p-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <img
                      src={getImageUrl(campaign.coverImage)}
                      alt={campaign.title}
                      className="w-full md:w-32 h-32 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{campaign.title}</h3>
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-semibold whitespace-nowrap">
                          Pending
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{campaign.description}</p>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                        <span>Goal: {CURRENCY_SYMBOL}{campaign.goalAmount.toLocaleString('en-IN')}</span>
                        <span>Organizer: {campaign.organizer}</span>
                        <span>Category: {campaign.category?.name}</span>
                      </div>

                      {/* Rejection Reason Input */}
                      {rejectingId === campaign._id && (
                        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Rejection Reason *
                          </label>
                          <textarea
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            placeholder="Please provide a reason for rejection..."
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          />
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-2">
                        <Button
                          onClick={() => handleApprove(campaign._id)}
                          loading={actionLoading === campaign._id && rejectingId !== campaign._id}
                          disabled={actionLoading === campaign._id}
                          className="flex items-center gap-2"
                        >
                          <Check size={18} />
                          Approve
                        </Button>
                        {rejectingId !== campaign._id ? (
                          <Button
                            onClick={() => setRejectingId(campaign._id)}
                            variant="outline"
                            className="border-red-500 text-red-600 hover:bg-red-50 flex items-center gap-2"
                          >
                            <X size={18} />
                            Reject
                          </Button>
                        ) : (
                          <>
                            <Button
                              onClick={() => handleReject(campaign._id)}
                              loading={actionLoading === campaign._id}
                              disabled={actionLoading === campaign._id || !rejectionReason.trim()}
                              className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
                            >
                              <X size={18} />
                              Confirm Rejection
                            </Button>
                            <Button
                              onClick={() => {
                                setRejectingId(null);
                                setRejectionReason('');
                              }}
                              variant="outline"
                              disabled={actionLoading === campaign._id}
                            >
                              Cancel
                            </Button>
                          </>
                        )}
                        <Button
                          onClick={() => window.open(`/campaign/${campaign._id}`, '_blank')}
                          variant="outline"
                          className="flex items-center gap-2"
                        >
                          <Eye size={18} />
                          View Campaign
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingCampaigns;

