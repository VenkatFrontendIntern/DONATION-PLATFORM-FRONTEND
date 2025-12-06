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
    <div className="flex gap-1 sm:gap-2 mb-4 sm:mb-6 border-b border-gray-200 overflow-x-auto no-scrollbar">
      <button
        onClick={() => onTabChange('donations')}
        className={`px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base font-medium transition-colors touch-manipulation min-h-[44px] flex items-center whitespace-nowrap ${
          activeTab === 'donations'
            ? 'text-primary-600 border-b-2 border-primary-600'
            : 'text-gray-500 active:text-gray-700'
        }`}
      >
        My Donations
      </button>
      <button
        onClick={() => onTabChange('campaigns')}
        className={`px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base font-medium transition-colors touch-manipulation min-h-[44px] flex items-center whitespace-nowrap ${
          activeTab === 'campaigns'
            ? 'text-primary-600 border-b-2 border-primary-600'
            : 'text-gray-500 active:text-gray-700'
        }`}
      >
        My Campaigns
      </button>
    </div>
  );
};

