import React from 'react';
import { Shimmer } from './Shimmer';

interface ShimmerMyCampaignsSectionProps {
  animationType?: 'default' | 'wave' | 'pulse' | 'glow' | 'fade' | 'slide';
}

export const ShimmerMyCampaignsSection: React.FC<ShimmerMyCampaignsSectionProps> = ({
  animationType = 'glow',
}) => {
  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden relative"
          >
            {/* Image */}
            <Shimmer className="h-48 w-full rounded-none" variant="bright" animationType={animationType} />
            
            {/* Content */}
            <div className="p-4">
              {/* Category and Status badges */}
              <div className="flex items-center justify-between mb-2">
                <Shimmer className="h-5 w-16 rounded" animationType={animationType} />
                <Shimmer className="h-5 w-14 rounded" animationType={animationType} />
              </div>
              
              {/* Title */}
              <Shimmer className="h-5 w-full rounded mb-2" animationType={animationType} />
              
              {/* Amount info */}
              <Shimmer className="h-4 w-32 rounded" animationType={animationType} />
            </div>
            
            {/* Delete button placeholder */}
            <div className="absolute top-4 right-4">
              <Shimmer className="h-8 w-8 rounded-lg" animationType={animationType} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
