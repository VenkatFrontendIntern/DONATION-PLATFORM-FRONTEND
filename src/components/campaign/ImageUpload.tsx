import React from 'react';
import { Upload, X } from 'lucide-react';

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
  const coverImage = previewImages[0];
  const galleryImages = previewImages.slice(1);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      {!isGallery && (
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
          <div className="space-y-1 text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="flex text-sm text-gray-600">
              <label className="relative cursor-pointer rounded-md font-medium text-primary-600 hover:text-primary-500">
                <span>Upload a file</span>
                <input
                  type="file"
                  className="sr-only"
                  accept="image/*"
                  onChange={onCoverImageChange}
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
          </div>
        </div>
      )}

      {isGallery && (
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={onGalleryImagesChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
        />
      )}

      {coverImage && !isGallery && (
        <div className="mt-4 relative inline-block">
          <img
            src={coverImage}
            alt="Cover preview"
            className="h-48 w-full object-cover rounded-lg"
          />
          <button
            type="button"
            onClick={() => onRemoveImage(0)}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
          >
            <X size={20} />
          </button>
        </div>
      )}

      {isGallery && galleryImages.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mt-4">
          {galleryImages.map((img, index) => (
            <div key={index} className="relative">
              <img
                src={img}
                alt={`Gallery ${index + 1}`}
                className="h-32 w-full object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => onRemoveImage(index + 1)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

