import React from 'react';

interface AdminTabsProps {
  activeTab: 'pending' | 'rejected' | 'my-campaigns' | 'my-donations' | 'newsletter';
  onTabChange: (tab: 'pending' | 'rejected' | 'my-campaigns' | 'my-donations' | 'newsletter') => void;
  pendingCount?: number;
  rejectedCount?: number;
  myCampaignsCount?: number;
  myDonationsCount?: number;
}

export const AdminTabs: React.FC<AdminTabsProps> = ({
  activeTab,
  onTabChange,
  pendingCount = 0,
  rejectedCount = 0,
  myCampaignsCount = 0,
  myDonationsCount = 0,
}) => {
  return (
    <div className="mb-6">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          <button
            onClick={() => onTabChange('pending')}
            className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
              activeTab === 'pending'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Pending Campaigns
            {pendingCount > 0 && (
              <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                {pendingCount}
              </span>
            )}
          </button>
          <button
            onClick={() => onTabChange('rejected')}
            className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
              activeTab === 'rejected'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Rejected Campaigns
            {rejectedCount > 0 && (
              <span className="ml-2 bg-red-100 text-red-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                {rejectedCount}
              </span>
            )}
          </button>
          <button
            onClick={() => onTabChange('my-campaigns')}
            className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
              activeTab === 'my-campaigns'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            My Campaigns
            {myCampaignsCount > 0 && (
              <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                {myCampaignsCount}
              </span>
            )}
          </button>
          <button
            onClick={() => onTabChange('my-donations')}
            className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
              activeTab === 'my-donations'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            My Donations
            {myDonationsCount > 0 && (
              <span className="ml-2 bg-green-100 text-green-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                {myDonationsCount}
              </span>
            )}
          </button>
          <button
            onClick={() => onTabChange('newsletter')}
            className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
              activeTab === 'newsletter'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Newsletter
          </button>
        </nav>
      </div>
    </div>
  );
};

