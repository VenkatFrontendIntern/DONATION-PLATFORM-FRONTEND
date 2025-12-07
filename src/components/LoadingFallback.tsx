import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
import { ShimmerGrid } from './ui/Shimmer';

const LoadingFallback: React.FC = () => {
  const [showShimmer, setShowShimmer] = useState(false);

  useEffect(() => {
    // Show loader for 400ms, then transition to shimmer
    const timer = setTimeout(() => {
      setShowShimmer(true);
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          {!showShimmer ? (
            <motion.div
              key="loader"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="flex items-center justify-center min-h-[60vh]"
            >
              <div className="text-center">
                {/* Custom Heart Loader */}
                <div className="relative inline-flex items-center justify-center mb-6">
                  {/* Outer pulsing circles */}
                  <motion.div
                    className="absolute w-24 h-24 rounded-full border-2 border-primary-200"
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.6, 0, 0.6],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeOut",
                    }}
                  />
                  <motion.div
                    className="absolute w-24 h-24 rounded-full border-2 border-primary-300"
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.4, 0, 0.4],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeOut",
                      delay: 0.3,
                    }}
                  />
                  
                  {/* Rotating gradient circle */}
                  <motion.div
                    className="absolute w-20 h-20 rounded-full"
                    style={{
                      background: 'conic-gradient(from 0deg, #10b981, #34d399, #6ee7b7, #10b981)',
                      mask: 'radial-gradient(circle, transparent 60%, black 60%)',
                      WebkitMask: 'radial-gradient(circle, transparent 60%, black 60%)',
                    }}
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                  
                  {/* Heart icon */}
                  <motion.div
                    className="relative z-10 bg-white rounded-full p-3 shadow-lg"
                    animate={{
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <Heart className="h-8 w-8 text-primary-600 fill-primary-600" />
                  </motion.div>
                </div>
                
                {/* Loading text */}
                <motion.p
                  className="text-sm text-gray-600 font-medium"
                  animate={{
                    opacity: [0.6, 1, 0.6],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  Loading...
                </motion.p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="shimmer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="py-8 pb-24"
            >
              <ShimmerGrid items={6} columns={3} animationType="slide" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LoadingFallback;

