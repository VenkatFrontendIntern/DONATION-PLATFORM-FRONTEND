import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { ProgressBar } from '../ui/ProgressBar';
import { Link } from 'react-router-dom';
import { Share2, Heart } from 'lucide-react';
import { SocialShare } from './SocialShare';
import { getImageUrl } from '../../utils/imageUtils';
import { cn } from '../../utils/cn';

interface CampaignCardProps {
  campaign: any;
  index?: number;
}

export const CampaignCard: React.FC<CampaignCardProps> = memo(({ campaign, index = 0 }) => {
  const campaignUrl = `${window.location.origin}/campaign/${campaign._id}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1]
      }}
      whileHover={{ y: -8 }}
      className="group relative bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 overflow-hidden flex flex-col h-full transition-all duration-300"
      style={{ willChange: 'transform, opacity' }}
    >
      {/* Image Container with Zoom Effect */}
      <div className="relative h-56 w-full overflow-hidden">
        <motion.img
          src={getImageUrl(campaign.coverImage, 400)}
          alt={campaign.title}
          className="w-full h-full object-cover"
          loading="lazy"
          decoding="async"
          fetchPriority={index < 3 ? "high" : "low"}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{ willChange: 'transform' }}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Glassmorphism Category Badge */}
        <motion.div 
          className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/30"
          whileHover={{ scale: 1.05 }}
          style={{ willChange: 'transform' }}
        >
          <span className="text-xs font-bold text-white drop-shadow-lg">
            {campaign.category?.name || 'Campaign'}
          </span>
        </motion.div>
      </div>

      {/* Glassmorphism Content Area */}
      <div className="relative p-6 flex-1 flex flex-col bg-gradient-to-b from-white/90 to-white/70 backdrop-blur-sm">
        {/* Decorative gradient accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 via-primary-400 to-primary-500" />
        
        <motion.h3 
          className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-primary-700 transition-colors"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 + index * 0.1 }}
        >
          {campaign.title}
        </motion.h3>
        
        <motion.p 
          className="text-sm text-gray-600 mb-5 line-clamp-2 flex-1 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 + index * 0.1 }}
        >
          {campaign.description}
        </motion.p>

        {/* Animated Progress Bar */}
        <motion.div 
          className="mb-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 + index * 0.1 }}
        >
          <ProgressBar 
            goal={campaign.goalAmount} 
            raised={campaign.raisedAmount}
            animateOnMount={true}
          />
        </motion.div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-3 mt-auto">
          <Link to={`/campaign/${campaign._id}`} className="flex-1">
            <motion.button 
              className="w-full py-3 px-5 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{ willChange: 'transform' }}
            >
              Donate Now
            </motion.button>
          </Link>
          <motion.div 
            className="flex items-center"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            style={{ willChange: 'transform' }}
          >
            <SocialShare url={campaignUrl} title={campaign.title} />
          </motion.div>
        </div>
      </div>

      {/* Shine effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
    </motion.div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison for memo
  return prevProps.campaign._id === nextProps.campaign._id &&
         prevProps.campaign.raisedAmount === nextProps.campaign.raisedAmount &&
         prevProps.index === nextProps.index;
});

CampaignCard.displayName = 'CampaignCard';
