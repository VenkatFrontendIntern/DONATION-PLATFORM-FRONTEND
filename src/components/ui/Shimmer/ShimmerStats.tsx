import React from 'react';
import { cn } from '../../../utils/cn';
import { Shimmer } from './Shimmer';

interface ShimmerStatsProps {
  count?: number;
  className?: string;
  animationType?: 'default' | 'wave' | 'pulse' | 'glow' | 'fade' | 'slide';
}

export const ShimmerStats: React.FC<ShimmerStatsProps> = ({
  count = 4,
  className,
  animationType = 'default',
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
          <Shimmer className="h-4 w-20 rounded mb-3" animationType={animationType} />
          <Shimmer className="h-8 w-24 rounded mb-2" variant="bright" animationType={animationType} />
          <Shimmer className="h-3 w-16 rounded" animationType={animationType} />
        </div>
      ))}
    </div>
  );
};

