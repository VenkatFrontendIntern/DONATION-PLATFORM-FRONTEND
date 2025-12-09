import React from 'react';

interface CampaignTableHeaderProps {
  showActions: boolean;
  isRejected: boolean;
}

export const CampaignTableHeader: React.FC<CampaignTableHeaderProps> = ({
  showActions,
  isRejected,
}) => {
  return (
    <thead className="bg-gray-50/80 border-b-2 border-gray-200">
      <tr>
        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
          Campaign
        </th>
        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
          Organizer
        </th>
        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
          Goal
        </th>
        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
          Date
        </th>
        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
          Status
        </th>
        {(showActions || isRejected) && (
          <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
            Actions
          </th>
        )}
        {isRejected && (
          <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
            Rejection Reason
          </th>
        )}
      </tr>
    </thead>
  );
};

