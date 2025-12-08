import React, { useState, useEffect } from 'react';
import { motion, PanInfo } from 'framer-motion';

interface Image {
  src: string;
  srcset?: string;
  alt: string;
}

interface ImageCarouselProps {
  images: Image[];
  autoSlideInterval?: number; // in milliseconds
}

export const ImageCarousel: React.FC<ImageCarouselProps> = ({
  images,
  autoSlideInterval = 10000,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, autoSlideInterval);

    return () => clearInterval(interval);
  }, [images.length, autoSlideInterval]);

  const slideVariants = {
    enter: (direction: number) => ({
      y: direction > 0 ? 500 : -500,
      opacity: 0,
      scale: 0.8,
    }),
    center: {
      zIndex: 1,
      y: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      y: direction < 0 ? 500 : -500,
      opacity: 0,
      scale: 0.8,
    }),
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex + newDirection;
      if (newIndex < 0) return images.length - 1;
      if (newIndex >= images.length) return 0;
      return newIndex;
    });
  };

  const handleDragEnd = (_e: any, { offset, velocity }: PanInfo) => {
    const swipe = swipePower(offset.y, velocity.y);

    if (swipe < -swipeConfidenceThreshold) {
      paginate(1);
    } else if (swipe > swipeConfidenceThreshold) {
      paginate(-1);
    }
  };

  return (
    <div className="relative h-[300px] sm:h-[350px] md:h-[400px] w-full max-w-md mx-auto">
      <div className="relative w-full h-full perspective-1000">
        {images.map((image, index) => {
          const isActive = index === currentIndex;
          const isNext = index === (currentIndex + 1) % images.length;
          const isPrev = index === (currentIndex - 1 + images.length) % images.length;

          return (
            <motion.div
              key={index}
              className={`absolute inset-0 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20 cursor-grab active:cursor-grabbing ${
                isActive ? 'z-20' : isNext || isPrev ? 'z-10' : 'z-0'
              }`}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate={isActive ? 'center' : isNext ? 'exit' : isPrev ? 'exit' : 'enter'}
              transition={{
                y: { type: 'spring', stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
                scale: { duration: 0.2 },
              }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={1}
              onDragEnd={handleDragEnd}
              style={{
                y: isActive ? 0 : isNext ? '100%' : isPrev ? '-100%' : 0,
                scale: isActive ? 1 : isNext || isPrev ? 0.85 : 0.7,
                opacity: isActive ? 1 : isNext || isPrev ? 0.6 : 0,
              }}
              whileHover={isActive ? { y: -5 } : {}}
            >
              <img
                src={image.src}
                srcSet={image.srcset}
                alt={image.alt}
                className="w-full h-full object-cover pointer-events-none"
                loading={index === 0 ? 'eager' : 'lazy'}
                decoding="async"
                fetchpriority={index === 0 ? 'high' : 'auto'}
                width={600}
                height={600}
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, 50vw"
                draggable={false}
              />
            </motion.div>
          );
        })}
      </div>

      {/* Indicator Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentIndex(index);
            }}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              index === currentIndex
                ? 'bg-white w-8'
                : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

