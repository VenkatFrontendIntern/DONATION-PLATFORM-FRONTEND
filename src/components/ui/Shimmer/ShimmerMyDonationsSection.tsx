import React from 'react';
import { Shimmer } from './Shimmer';

interface ShimmerMyDonationsSectionProps {
  animationType?: 'default' | 'wave' | 'pulse' | 'glow' | 'fade' | 'slide';
}

export const ShimmerMyDonationsSection: React.FC<ShimmerMyDonationsSectionProps> = ({
  animationType = 'glow',
}) => {
  return (
    <div className="divide-y divide-gray-100">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          {/* Left side - Campaign info */}
          <div className="flex-1">
            <Shimmer className="h-5 w-3/4 rounded mb-2" animationType={animationType} />
            <div className="flex items-center gap-4">
              <Shimmer className="h-4 w-24 rounded" animationType={animationType} />
              <Shimmer className="h-4 w-16 rounded-full" animationType={animationType} />
            </div>
          </div>
          
          {/* Right side - Amount and button */}
          <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
            <Shimmer className="h-6 w-24 rounded" animationType={animationType} />
            <Shimmer className="h-10 w-32 rounded-lg" animationType={animationType} />
          </div>
        </div>
      ))}
    </div>
  );
};
