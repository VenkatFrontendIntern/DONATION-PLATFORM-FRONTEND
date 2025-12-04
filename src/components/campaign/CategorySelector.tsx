import React from 'react';

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
      <label className="block text-sm font-medium text-gray-700 mb-3">
        Category <span className="text-red-500">*</span>
      </label>
      <p className="text-sm text-gray-600 mb-3">
        Select the category that best describes your campaign
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {categories.map((cat) => (
          <button
            key={cat._id}
            type="button"
            onClick={() => onSelectCategory(cat._id)}
            className={`p-4 border-2 rounded-lg text-left transition-all ${
              selectedCategory === cat._id
                ? 'border-primary-500 bg-primary-50 text-primary-700'
                : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl">{cat.icon || '📋'}</span>
              <span className="font-medium">{cat.name}</span>
            </div>
            {cat.description && (
              <p className="text-xs text-gray-500 mt-1">{cat.description}</p>
            )}
          </button>
        ))}
      </div>
      {categories.length === 0 && (
        <p className="text-sm text-gray-500 mt-2">Loading categories...</p>
      )}
      {selectedCategory && (
        <p className="text-sm text-primary-600 mt-2">
          Selected: {categories.find(c => c._id === selectedCategory)?.name}
        </p>
      )}
    </div>
  );
};

