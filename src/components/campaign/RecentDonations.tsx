import React from 'react';
import { CURRENCY_SYMBOL } from '../../constants';

interface Donation {
  _id: string;
  donorName: string;
  amount: number;
  message?: string;
}

interface RecentDonationsProps {
  donations: Donation[];
}

export const RecentDonations: React.FC<RecentDonationsProps> = ({ donations }) => {
  if (donations.length === 0) return null;

  return (
    <div className="bg-white p-6 md:rounded-2xl shadow-sm">
      <h3 className="text-lg font-bold mb-4">Recent Donations</h3>
      <div className="space-y-3">
        {donations.slice(0, 5).map((donation) => (
          <div key={donation._id} className="flex items-center justify-between">
            <div>
              <p className="font-medium">{donation.donorName}</p>
              {donation.message && (
                <p className="text-sm text-gray-500">{donation.message}</p>
              )}
            </div>
            <p className="font-bold text-primary-600">
              {CURRENCY_SYMBOL}{donation.amount.toLocaleString('en-IN')}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

