import React from 'react';
import { motion } from 'framer-motion';
import { ImageUpload } from '../ImageUpload';
import { Image as ImageIcon } from 'lucide-react';

interface StepProps {
  currentStep: number;
  previewImages: string[];
  handleCoverImageChange: (file: File) => void;
  handleGalleryImagesChange: (files: File[]) => void;
  removeImage: (index: number) => void;
}

export const ImagesStep: React.FC<StepProps> = ({
  currentStep,
  previewImages,
  handleCoverImageChange,
  handleGalleryImagesChange,
  removeImage,
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
          <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5 text-secondary-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Visuals</h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">Add images to make your campaign stand out</p>
        </div>
      </div>
      
      <div className="space-y-4 sm:space-y-6">
        <ImageUpload
          label="Cover Image"
          required
          previewImages={previewImages}
          onCoverImageChange={handleCoverImageChange}
          onRemoveImage={removeImage}
        />

        <ImageUpload
          label="Gallery Images (Optional)"
          previewImages={previewImages}
          onGalleryImagesChange={handleGalleryImagesChange}
          onRemoveImage={removeImage}
          isGallery
        />
      </div>
    </motion.div>
  );
};

