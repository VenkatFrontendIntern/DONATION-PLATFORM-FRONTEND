import React from 'react';
import { Button } from '../ui/Button';
import { Plus, Trash2, Tag } from 'lucide-react';
import { CategoryModal } from './CategoryModal';

interface Category {
  _id: string;
  name: string;
  description?: string;
  icon?: string;
  slug?: string;
  isActive?: boolean;
}

interface CategoryManagementProps {
  categories: Category[];
  showModal: boolean;
  newCategory: { name: string; description: string; icon: string };
  deleteLoading: string | null;
  onShowModal: () => void;
  onCloseModal: () => void;
  onCategoryChange: (field: string, value: string) => void;
  onCreateCategory: () => void;
  onDeleteCategory: (id: string) => void;
  createLoading: boolean;
}

export const CategoryManagement: React.FC<CategoryManagementProps> = ({
  categories,
  showModal,
  newCategory,
  deleteLoading,
  onShowModal,
  onCloseModal,
  onCategoryChange,
  onCreateCategory,
  onDeleteCategory,
  createLoading,
}) => {
  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Category Management</h2>
            <p className="text-sm text-gray-500 mt-1">Manage campaign categories</p>
          </div>
          <Button onClick={onShowModal} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Category
          </Button>
        </div>

        <div className="p-6">
          {categories.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Tag className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No categories yet. Create your first category!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category) => (
                <div
                  key={category._id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {category.icon && (
                          <span className="text-2xl">{category.icon}</span>
                        )}
                        <h3 className="font-semibold text-gray-900">{category.name}</h3>
                      </div>
                      {category.description && (
                        <p className="text-sm text-gray-500">{category.description}</p>
                      )}
                    </div>
                    <button
                      onClick={() => onDeleteCategory(category._id)}
                      disabled={deleteLoading === category._id}
                      className="text-red-500 hover:text-red-700 disabled:opacity-50"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <CategoryModal
        isOpen={showModal}
        onClose={onCloseModal}
        category={newCategory}
        onCategoryChange={onCategoryChange}
        onSubmit={onCreateCategory}
        loading={createLoading}
      />
    </>
  );
};

