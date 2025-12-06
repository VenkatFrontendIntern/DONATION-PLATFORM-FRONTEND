import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface Category {
  _id: string;
  name: string;
  description?: string;
  icon?: string;
}

interface CategorySelectorProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div>
      <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">
        Select the category that best describes your campaign
      </p>
      {categories.length === 0 ? (
        <div className="flex items-center justify-center py-8 sm:py-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-4 border-primary-200 border-t-primary-600 mb-2 sm:mb-3"></div>
            <p className="text-xs sm:text-sm text-gray-500">Loading categories...</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {categories.map((cat, index) => {
            const isSelected = selectedCategory === cat._id;
            return (
              <motion.button
                key={cat._id}
                type="button"
                onClick={() => onSelectCategory(cat._id)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className={`relative p-4 sm:p-5 border-2 rounded-lg sm:rounded-xl text-left transition-all duration-300 touch-manipulation min-h-[80px] sm:min-h-[100px] ${
                  isSelected
                    ? 'border-primary-500 bg-gradient-to-br from-primary-50 to-primary-100/50 shadow-lg shadow-primary-500/20'
                    : 'border-gray-200 hover:border-primary-300 bg-white hover:shadow-md active:bg-gray-50'
                }`}
              >
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2 right-2 sm:top-3 sm:right-3 w-5 h-5 sm:w-6 sm:h-6 bg-primary-500 rounded-full flex items-center justify-center"
                  >
                    <Check className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  </motion.div>
                )}
                
                <div className="flex items-start gap-2 sm:gap-3 pr-6 sm:pr-8">
                  <div className={`text-2xl sm:text-3xl transition-transform flex-shrink-0 ${isSelected ? 'scale-110' : ''}`}>
                    {cat.icon || '📋'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-semibold text-sm sm:text-base mb-0.5 sm:mb-1 ${
                      isSelected ? 'text-primary-700' : 'text-gray-900'
                    }`}>
                      {cat.name}
                    </h3>
                    {cat.description && (
                      <p className={`text-[11px] sm:text-xs leading-relaxed ${
                        isSelected ? 'text-primary-600/80' : 'text-gray-500'
                      }`}>
                        {cat.description}
                      </p>
                    )}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      )}
      
      {selectedCategory && categories.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-3 sm:mt-4 p-2.5 sm:p-3 bg-primary-50 border border-primary-200 rounded-lg"
        >
          <p className="text-xs sm:text-sm text-primary-700 font-medium">
            ✓ Selected: <span className="font-semibold">{categories.find(c => c._id === selectedCategory)?.name}</span>
          </p>
        </motion.div>
      )}
    </div>
  );
};

