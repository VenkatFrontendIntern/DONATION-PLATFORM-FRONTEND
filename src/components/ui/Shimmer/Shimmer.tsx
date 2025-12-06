import React from 'react';
import { cn } from '../../../utils/cn';

interface ShimmerProps {
  className?: string;
  variant?: 'default' | 'subtle' | 'bright';
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
}

export const Shimmer: React.FC<ShimmerProps> = ({
  className,
  variant = 'default',
  rounded = 'md',
}) => {
  const roundedClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  };

  const variantClasses = {
    default: 'bg-gradient-to-r from-gray-200 via-gray-50 to-gray-200',
    subtle: 'bg-gradient-to-r from-gray-100 via-white to-gray-100',
    bright: 'bg-gradient-to-r from-gray-300 via-gray-100 to-gray-300',
  };

  return (
    <div
      className={cn(
        'relative overflow-hidden',
        variantClasses[variant],
        roundedClasses[rounded],
        className
      )}
    >
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/90 to-transparent" />
      
      <div 
        className="absolute inset-0 -translate-x-full animate-shimmer-delayed bg-gradient-to-r from-transparent via-white/50 to-transparent"
        style={{ animationDelay: '0.5s' }}
      />
      
      <div 
        className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-blue-50/20 to-transparent"
        style={{ animationDelay: '1s', animationDuration: '3s' }}
      />
      
      <div className="absolute inset-0 animate-shimmer-pulse opacity-20" />
    </div>
  );
};

