import React from 'react';
import { Shimmer } from './Shimmer';

interface ShimmerAdminDashboardProps {
  animationType?: 'default' | 'wave' | 'pulse' | 'glow' | 'fade' | 'slide';
  statsCount?: 4 | 5; // Number of stats cards (4 or 5)
}

export const ShimmerAdminDashboard: React.FC<ShimmerAdminDashboardProps> = ({
  animationType = 'glow',
  statsCount = 5,
}) => {
  return (
    <div className="min-h-screen bg-gray-50 py-8 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <Shimmer className="h-8 w-48 rounded mb-2" animationType={animationType} />
            <Shimmer className="h-4 w-32 rounded" animationType={animationType} />
          </div>
        </div>

        {/* Stats Cards Grid - Responsive: 1 col mobile, 2 cols md, 4-5 cols lg */}
        <div
          className={`grid grid-cols-1 md:grid-cols-2 ${
            statsCount === 5 ? 'lg:grid-cols-5' : 'lg:grid-cols-4'
          } gap-6 mb-8`}
        >
          {Array.from({ length: statsCount }).map((_, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Shimmer className="h-4 w-20 rounded mb-1" animationType={animationType} />
                  <Shimmer className="h-8 w-24 rounded" animationType={animationType} />
                </div>
                <Shimmer className="h-8 w-8 rounded" animationType={animationType} />
              </div>
            </div>
          ))}
        </div>

        {/* Category Management Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <div className="flex-1">
              <Shimmer className="h-6 w-40 rounded mb-2" animationType={animationType} />
              <Shimmer className="h-4 w-48 rounded" animationType={animationType} />
            </div>
            <Shimmer className="h-10 w-32 rounded-lg" animationType={animationType} />
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Shimmer className="h-6 w-6 rounded" animationType={animationType} />
                        <Shimmer className="h-5 w-24 rounded" animationType={animationType} />
                      </div>
                      <Shimmer className="h-4 w-full rounded" animationType={animationType} />
                    </div>
                    <Shimmer className="h-5 w-5 rounded" animationType={animationType} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Admin Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <div className="-mb-px flex space-x-8 overflow-x-auto">
              {[1, 2, 3, 4].map((i) => (
                <Shimmer
                  key={i}
                  className="h-12 w-32 sm:w-40 rounded-t"
                  animationType={animationType}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Content Area - Pending Campaigns List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <Shimmer className="h-6 w-48 rounded" animationType={animationType} />
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden"
                >
                  {/* Image placeholder */}
                  <Shimmer className="h-48 w-full rounded-none" variant="bright" animationType={animationType} />
                  <div className="p-5">
                    {/* Title and organizer */}
                    <div className="mb-3">
                      <Shimmer className="h-5 w-full rounded mb-2" animationType={animationType} />
                      <Shimmer className="h-4 w-32 rounded" animationType={animationType} />
                    </div>
                    {/* Description */}
                    <Shimmer className="h-4 w-full rounded mb-2" animationType={animationType} />
                    <Shimmer className="h-4 w-3/4 rounded mb-4" animationType={animationType} />
                    {/* Goal amount box */}
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <Shimmer className="h-3 w-20 rounded mb-1" animationType={animationType} />
                      <Shimmer className="h-5 w-32 rounded" animationType={animationType} />
                    </div>
                    {/* Action buttons */}
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Shimmer className="h-9 flex-1 rounded" animationType={animationType} />
                        <Shimmer className="h-9 flex-1 rounded" animationType={animationType} />
                      </div>
                      <Shimmer className="h-9 w-full rounded" animationType={animationType} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

