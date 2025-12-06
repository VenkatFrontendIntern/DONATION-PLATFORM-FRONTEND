import React from 'react';
import { ShimmerGrid } from './ui/Shimmer';

const LoadingFallback: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ShimmerGrid items={6} columns={3} />
      </div>
    </div>
  );
};

export default LoadingFallback;

