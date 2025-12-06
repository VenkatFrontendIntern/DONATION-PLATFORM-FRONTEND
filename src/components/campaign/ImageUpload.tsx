import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, X, Image as ImageIcon, CheckCircle2 } from 'lucide-react';

interface ImageUploadProps {
  label: string;
  required?: boolean;
  previewImages: string[];
  onCoverImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onGalleryImagesChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (index: number) => void;
  isGallery?: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  label,
  required = false,
  previewImages,
  onCoverImageChange,
  onGalleryImagesChange,
  onRemoveImage,
  isGallery = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const coverImage = previewImages[0];
  const galleryImages = previewImages.slice(1);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0 && !isGallery) {
      const fakeEvent = {
        target: { files: [files[0]] }
      } as React.ChangeEvent<HTMLInputElement>;
      onCoverImageChange(fakeEvent);
    } else if (files.length > 0 && isGallery && onGalleryImagesChange) {
      const fakeEvent = {
        target: { files: Array.from(files) }
      } as React.ChangeEvent<HTMLInputElement>;
      onGalleryImagesChange(fakeEvent);
    }
  };

  return (
    <div>
      <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      {!isGallery && (
        <>
          {!coverImage ? (
            <motion.div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                borderColor: isDragging ? '#10b981' : '#d1d5db'
              }}
              className={`relative flex flex-col items-center justify-center px-4 sm:px-6 pt-6 sm:pt-8 pb-6 sm:pb-8 border-2 border-dashed rounded-lg sm:rounded-xl transition-all duration-300 touch-manipulation ${
                isDragging 
                  ? 'border-primary-500 bg-primary-50/50 scale-[1.02]' 
                  : 'border-gray-300 bg-gray-50/50 active:border-primary-400 active:bg-primary-50/30'
              }`}
            >
              <motion.div
                animate={{ 
                  scale: isDragging ? 1.1 : 1,
                  rotate: isDragging ? 5 : 0
                }}
                transition={{ duration: 0.2 }}
                className="mb-3 sm:mb-4"
              >
                <div className="p-3 sm:p-4 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl sm:rounded-2xl">
                  <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-primary-600" />
                </div>
              </motion.div>
              
              <div className="text-center space-y-1.5 sm:space-y-2">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium text-gray-700">
                  <label className="relative cursor-pointer rounded-md font-semibold text-primary-600 active:text-primary-700 transition-colors touch-manipulation min-h-[44px] flex items-center justify-center px-3">
                    <span className="underline decoration-2 underline-offset-2">Click to upload</span>
                    <input
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      onChange={onCoverImageChange}
                    />
                  </label>
                  <span className="text-gray-500 hidden sm:inline">or</span>
                  <span className="text-gray-600 hidden sm:inline">drag and drop</span>
                </div>
                <p className="text-[10px] sm:text-xs text-gray-500 px-2">
                  PNG, JPG, GIF up to 5MB • Recommended: 1200x600px
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative group"
            >
              <div className="relative overflow-hidden rounded-lg sm:rounded-xl border-2 border-gray-200 shadow-md">
                <img
                  src={coverImage}
                  alt="Cover preview"
                  className="w-full h-48 sm:h-64 md:h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <motion.button
                  type="button"
                  onClick={() => onRemoveImage(0)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-red-500 active:bg-red-600 text-white rounded-full p-1.5 sm:p-2 shadow-lg transition-colors touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
                >
                  <X size={16} className="sm:w-[18px] sm:h-[18px]" />
                </motion.button>
                <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 flex items-center gap-1.5 sm:gap-2 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-xs sm:text-sm font-medium hidden sm:inline">Cover image uploaded</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = 'image/*';
                  input.onchange = (e) => {
                    const event = e as unknown as React.ChangeEvent<HTMLInputElement>;
                    onCoverImageChange(event);
                  };
                  input.click();
                }}
                className="mt-2 sm:mt-3 text-xs sm:text-sm text-primary-600 active:text-primary-700 font-medium touch-manipulation min-h-[44px] flex items-center"
              >
                Change image
              </button>
            </motion.div>
          )}
        </>
      )}

      {isGallery && (
        <div className="space-y-3 sm:space-y-4">
          <motion.div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: 1,
              borderColor: isDragging ? '#10b981' : '#d1d5db'
            }}
            className={`relative flex items-center justify-center px-4 sm:px-6 py-3 sm:py-4 border-2 border-dashed rounded-lg sm:rounded-xl transition-all duration-300 touch-manipulation min-h-[80px] ${
              isDragging 
                ? 'border-primary-500 bg-primary-50/50' 
                : 'border-gray-300 bg-gray-50/50 active:border-primary-400 active:bg-primary-50/30'
            }`}
          >
            <label className="flex items-center gap-2 sm:gap-3 cursor-pointer w-full touch-manipulation">
              <div className="p-1.5 sm:p-2 bg-primary-100 rounded-lg flex-shrink-0">
                <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-xs sm:text-sm font-medium text-gray-700 block">
                  {galleryImages.length > 0 ? 'Add more images' : 'Upload gallery images'}
                </span>
                <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">PNG, JPG, GIF up to 5MB each</p>
              </div>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={onGalleryImagesChange}
                className="sr-only"
              />
              <Upload className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600 flex-shrink-0" />
            </label>
          </motion.div>

          {galleryImages.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4"
            >
              {galleryImages.map((img, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative group"
                >
                  <div className="relative overflow-hidden rounded-lg border-2 border-gray-200 aspect-square">
                    <img
                      src={img}
                      alt={`Gallery ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <motion.button
                      type="button"
                      onClick={() => onRemoveImage(index + 1)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 bg-red-500 active:bg-red-600 text-white rounded-full p-1 sm:p-1.5 shadow-lg opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity touch-manipulation min-w-[36px] min-h-[36px] sm:min-w-[44px] sm:min-h-[44px] flex items-center justify-center"
                    >
                      <X size={12} className="sm:w-[14px] sm:h-[14px]" />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
};

