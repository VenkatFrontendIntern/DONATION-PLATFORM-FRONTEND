import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { CampaignCard } from '../campaign/CampaignCard';
import { Button } from '../ui/Button';
import { ShimmerGrid } from '../ui/Shimmer';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
    },
  },
};

interface FeaturedCampaignsSectionProps {
  campaigns: any[];
  loading: boolean;
}

export const FeaturedCampaignsSection: React.FC<FeaturedCampaignsSectionProps> = ({
  campaigns,
  loading,
}) => {
  const campaignsRef = useRef(null);
  const isCampaignsInView = useInView(campaignsRef, { once: true, margin: "-100px" });

  return (
    <section ref={campaignsRef} className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isCampaignsInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex justify-between items-end mb-12"
        >
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-3">Urgent Fundraisers</h2>
            <p className="text-lg text-gray-600">People who need your help right now.</p>
          </div>
          <Link 
            to="/campaigns" 
            className="hidden md:flex items-center text-primary-600 font-bold hover:text-primary-700 group transition-colors"
          >
            View All 
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ArrowRight size={20} className="ml-2" />
            </motion.div>
          </Link>
        </motion.div>

        {loading ? (
          <ShimmerGrid items={3} columns={3} animationType="slide" />
        ) : (
          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate={isCampaignsInView ? "visible" : "hidden"}
          >
            {campaigns.map((campaign, index) => (
              <CampaignCard 
                key={campaign._id} 
                campaign={campaign} 
                index={index}
              />
            ))}
          </motion.div>
        )}
        
        <motion.div 
          className="mt-12 md:hidden"
          initial={{ opacity: 0 }}
          animate={isCampaignsInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
        >
          <Link to="/campaigns">
            <Button variant="outline" fullWidth>View All Campaigns</Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

