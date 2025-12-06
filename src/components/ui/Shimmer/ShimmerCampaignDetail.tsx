import React from 'react';
import { Shimmer } from './Shimmer';
import { ShimmerText } from './ShimmerText';
import { ShimmerList } from './ShimmerList';

export const ShimmerCampaignDetail: React.FC = () => {
  return (
    <div className="bg-gray-50 min-h-screen pb-24 md:pb-12">
      <div className="max-w-5xl mx-auto md:py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden animate-shimmer-card-fade">
              <Shimmer className="h-64 md:h-96 w-full rounded-none" variant="bright" />
              <div className="p-6">
                <ShimmerText lines={2} lineHeight="lg" className="mb-4" />
                <Shimmer className="h-4 w-24 rounded mb-4" />
                <ShimmerText lines={4} lineHeight="md" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 animate-shimmer-card-fade" style={{ animationDelay: '0.1s' }}>
              <Shimmer className="h-16 w-16 rounded-full mb-4" variant="bright" />
              <ShimmerText lines={2} lineHeight="md" />
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 animate-shimmer-card-fade" style={{ animationDelay: '0.2s' }}>
              <Shimmer className="h-6 w-32 rounded mb-4" />
              <ShimmerList items={3} />
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8 animate-shimmer-card-fade" style={{ animationDelay: '0.15s' }}>
              <ShimmerText lines={1} lineHeight="lg" className="mb-6" />
              <Shimmer className="h-12 w-full rounded mb-4" variant="bright" />
              <Shimmer className="h-2 w-full rounded-full mb-4" />
              <ShimmerText lines={2} lineHeight="sm" className="mb-6" />
              <Shimmer className="h-12 w-full rounded-xl" variant="bright" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

