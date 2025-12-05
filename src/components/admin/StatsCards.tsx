import React from 'react';
import { Users, Megaphone, Coins, Clock, X } from 'lucide-react';
import { CURRENCY_SYMBOL } from '../../constants';

interface Stats {
  users: { total: number };
  campaigns: { total: number; pending: number; approved: number; rejected?: number };
  donations: { total: number; totalAmount: number };
}

interface StatsCardsProps {
  stats: Stats;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  if (!stats) return null;

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 ${stats.campaigns.rejected !== undefined ? 'lg:grid-cols-5' : 'lg:grid-cols-4'} gap-6 mb-8`}>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">Total Users</p>
            <p className="text-3xl font-bold text-gray-900">{stats.users.total}</p>
          </div>
          <Users className="h-8 w-8 text-gray-400" />
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">Total Campaigns</p>
            <p className="text-3xl font-bold text-gray-900">{stats.campaigns.total}</p>
          </div>
          <Megaphone className="h-8 w-8 text-gray-400" />
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">Total Donations</p>
            <p className="text-3xl font-bold text-gray-900">
              {CURRENCY_SYMBOL}{stats.donations.totalAmount.toLocaleString('en-IN')}
            </p>
          </div>
          <Coins className="h-8 w-8 text-gray-400" />
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">Pending Reviews</p>
            <p className="text-3xl font-bold text-gray-900">{stats.campaigns.pending}</p>
          </div>
          <Clock className="h-8 w-8 text-gray-400" />
        </div>
      </div>

      {stats.campaigns.rejected !== undefined && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Rejected Campaigns</p>
              <p className="text-3xl font-bold text-red-600">{stats.campaigns.rejected}</p>
            </div>
            <X className="h-8 w-8 text-red-400" />
          </div>
        </div>
      )}
    </div>
  );
};

