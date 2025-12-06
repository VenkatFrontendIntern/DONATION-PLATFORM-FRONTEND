import React from 'react';
import { Shimmer } from './Shimmer';

interface ShimmerPendingCampaignsGridProps {
  animationType?: 'default' | 'wave' | 'pulse' | 'glow' | 'fade' | 'slide';
  items?: number;
}

export const ShimmerPendingCampaignsGrid: React.FC<ShimmerPendingCampaignsGridProps> = ({
  animationType = 'glow',
  items = 3,
}) => {
  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: items }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden"
          >
            {/* Campaign Image */}
            <div className="relative h-48 w-full overflow-hidden">
              <Shimmer className="h-48 w-full rounded-none" variant="bright" animationType={animationType} />
              {/* Status Badge placeholder */}
              <div className="absolute top-3 right-3">
                <Shimmer className="h-6 w-16 rounded-full" animationType={animationType} />
              </div>
              {/* Category Badge placeholder */}
              <div className="absolute top-3 left-3">
                <Shimmer className="h-6 w-20 rounded-full" animationType={animationType} />
              </div>
            </div>

            {/* Campaign Content */}
            <div className="p-5">
              {/* Title and Organizer */}
              <div className="mb-3">
                <Shimmer className="h-5 w-full rounded mb-2" animationType={animationType} />
                <Shimmer className="h-4 w-32 rounded" animationType={animationType} />
              </div>

              {/* Description */}
              <Shimmer className="h-4 w-full rounded mb-2" animationType={animationType} />
              <Shimmer className="h-4 w-3/4 rounded mb-4" animationType={animationType} />

              {/* Goal Amount box */}
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <Shimmer className="h-3 w-20 rounded mb-1" animationType={animationType} />
                <Shimmer className="h-5 w-32 rounded" animationType={animationType} />
              </div>

              {/* Action Buttons */}
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
  );
};
