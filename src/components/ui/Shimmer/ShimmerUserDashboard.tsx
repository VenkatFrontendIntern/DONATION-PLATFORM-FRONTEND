import React from 'react';
import { Shimmer } from './Shimmer';

interface ShimmerUserDashboardProps {
  animationType?: 'default' | 'wave' | 'pulse' | 'glow' | 'fade' | 'slide';
}

export const ShimmerUserDashboard: React.FC<ShimmerUserDashboardProps> = ({
  animationType = 'wave',
}) => {
  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 md:py-8 pb-20 sm:pb-24">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
          <Shimmer className="h-7 sm:h-8 md:h-9 w-40 sm:w-48 rounded" animationType={animationType} />
          <Shimmer className="h-11 sm:h-12 w-full sm:w-auto sm:min-w-[160px] rounded-lg" animationType={animationType} />
        </div>

        {/* Stats Cards - 3 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white p-4 sm:p-5 md:p-6 rounded-lg sm:rounded-xl shadow-sm border border-gray-100"
            >
              <Shimmer className="h-3 sm:h-4 w-24 sm:w-28 rounded mb-1.5 sm:mb-2" animationType={animationType} />
              <Shimmer className="h-8 sm:h-10 md:h-12 w-32 sm:w-36 md:w-40 rounded" animationType={animationType} />
            </div>
          ))}
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 sm:gap-2 mb-4 sm:mb-6 border-b border-gray-200">
          <Shimmer className="h-11 sm:h-12 w-32 sm:w-36 rounded-t" animationType={animationType} />
          <Shimmer className="h-11 sm:h-12 w-32 sm:w-36 rounded-t" animationType={animationType} />
        </div>

        {/* Donations/Campaigns List */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="divide-y divide-gray-100">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="p-3 sm:p-4 md:p-6 flex flex-col gap-3 sm:gap-4"
              >
                {/* Title and metadata row */}
                <div className="flex-1 min-w-0">
                  <Shimmer className="h-4 sm:h-5 w-3/4 sm:w-2/3 rounded mb-2" animationType={animationType} />
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <Shimmer className="h-3 sm:h-4 w-20 sm:w-24 rounded" animationType={animationType} />
                    <Shimmer className="h-3 sm:h-4 w-16 sm:w-20 rounded-full" animationType={animationType} />
                  </div>
                </div>

                {/* Amount and button row */}
                <div className="flex items-center justify-between gap-3 sm:gap-4 pt-2 border-t border-gray-100 sm:border-t-0">
                  <Shimmer className="h-5 sm:h-6 md:h-7 w-24 sm:w-32 rounded" animationType={animationType} />
                  <Shimmer className="h-10 sm:h-11 w-28 sm:w-36 rounded-lg" animationType={animationType} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

