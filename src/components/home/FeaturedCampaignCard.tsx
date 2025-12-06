import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Users } from 'lucide-react';
import { AnimatedCounter } from './AnimatedCounter';
import { ProgressBar } from '../ui/ProgressBar';
import { CURRENCY_SYMBOL } from '../../constants';

interface FeaturedCampaign {
  title: string;
  goalAmount: number;
  raisedAmount: number;
  category?: { name: string };
}

interface FeaturedCampaignCardProps {
  campaign: FeaturedCampaign;
  uniqueDonors: number;
}

export const FeaturedCampaignCard: React.FC<FeaturedCampaignCardProps> = ({
  campaign,
  uniqueDonors,
}) => {
  return (
    <motion.div
      className="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-gray-200 shadow-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.6 }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-lg shrink-0">
          <Heart className="w-6 h-6 text-white" fill="white" />
        </div>
        <div className="flex-1">
          <p className="font-bold text-gray-900 text-lg line-clamp-1">{campaign.title}</p>
          <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
            <Users className="w-4 h-4" />
            <AnimatedCounter value={uniqueDonors} suffix="+ donors making a difference" />
          </p>
        </div>
      </div>
      <div className="mb-3">
        <ProgressBar
          goal={campaign.goalAmount}
          raised={campaign.raisedAmount}
          showLabels={false}
        />
      </div>
      <p className="text-sm text-gray-700 font-semibold">
        {CURRENCY_SYMBOL}{campaign.raisedAmount.toLocaleString('en-IN')} raised of {CURRENCY_SYMBOL}{campaign.goalAmount.toLocaleString('en-IN')} goal
        {campaign.category && ` • ${campaign.category.name}`}
      </p>
    </motion.div>
  );
};

