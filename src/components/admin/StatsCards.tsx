import React from 'react';
import { motion } from 'framer-motion';
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
    users: { value: 12.5, isPositive: true },
    campaigns: { value: 8.3, isPositive: true },
    donations: { value: 24.7, isPositive: true },
    pending: { value: -5.2, isPositive: false },
    rejected: { value: 2.1, isPositive: false },
  };
  return trends[key] || { value: 0, isPositive: true };
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
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
    index,
  }: {
    title: string;
    value: string | number;
    icon: React.ElementType;
    iconBgColor: string;
    iconColor: string;
    trend?: { value: number; isPositive: boolean };
    valueColor?: string;
    index: number;
  }) => {
    return (
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="group relative bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md hover:border-emerald-100 transition-all duration-300 overflow-hidden"
      >
        {/* Subtle gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="relative flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-500 mb-3 truncate">{title}</p>
            <p className={`text-3xl font-bold ${valueColor} mb-3 break-words`}>{value}</p>
            {trend && (
              <div className="flex items-center gap-1.5 flex-wrap">
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
                  {trend.isPositive ? '+' : ''}{trend.value.toFixed(1)}% vs last month
                </span>
              </div>
            )}
          </div>
          <div className={`${iconBgColor} p-3.5 rounded-xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
            <Icon className={`h-6 w-6 ${iconColor}`} />
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
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
        index={0}
      />

      <StatCard
        title="Total Campaigns"
        value={stats.campaigns.total}
        icon={Megaphone}
        iconBgColor="bg-emerald-100"
        iconColor="text-emerald-600"
        trend={getTrendData('campaigns')}
        index={1}
      />

      <StatCard
        title="Total Donations"
        value={`${CURRENCY_SYMBOL}${stats.donations.totalAmount.toLocaleString('en-IN')}`}
        icon={Coins}
        iconBgColor="bg-amber-100"
        iconColor="text-amber-600"
        trend={getTrendData('donations')}
        index={2}
      />

      <StatCard
        title="Pending Reviews"
        value={stats.campaigns.pending}
        icon={Clock}
        iconBgColor="bg-yellow-100"
        iconColor="text-yellow-600"
        trend={getTrendData('pending')}
        index={3}
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
          index={4}
        />
      )}
    </motion.div>
  );
};

