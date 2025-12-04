import React from 'react';
import { Button } from '../ui/Button';
import { X } from 'lucide-react';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: { name: string; description: string; icon: string };
  onCategoryChange: (field: string, value: string) => void;
  onSubmit: () => void;
  loading: boolean;
}

export const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  category,
  onCategoryChange,
  onSubmit,
  loading,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold mb-6">Create Category</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category Name *
            </label>
            <input
              type="text"
              value={category.name}
              onChange={(e) => onCategoryChange('name', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="e.g., Medical, Education"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={category.description}
              onChange={(e) => onCategoryChange('description', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              rows={3}
              placeholder="Brief description of the category"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Icon (Emoji or Name)
            </label>
            <input
              type="text"
              value={category.icon}
              onChange={(e) => onCategoryChange('icon', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="🏥 or hospital"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClose} fullWidth>
              Cancel
            </Button>
            <Button onClick={onSubmit} fullWidth loading={loading}>
              Create Category
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

