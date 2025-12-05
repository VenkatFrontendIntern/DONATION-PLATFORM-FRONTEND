import React from 'react';
import { Link } from 'react-router-dom';
import { Download, Calendar, Heart } from 'lucide-react';
import { Button } from '../ui/Button';
import { CURRENCY_SYMBOL } from '../../constants';

interface Donation {
  _id: string;
  amount: number;
  status: string;
  createdAt: string;
  certificateUrl?: string;
  campaignId?: {
    title: string;
  };
}

interface DonationsListProps {
  donations: Donation[];
  onDownloadCertificate: (donationId: string) => void;
}

export const DonationsList: React.FC<DonationsListProps> = ({
  donations,
  onDownloadCertificate,
}) => {
  if (donations.length === 0) {
    return (
      <div className="text-center py-10 bg-white rounded-xl">
        <Heart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-gray-500">You haven't made any donations yet.</p>
        <Link to="/campaigns" className="mt-4 inline-block">
          <Button>Explore Campaigns</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="divide-y divide-gray-100">
        {donations.map((donation) => (
          <div
            key={donation._id}
            className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 mb-1">
                {donation.campaignId?.title || 'Campaign'}
              </h4>
              <div className="flex items-center text-sm text-gray-500 gap-4">
                <span className="flex items-center">
                  <Calendar size={14} className="mr-1" />
                  {new Date(donation.createdAt).toLocaleDateString()}
                </span>
                <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-medium uppercase tracking-wide">
                  {donation.status}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
              <span className="font-bold text-lg text-gray-900">
                {CURRENCY_SYMBOL}{donation.amount.toLocaleString('en-IN')}
              </span>

              {donation.certificateUrl && (
                <button
                  onClick={() => onDownloadCertificate(donation._id)}
                  className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium px-3 py-2 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
                >
                  <Download size={16} />
                  <span className="hidden sm:inline">80G Certificate</span>
                  <span className="sm:hidden">80G</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

