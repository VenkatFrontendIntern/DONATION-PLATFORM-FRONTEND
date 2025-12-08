import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Image as ImageIcon, Video, ChevronLeft, ChevronRight } from 'lucide-react';
import { getImageUrl } from '../../utils/imageUtils';

interface MediaGalleryProps {
  coverImage: string;
  galleryImages?: string[];
  videos?: string[];
}

interface MediaItem {
  type: 'image' | 'video';
  url: string;
}

export const MediaGallery: React.FC<MediaGalleryProps> = ({
  coverImage,
  galleryImages = [],
  videos = [],
}) => {
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Combine all media items
  const allMedia: MediaItem[] = [
    { type: 'image', url: coverImage },
    ...galleryImages.map(url => ({ type: 'image' as const, url })),
    ...(videos || []).map(url => ({ type: 'video' as const, url })),
  ];

  const openMedia = (media: MediaItem, index: number) => {
    setSelectedMedia(media);
    setSelectedIndex(index);
  };

  const closeMedia = () => {
    setSelectedMedia(null);
  };

  const navigateMedia = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      const newIndex = selectedIndex > 0 ? selectedIndex - 1 : allMedia.length - 1;
      setSelectedIndex(newIndex);
      setSelectedMedia(allMedia[newIndex]);
    } else {
      const newIndex = selectedIndex < allMedia.length - 1 ? selectedIndex + 1 : 0;
      setSelectedIndex(newIndex);
      setSelectedMedia(allMedia[newIndex]);
    }
  };

  if (allMedia.length === 1 && !galleryImages.length && !videos?.length) {
    // Only cover image, no gallery
    return (
      <div className="bg-white rounded-xl overflow-hidden shadow-sm">
        <img
          src={getImageUrl(coverImage)}
          alt="Campaign cover"
          className="w-full h-[300px] md:h-[400px] object-cover cursor-pointer"
          onClick={() => openMedia(allMedia[0], 0)}
        />
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl overflow-hidden shadow-sm">
        {/* Cover Image - Large */}
        <div className="relative group">
          <img
            src={getImageUrl(coverImage)}
            alt="Campaign cover"
            className="w-full h-[300px] md:h-[400px] object-cover cursor-pointer transition-transform group-hover:scale-105"
            onClick={() => openMedia(allMedia[0], 0)}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-gray-700" />
              <span className="text-sm font-medium text-gray-700">Click to view gallery</span>
            </div>
          </div>
        </div>

        {/* Gallery Grid */}
        {(galleryImages.length > 0 || videos?.length > 0) && (
          <div className="p-4 border-t border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Gallery</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {/* Gallery Images */}
              {galleryImages.map((url, index) => {
                const mediaIndex = index + 1; // +1 because cover image is at index 0
                return (
                  <motion.div
                    key={`img-${index}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative group aspect-square overflow-hidden rounded-lg cursor-pointer"
                    onClick={() => openMedia({ type: 'image', url }, mediaIndex)}
                  >
                    <img
                      src={getImageUrl(url)}
                      alt={`Gallery ${index + 1}`}
                      className="w-full h-full object-cover transition-transform group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <ImageIcon className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </motion.div>
                );
              })}

              {/* Videos */}
              {videos?.map((url, index) => {
                const mediaIndex = galleryImages.length + index + 1; // +1 for cover image
                return (
                  <motion.div
                    key={`video-${index}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative group aspect-square overflow-hidden rounded-lg cursor-pointer bg-gray-900"
                    onClick={() => openMedia({ type: 'video', url }, mediaIndex)}
                  >
                    <video
                      src={url}
                      className="w-full h-full object-cover opacity-70"
                      muted
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 group-hover:scale-110 transition-transform">
                        <Video className="w-6 h-6 text-gray-700" />
                      </div>
                    </div>
                    <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                      Video {index + 1}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Full Screen Media Viewer */}
      <AnimatePresence>
        {selectedMedia && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={closeMedia}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-7xl max-h-full w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={closeMedia}
                className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-full p-2 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Navigation Buttons */}
              {allMedia.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigateMedia('prev');
                    }}
                    className="absolute left-4 z-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-full p-2 transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigateMedia('next');
                    }}
                    className="absolute right-4 z-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-full p-2 transition-colors"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              {/* Media Display */}
              {selectedMedia.type === 'image' ? (
                <img
                  src={getImageUrl(selectedMedia.url)}
                  alt="Gallery view"
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <video
                  src={selectedMedia.url}
                  controls
                  autoPlay
                  className="max-w-full max-h-full"
                />
              )}

              {/* Media Counter */}
              {allMedia.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm">
                  {selectedIndex + 1} / {allMedia.length}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

