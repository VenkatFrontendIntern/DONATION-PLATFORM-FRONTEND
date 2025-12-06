import React from 'react';
import { motion } from 'framer-motion';
import { CategorySelector } from '../CategorySelector';
import { Target } from 'lucide-react';

interface StepProps {
  currentStep: number;
  formData: any;
  categories: any[];
  setFormData: (data: any) => void;
}

export const CategoryStep: React.FC<StepProps> = ({
  currentStep,
  formData,
  categories,
  setFormData,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl sm:rounded-2xl shadow-lg shadow-gray-200/50 p-4 sm:p-6 md:p-8 border border-gray-100"
    >
      <div className="flex items-start sm:items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <div className="p-1.5 sm:p-2 bg-secondary-100 rounded-lg flex-shrink-0">
          <Target className="w-4 h-4 sm:w-5 sm:h-5 text-secondary-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Choose Category</h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">Select the category that best fits your campaign</p>
        </div>
      </div>
      <CategorySelector
        categories={categories}
        selectedCategory={formData.category}
        onSelectCategory={(categoryId) => setFormData({ ...formData, category: categoryId })}
      />
    </motion.div>
  );
};

