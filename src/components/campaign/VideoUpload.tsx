import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, X, Video, CheckCircle2 } from 'lucide-react';

interface VideoUploadProps {
  label: string;
  previewVideos: string[];
  onVideosChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveVideo: (index: number) => void;
}

export const VideoUpload: React.FC<VideoUploadProps> = ({
  label,
  previewVideos,
  onVideosChange,
  onRemoveVideo,
}) => {
  const [isDragging, setIsDragging] = useState(false);

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
    if (files.length > 0) {
      const fakeEvent = {
        target: { files: Array.from(files) }
      } as React.ChangeEvent<HTMLInputElement>;
      onVideosChange(fakeEvent);
    }
  };

  return (
    <div>
      <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
        {label}
      </label>
      
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
              <Video className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-xs sm:text-sm font-medium text-gray-700 block">
                {previewVideos.length > 0 ? 'Add more videos' : 'Upload videos'}
              </span>
              <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">MP4, MOV, AVI, WebM up to 100MB each</p>
            </div>
            <input
              type="file"
              multiple
              accept="video/*"
              onChange={onVideosChange}
              className="sr-only"
            />
            <Upload className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600 flex-shrink-0" />
          </label>
        </motion.div>

        {previewVideos.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4"
          >
            {previewVideos.map((video, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative group"
              >
                <div className="relative overflow-hidden rounded-lg border-2 border-gray-200 bg-gray-100 aspect-video">
                  <video
                    src={video}
                    className="w-full h-full object-cover"
                    controls
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <motion.button
                    type="button"
                    onClick={() => onRemoveVideo(index)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute top-2 right-2 bg-red-500 active:bg-red-600 text-white rounded-full p-1.5 sm:p-2 shadow-lg opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity touch-manipulation min-w-[36px] min-h-[36px] sm:min-w-[44px] sm:min-h-[44px] flex items-center justify-center z-10"
                  >
                    <X size={12} className="sm:w-[14px] sm:h-[14px]" />
                  </motion.button>
                  <div className="absolute bottom-2 left-2 flex items-center gap-1.5 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-xs font-medium hidden sm:inline">Video {index + 1}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

