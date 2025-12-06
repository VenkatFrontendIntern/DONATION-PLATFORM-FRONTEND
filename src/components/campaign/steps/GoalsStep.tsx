import React from 'react';
import { motion } from 'framer-motion';
import { Input } from '../../ui/Input';
import { Target } from 'lucide-react';
import { CURRENCY_SYMBOL } from '../../../constants';

interface StepProps {
  currentStep: number;
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const GoalsStep: React.FC<StepProps> = ({
  currentStep,
  formData,
  handleChange,
}) => {
  if (currentStep !== 3) return null;

  return (
    <motion.div
      key="step3"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl sm:rounded-2xl shadow-lg shadow-gray-200/50 p-4 sm:p-6 md:p-8 border border-gray-100"
    >
      <div className="flex items-start sm:items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <div className="p-1.5 sm:p-2 bg-primary-100 rounded-lg flex-shrink-0">
          <Target className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Goals & Timeline</h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">Set your fundraising goal and deadline</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <Input
            label={`Goal Amount (${CURRENCY_SYMBOL})`}
            name="goalAmount"
            type="number"
            value={formData.goalAmount}
            onChange={handleChange}
            required
            min="100"
            placeholder="1000"
          />
          <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-gray-500">
            Minimum amount: {CURRENCY_SYMBOL}100
          </p>
        </div>
        <div>
          <Input
            label="End Date"
            name="endDate"
            type="date"
            value={formData.endDate}
            onChange={handleChange}
            required
            min={new Date().toISOString().split('T')[0]}
          />
          <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-gray-500">
            When do you want to end this fundraiser?
          </p>
        </div>
      </div>
    </motion.div>
  );
};

