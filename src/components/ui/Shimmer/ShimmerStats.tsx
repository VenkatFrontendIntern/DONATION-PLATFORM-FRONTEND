import React from 'react';
import { cn } from '../../../utils/cn';
import { Shimmer } from './Shimmer';

interface ShimmerStatsProps {
  count?: number;
  className?: string;
}

export const ShimmerStats: React.FC<ShimmerStatsProps> = ({
  count = 4,
  className,
}) => {
  return (
    <div className={cn('grid grid-cols-2 md:grid-cols-4 gap-4', className)}>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-xl p-4 sm:p-6 border border-gray-100 shadow-sm animate-shimmer-card-fade"
          style={{
            animationDelay: `${index * 0.08}s`,
          }}
        >
          <Shimmer className="h-4 w-20 rounded mb-3" />
          <Shimmer className="h-8 w-24 rounded mb-2" variant="bright" />
          <Shimmer className="h-3 w-16 rounded" />
        </div>
      ))}
    </div>
  );
};

