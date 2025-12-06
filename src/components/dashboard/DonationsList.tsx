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
      <div className="text-center py-8 sm:py-10 bg-white rounded-lg sm:rounded-xl px-4">
        <Heart className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mb-3 sm:mb-4" />
        <p className="text-sm sm:text-base text-gray-500 mb-4 sm:mb-5">You haven't made any donations yet.</p>
        <Link to="/campaigns" className="inline-block">
          <Button className="min-h-[44px] touch-manipulation text-sm sm:text-base">
            Explore Campaigns
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="divide-y divide-gray-100">
        {donations.map((donation) => (
          <div
            key={donation._id}
            className="p-3 sm:p-4 md:p-6 flex flex-col gap-3 sm:gap-4 active:bg-gray-50 transition-colors"
          >
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm sm:text-base text-gray-900 mb-2 break-words">
                {donation.campaignId?.title || 'Campaign'}
              </h4>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Calendar size={12} className="sm:w-[14px] sm:h-[14px]" />
                  {new Date(donation.createdAt).toLocaleDateString()}
                </span>
                <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-[10px] sm:text-xs font-medium uppercase tracking-wide">
                  {donation.status}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 sm:gap-4 pt-2 border-t border-gray-100 sm:border-t-0">
              <span className="font-bold text-base sm:text-lg md:text-xl text-gray-900">
                {CURRENCY_SYMBOL}{donation.amount.toLocaleString('en-IN')}
              </span>

              {donation.certificateUrl && (
                <button
                  onClick={() => onDownloadCertificate(donation._id)}
                  className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-primary-600 active:text-primary-700 font-medium px-2.5 sm:px-3 py-2 bg-primary-50 rounded-lg active:bg-primary-100 transition-colors touch-manipulation min-h-[44px] flex-shrink-0"
                >
                  <Download size={14} className="sm:w-4 sm:h-4" />
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

