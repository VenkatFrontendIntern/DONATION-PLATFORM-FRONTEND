import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../../utils/imageUtils';

interface CampaignCardProps {
  campaign: any;
  index?: number;
  priority?: boolean;
}

export const CampaignCard: React.FC<CampaignCardProps> = memo(({ campaign, index = 0, priority = false }) => {
  const progressPercentage = Math.min((campaign.raisedAmount / campaign.goalAmount) * 100, 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.05,
        ease: [0.22, 1, 0.36, 1]
      }}
      whileHover={{ y: -4 }}
      className="group relative bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full transition-all duration-300 hover:shadow-xl hover:shadow-gray-200/50"
      style={{ willChange: 'transform, opacity' }}
    >
      {/* Image Container */}
      <div className="relative h-48 sm:h-56 md:h-64 w-full overflow-hidden bg-gray-100">
        <motion.img
          src={getImageUrl(campaign.coverImage, 600)}
          alt={campaign.title}
          className="w-full h-full object-cover"
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={priority ? "high" : "auto"}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{ willChange: 'transform' }}
        />
        
        {/* Subtle overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Category Badge - Apple-like design */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
          <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm border border-gray-200/50">
            <span className="text-[10px] sm:text-xs font-semibold text-gray-700 uppercase tracking-wide">
              {campaign.category?.name || 'Campaign'}
            </span>
          </div>
        </div>
      </div>

      {/* Content Area - Clean and Spacious */}
      <div className="relative p-4 sm:p-5 md:p-6 flex-1 flex flex-col bg-white">
        {/* Title */}
        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 sm:mb-3 line-clamp-2 leading-tight group-hover:text-primary-600 transition-colors duration-200">
          {campaign.title}
        </h3>

        {/* Description */}
        <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-5 line-clamp-2 flex-1 leading-relaxed">
          {campaign.description}
        </p>

        {/* Progress Section */}
        <div className="mb-4 sm:mb-5 space-y-2">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="font-semibold text-gray-900">
              ₹{campaign.raisedAmount.toLocaleString('en-IN')} raised
            </span>
            <span className="text-gray-500">
              {progressPercentage.toFixed(0)}%
            </span>
          </div>
          {/* Progress Bar */}
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 1, delay: 0.2 + index * 0.05, ease: "easeOut" }}
            />
          </div>
          <p className="text-xs text-gray-500">
            of ₹{campaign.goalAmount.toLocaleString('en-IN')} goal
          </p>
        </div>

        {/* Action Button - Apple-like */}
        <Link to={`/campaign/${campaign._id}`} className="mt-auto">
          <motion.button
            className="w-full py-3 sm:py-3.5 px-4 sm:px-5 bg-primary-600 text-white rounded-xl sm:rounded-2xl text-sm sm:text-base font-semibold shadow-sm hover:bg-primary-700 active:bg-primary-800 transition-all duration-200 touch-manipulation min-h-[44px] flex items-center justify-center"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            style={{ willChange: 'transform' }}
          >
            Donate Now
          </motion.button>
        </Link>
      </div>
    </motion.div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison for memo
  return prevProps.campaign._id === nextProps.campaign._id &&
    prevProps.campaign.raisedAmount === nextProps.campaign.raisedAmount &&
    prevProps.index === nextProps.index &&
    prevProps.priority === nextProps.priority;
});

CampaignCard.displayName = 'CampaignCard';
