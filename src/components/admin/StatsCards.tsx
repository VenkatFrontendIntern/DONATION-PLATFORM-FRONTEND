import React from 'react';
import { Users, Megaphone, Coins, Clock, X, TrendingUp, TrendingDown } from 'lucide-react';
import { CURRENCY_SYMBOL } from '../../constants';

interface Stats {
  users: { total: number };
  campaigns: { total: number; pending: number; approved: number; rejected?: number };
  donations: { total: number; totalAmount: number };
}

interface StatsCardsProps {
  stats: Stats;
}

// Mock trend data - in production, this would come from the backend
const getTrendData = (key: string) => {
  const trends: Record<string, { value: number; isPositive: boolean }> = {
    users: { value: 12, isPositive: true },
    campaigns: { value: 8, isPositive: true },
    donations: { value: 24, isPositive: true },
    pending: { value: -5, isPositive: false },
    rejected: { value: 2, isPositive: false },
  };
  return trends[key] || { value: 0, isPositive: true };
};

export const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  if (!stats) return null;

  const StatCard = ({
    title,
    value,
    icon: Icon,
    iconBgColor,
    iconColor,
    trend,
    valueColor = 'text-gray-900',
  }: {
    title: string;
    value: string | number;
    icon: React.ElementType;
    iconBgColor: string;
    iconColor: string;
    trend?: { value: number; isPositive: boolean };
    valueColor?: string;
  }) => {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200 overflow-hidden">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-500 mb-2 truncate">{title}</p>
            <p className={`text-3xl font-bold ${valueColor} mb-2 break-words`}>{value}</p>
            {trend && (
              <div className="flex items-center gap-1 flex-wrap">
                {trend.isPositive ? (
                  <TrendingUp className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500 flex-shrink-0" />
                )}
                <span
                  className={`text-xs font-semibold ${
                    trend.isPositive ? 'text-emerald-600' : 'text-red-600'
                  }`}
                >
                  {Math.abs(trend.value)}% vs last month
                </span>
              </div>
            )}
          </div>
          <div className={`${iconBgColor} p-3 rounded-xl flex-shrink-0`}>
            <Icon className={`h-6 w-6 ${iconColor}`} />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 ${
        stats.campaigns.rejected !== undefined ? 'lg:grid-cols-5' : 'lg:grid-cols-4'
      } gap-6 mb-8`}
    >
      <StatCard
        title="Total Users"
        value={stats.users.total}
        icon={Users}
        iconBgColor="bg-blue-100"
        iconColor="text-blue-600"
        trend={getTrendData('users')}
      />

      <StatCard
        title="Total Campaigns"
        value={stats.campaigns.total}
        icon={Megaphone}
        iconBgColor="bg-emerald-100"
        iconColor="text-emerald-600"
        trend={getTrendData('campaigns')}
      />

      <StatCard
        title="Total Donations"
        value={`${CURRENCY_SYMBOL}${stats.donations.totalAmount.toLocaleString('en-IN')}`}
        icon={Coins}
        iconBgColor="bg-amber-100"
        iconColor="text-amber-600"
        trend={getTrendData('donations')}
      />

      <StatCard
        title="Pending Reviews"
        value={stats.campaigns.pending}
        icon={Clock}
        iconBgColor="bg-yellow-100"
        iconColor="text-yellow-600"
        trend={getTrendData('pending')}
      />

      {stats.campaigns.rejected !== undefined && (
        <StatCard
          title="Rejected Campaigns"
          value={stats.campaigns.rejected}
          icon={X}
          iconBgColor="bg-red-100"
          iconColor="text-red-600"
          valueColor="text-red-600"
          trend={getTrendData('rejected')}
        />
      )}
    </div>
  );
};

