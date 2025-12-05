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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <p className="text-sm text-gray-500 mb-1">Total Donated</p>
        <p className="text-3xl font-bold text-primary-600">
          {CURRENCY_SYMBOL}{totalDonated.toLocaleString('en-IN')}
        </p>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <p className="text-sm text-gray-500 mb-1">My Campaigns</p>
        <p className="text-3xl font-bold text-gray-900">{campaignCount}</p>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <p className="text-sm text-gray-500 mb-1">Total Donations</p>
        <p className="text-3xl font-bold text-gray-900">{donationCount}</p>
      </div>
    </div>
  );
};

