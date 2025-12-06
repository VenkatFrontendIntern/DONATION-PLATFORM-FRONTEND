import React from 'react';
import { cn } from '../../../utils/cn';
import { Shimmer } from './Shimmer';

interface ShimmerListProps {
  items?: number;
  className?: string;
  itemHeight?: string;
}

export const ShimmerList: React.FC<ShimmerListProps> = ({
  items = 3,
  className,
  itemHeight = 'h-16',
}) => {
  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: items }).map((_, index) => (
        <div
          key={index}
          className={cn(
            'flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-100',
            'animate-shimmer-card-fade',
            itemHeight
          )}
          style={{
            animationDelay: `${index * 0.1}s`,
          }}
        >
          <Shimmer className="h-12 w-12 rounded-full flex-shrink-0" variant="bright" />
          <div className="flex-1 space-y-2">
            <Shimmer className="h-4 w-3/4 rounded" />
            <Shimmer className="h-3 w-1/2 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
};

