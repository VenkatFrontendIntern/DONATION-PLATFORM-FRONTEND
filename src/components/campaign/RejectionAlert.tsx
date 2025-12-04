import React from 'react';
import { AlertCircle } from 'lucide-react';

interface RejectionAlertProps {
  reason: string;
}

export const RejectionAlert: React.FC<RejectionAlertProps> = ({ reason }) => {
  return (
    <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-red-900 mb-1">Campaign Rejected</h3>
          <p className="text-sm text-red-700 leading-relaxed">{reason}</p>
        </div>
      </div>
    </div>
  );
};

