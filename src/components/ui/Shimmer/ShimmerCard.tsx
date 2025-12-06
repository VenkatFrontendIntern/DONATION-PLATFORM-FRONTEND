import React from 'react';
import { cn } from '../../../utils/cn';
import { Shimmer } from './Shimmer';
import { ShimmerText } from './ShimmerText';

interface ShimmerCardProps {
  className?: string;
  showImage?: boolean;
  showProgress?: boolean;
  animationType?: 'default' | 'wave' | 'pulse' | 'glow' | 'fade' | 'slide';
}

export const ShimmerCard: React.FC<ShimmerCardProps> = ({
  className,
  showImage = true,
  showProgress = true,
  animationType = 'default',
}) => {
  return (
    <div
      className={cn(
        'bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full',
        'animate-shimmer-card',
        className
      )}
    >
      {showImage && (
        <Shimmer className="h-48 sm:h-56 md:h-64 w-full rounded-none" variant="bright" animationType={animationType} />
      )}

      <div className="p-4 sm:p-5 md:p-6 flex-1 flex flex-col">
        <ShimmerText lines={2} lineHeight="lg" className="mb-3" animationType={animationType} />

        <ShimmerText lines={2} lineHeight="md" className="mb-4 flex-1" animationType={animationType} />

        {showProgress && (
          <div className="mb-4 space-y-2">
            <div className="flex items-center justify-between">
              <Shimmer className="h-4 w-24 rounded" animationType={animationType} />
              <Shimmer className="h-4 w-12 rounded" animationType={animationType} />
            </div>
            <Shimmer className="h-2 w-full rounded-full" animationType={animationType} />
            <Shimmer className="h-3 w-32 rounded" animationType={animationType} />
          </div>
        )}

        <Shimmer className="h-12 w-full rounded-xl sm:rounded-2xl mt-auto" variant="bright" animationType={animationType} />
      </div>
    </div>
  );
};

