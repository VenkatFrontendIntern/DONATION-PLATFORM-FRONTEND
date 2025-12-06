import React from 'react';
import { CURRENCY_SYMBOL } from '../../constants';

interface StatsCardsProps {
  totalDonated: number;
  campaignCount: number;
  donationCount: number;
}

export const StatsCards: React.FC<StatsCardsProps> = ({
  totalDonated,
  campaignCount,
  donationCount,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8">
      <div className="bg-white p-4 sm:p-5 md:p-6 rounded-lg sm:rounded-xl shadow-sm border border-gray-100">
        <p className="text-xs sm:text-sm text-gray-500 mb-1.5 sm:mb-2">Total Donated</p>
        <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-600 break-words">
          {CURRENCY_SYMBOL}{totalDonated.toLocaleString('en-IN')}
        </p>
      </div>
      <div className="bg-white p-4 sm:p-5 md:p-6 rounded-lg sm:rounded-xl shadow-sm border border-gray-100">
        <p className="text-xs sm:text-sm text-gray-500 mb-1.5 sm:mb-2">My Campaigns</p>
        <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">{campaignCount}</p>
      </div>
      <div className="bg-white p-4 sm:p-5 md:p-6 rounded-lg sm:rounded-xl shadow-sm border border-gray-100">
        <p className="text-xs sm:text-sm text-gray-500 mb-1.5 sm:mb-2">Total Donations</p>
        <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">{donationCount}</p>
      </div>
    </div>
  );
};

