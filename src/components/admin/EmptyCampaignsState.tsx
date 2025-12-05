import React from 'react';
import { AlertCircle } from 'lucide-react';

interface EmptyCampaignsStateProps {
  isRejected: boolean;
}

export const EmptyCampaignsState: React.FC<EmptyCampaignsStateProps> = ({
  isRejected,
}) => {
  return (
    <div className="p-12 text-center">
      <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
      <p className="text-gray-500">
        {isRejected ? 'No rejected campaigns' : 'No pending campaigns to review'}
      </p>
    </div>
  );
};

