import React from 'react';

interface TabNavigationProps {
  activeTab: 'donations' | 'campaigns';
  onTabChange: (tab: 'donations' | 'campaigns') => void;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="flex gap-2 mb-6 border-b border-gray-200">
      <button
        onClick={() => onTabChange('donations')}
        className={`px-4 py-2 font-medium ${
          activeTab === 'donations'
            ? 'text-primary-600 border-b-2 border-primary-600'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        My Donations
      </button>
      <button
        onClick={() => onTabChange('campaigns')}
        className={`px-4 py-2 font-medium ${
          activeTab === 'campaigns'
            ? 'text-primary-600 border-b-2 border-primary-600'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        My Campaigns
      </button>
    </div>
  );
};

