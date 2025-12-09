import React from 'react';
import { Shimmer } from '../ui/Shimmer';

export const CampaignTableLoading: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <Shimmer className="h-6 w-48 rounded" animationType="glow" />
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-4">
              <Shimmer className="h-16 w-16 rounded-lg" animationType="glow" />
              <div className="flex-1 space-y-2">
                <Shimmer className="h-4 w-3/4 rounded" animationType="glow" />
                <Shimmer className="h-3 w-1/2 rounded" animationType="glow" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

