import React from 'react';
import { Shimmer } from './Shimmer';

interface ShimmerPendingCampaignListProps {
  animationType?: 'default' | 'wave' | 'pulse' | 'glow' | 'fade' | 'slide';
  items?: number;
}

export const ShimmerPendingCampaignList: React.FC<ShimmerPendingCampaignListProps> = ({
  animationType = 'glow',
  items = 5,
}) => {
  return (
    <div className="min-h-screen bg-gray-50 py-8 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section with Back Button */}
        <div className="flex items-center gap-4 mb-6">
          <Shimmer className="h-10 w-32 rounded-lg" animationType={animationType} />
          <div>
            <Shimmer className="h-8 w-64 rounded mb-2" animationType={animationType} />
            <Shimmer className="h-4 w-48 rounded" animationType={animationType} />
          </div>
        </div>

        {/* Pending Campaigns Card Container */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Card Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shimmer className="h-5 w-5 rounded" animationType={animationType} />
                <Shimmer className="h-6 w-48 rounded" animationType={animationType} />
              </div>
              <Shimmer className="h-6 w-20 rounded-full" animationType={animationType} />
            </div>
          </div>

          {/* Campaign List */}
          <div className="divide-y">
            {Array.from({ length: items }).map((_, i) => (
              <div key={i} className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Image - Full width on mobile, fixed width on desktop */}
                  <Shimmer
                    className="w-full md:w-32 h-32 rounded-lg flex-shrink-0"
                    variant="bright"
                    animationType={animationType}
                  />

                  {/* Content Section */}
                  <div className="flex-1">
                    {/* Title and Status Badge */}
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <Shimmer className="h-6 w-3/4 rounded" animationType={animationType} />
                      <Shimmer className="h-5 w-16 rounded-full flex-shrink-0" animationType={animationType} />
                    </div>

                    {/* Description */}
                    <Shimmer className="h-4 w-full rounded mb-2" animationType={animationType} />
                    <Shimmer className="h-4 w-5/6 rounded mb-4" animationType={animationType} />

                    {/* Metadata Row */}
                    <div className="flex flex-wrap gap-4 mb-4">
                      <Shimmer className="h-4 w-24 rounded" animationType={animationType} />
                      <Shimmer className="h-4 w-28 rounded" animationType={animationType} />
                      <Shimmer className="h-4 w-20 rounded" animationType={animationType} />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2">
                      <Shimmer className="h-10 w-24 rounded" animationType={animationType} />
                      <Shimmer className="h-10 w-24 rounded" animationType={animationType} />
                      <Shimmer className="h-10 w-28 rounded" animationType={animationType} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

