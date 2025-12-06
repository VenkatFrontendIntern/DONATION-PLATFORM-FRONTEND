import React from 'react';
import { cn } from '../../../utils/cn';
import { ShimmerCard } from './ShimmerCard';

interface ShimmerGridProps {
  items?: number;
  columns?: number;
  className?: string;
  showImage?: boolean;
  showProgress?: boolean;
}

export const ShimmerGrid: React.FC<ShimmerGridProps> = ({
  items = 6,
  columns = 3,
  className,
  showImage = true,
  showProgress = true,
}) => {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={cn('grid gap-6 sm:gap-8', gridCols[columns as keyof typeof gridCols] || gridCols[3], className)}>
      {Array.from({ length: items }).map((_, index) => (
        <div
          key={index}
          style={{
            animationDelay: `${index * 0.1}s`,
          }}
          className="animate-shimmer-card-fade"
        >
          <ShimmerCard
            showImage={showImage}
            showProgress={showProgress}
          />
        </div>
      ))}
    </div>
  );
};

