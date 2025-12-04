import React from 'react';
import { motion } from 'framer-motion';
import { CURRENCY_SYMBOL } from '../../constants';

interface ProgressBarProps {
  goal: number;
  raised: number;
  showLabels?: boolean;
  size?: 'sm' | 'md';
  animateOnMount?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ 
  goal, 
  raised, 
  showLabels = true,
  size = 'md',
  animateOnMount = true
}) => {
  const percentage = Math.min(Math.round((raised / goal) * 100), 100);

  return (
    <div className="w-full">
      {showLabels && (
        <div className="flex justify-between text-sm mb-2 font-semibold">
          <span className="text-primary-700">{CURRENCY_SYMBOL}{raised.toLocaleString()} raised</span>
          <span className="text-gray-600">{Math.round((raised/goal)*100)}%</span>
        </div>
      )}
      <div className={`w-full bg-gray-200/60 rounded-full overflow-hidden ${size === 'sm' ? 'h-2.5' : 'h-3.5'}`}>
        <motion.div 
          className="bg-gradient-to-r from-primary-500 to-primary-600 h-full rounded-full shadow-lg shadow-primary-500/30"
          initial={animateOnMount ? { width: 0 } : { width: `${percentage}%` }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
        />
      </div>
      {showLabels && (
        <div className="mt-1.5 text-xs text-gray-500 text-right font-medium">
          Goal: {CURRENCY_SYMBOL}{goal.toLocaleString()}
        </div>
      )}
    </div>
  );
};
