import React from 'react';
import { Shimmer } from './Shimmer';

interface ShimmerCampaignsPageProps {
  animationType?: 'default' | 'wave' | 'pulse' | 'glow' | 'fade' | 'slide';
}

export const ShimmerCampaignsPage: React.FC<ShimmerCampaignsPageProps> = ({
  animationType = 'pulse',
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 py-4 sm:py-6 md:py-8 pb-20 sm:pb-24 md:pb-12">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8 md:mb-10">
          <Shimmer className="h-8 sm:h-10 md:h-12 w-64 sm:w-80 md:w-96 rounded mb-2 sm:mb-3" animationType={animationType} />
          <Shimmer className="h-4 sm:h-5 w-48 sm:w-64 rounded" animationType={animationType} />
        </div>

        {/* Filters & Search Section */}
        <div className="bg-white/80 backdrop-blur-xl p-4 sm:p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100/50 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Shimmer className="h-11 sm:h-12 flex-1 rounded-xl" animationType={animationType} />
            <Shimmer className="h-11 sm:h-12 w-full sm:w-auto sm:min-w-[180px] rounded-xl" animationType={animationType} />
          </div>
        </div>

        {/* Campaigns Grid - Exact match: grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
            >
              {/* Image */}
              <Shimmer className="h-48 sm:h-56 md:h-64 w-full rounded-none" variant="bright" animationType={animationType} />
              
              {/* Content */}
              <div className="p-4 sm:p-5 md:p-6">
                {/* Category and Status badges */}
                <div className="flex items-center justify-between mb-3">
                  <Shimmer className="h-5 w-20 rounded-full" animationType={animationType} />
                  <Shimmer className="h-5 w-16 rounded-full" animationType={animationType} />
                </div>
                
                {/* Title */}
                <Shimmer className="h-5 sm:h-6 w-full rounded mb-2" animationType={animationType} />
                <Shimmer className="h-5 sm:h-6 w-3/4 rounded mb-4" animationType={animationType} />
                
                {/* Progress bar */}
                <Shimmer className="h-2 w-full rounded-full mb-2" animationType={animationType} />
                
                {/* Amount info */}
                <div className="flex items-center justify-between mt-4">
                  <Shimmer className="h-4 w-24 rounded" animationType={animationType} />
                  <Shimmer className="h-4 w-20 rounded" animationType={animationType} />
                </div>
                
                {/* Donate button */}
                <Shimmer className="h-11 sm:h-12 w-full rounded-xl mt-4" variant="bright" animationType={animationType} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

