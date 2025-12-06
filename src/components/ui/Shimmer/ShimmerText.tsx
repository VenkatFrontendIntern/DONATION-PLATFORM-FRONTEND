import React from 'react';
import { cn } from '../../../utils/cn';
import { Shimmer } from './Shimmer';

interface ShimmerTextProps {
  lines?: number;
  className?: string;
  lineHeight?: 'sm' | 'md' | 'lg';
  widths?: string[];
}

export const ShimmerText: React.FC<ShimmerTextProps> = ({
  lines = 1,
  className,
  lineHeight = 'md',
  widths = [],
}) => {
  const heightClasses = {
    sm: 'h-3',
    md: 'h-4',
    lg: 'h-5',
  };

  const defaultWidths = ['100%', '90%', '95%', '85%', '100%'];
  const lineWidths = widths.length > 0 ? widths : defaultWidths;

  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, index) => {
        const isLastLine = index === lines - 1;
        const width = isLastLine ? '75%' : lineWidths[index % lineWidths.length];
        
        return (
          <div key={index} style={{ width } as React.CSSProperties}>
            <Shimmer
              className={heightClasses[lineHeight]}
            />
          </div>
        );
      })}
    </div>
  );
};

