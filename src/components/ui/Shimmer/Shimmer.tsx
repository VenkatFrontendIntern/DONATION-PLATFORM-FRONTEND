import React from 'react';
import { cn } from '../../../utils/cn';

interface ShimmerProps {
  className?: string;
  variant?: 'default' | 'subtle' | 'bright';
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  animationType?: 'default' | 'wave' | 'pulse' | 'glow' | 'fade' | 'slide';
}

export const Shimmer: React.FC<ShimmerProps> = ({
  className,
  variant = 'default',
  rounded = 'md',
  animationType = 'default',
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

  const getAnimationClasses = () => {
    switch (animationType) {
      case 'wave':
        return (
          <>
            <div className="absolute inset-0 -translate-y-full animate-shimmer-wave bg-gradient-to-b from-transparent via-white/90 to-transparent" />
            <div 
              className="absolute inset-0 -translate-y-full animate-shimmer-wave bg-gradient-to-b from-transparent via-white/50 to-transparent"
              style={{ animationDelay: '0.5s' }}
            />
          </>
        );
      case 'pulse':
        return (
          <div className="absolute inset-0 animate-shimmer-pulse-strong bg-gradient-to-r from-transparent via-white/80 to-transparent" />
        );
      case 'glow':
        return (
          <>
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer-glow" />
            <div 
              className="absolute inset-0 -translate-x-full animate-shimmer-delayed bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer-glow"
              style={{ animationDelay: '0.5s' }}
            />
          </>
        );
      case 'fade':
        return (
          <div className="absolute inset-0 animate-shimmer-fade bg-gradient-to-r from-transparent via-white/70 to-transparent" />
        );
      case 'slide':
        return (
          <>
            <div className="absolute inset-0 -translate-x-full animate-shimmer-slide bg-gradient-to-r from-transparent via-white/95 to-transparent" />
            <div 
              className="absolute inset-0 -translate-x-full animate-shimmer-slide bg-gradient-to-r from-transparent via-white/60 to-transparent"
              style={{ animationDelay: '0.4s' }}
            />
          </>
        );
      default:
        return (
          <>
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/90 to-transparent" />
            <div 
              className="absolute inset-0 -translate-x-full animate-shimmer-delayed bg-gradient-to-r from-transparent via-white/50 to-transparent"
              style={{ animationDelay: '0.5s' }}
            />
            <div className="absolute inset-0 animate-shimmer-pulse opacity-20" />
          </>
        );
    }
  };

  return (
    <div
      className={cn(
        'relative overflow-hidden',
        variantClasses[variant],
        roundedClasses[rounded],
        animationType === 'glow' && 'animate-shimmer-glow',
        className
      )}
    >
      {getAnimationClasses()}
    </div>
  );
};

