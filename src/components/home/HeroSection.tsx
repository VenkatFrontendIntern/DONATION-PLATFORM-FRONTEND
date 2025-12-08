import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { campaignService } from '../../services/campaignService';
import { statsService } from '../../services/statsService';
import { ImageCarousel } from './ImageCarousel';
import { FeaturedCampaignCard } from './FeaturedCampaignCard';
import { HeroContent } from './HeroContent';
// Import images with responsive sizes and WebP format
// Using vite-imagetools to generate optimized images
import homePageImage1Small from '../../assets/images/home-page-picture-1.jpg?w=400&format=webp';
import homePageImage1Medium from '../../assets/images/home-page-picture-1.jpg?w=600&format=webp';
import homePageImage1Large from '../../assets/images/home-page-picture-1.jpg?w=800&format=webp';
import homePageImage1Src from '../../assets/images/home-page-picture-1.jpg?w=600&format=webp';

import homePageImage2Small from '../../assets/images/home-page-picture-2.jpg?w=400&format=webp';
import homePageImage2Medium from '../../assets/images/home-page-picture-2.jpg?w=600&format=webp';
import homePageImage2Large from '../../assets/images/home-page-picture-2.jpg?w=800&format=webp';
import homePageImage2Src from '../../assets/images/home-page-picture-2.jpg?w=600&format=webp';

import homePageImage3Small from '../../assets/images/home-page-picture-3.jpg?w=400&format=webp';
import homePageImage3Medium from '../../assets/images/home-page-picture-3.jpg?w=600&format=webp';
import homePageImage3Large from '../../assets/images/home-page-picture-3.jpg?w=800&format=webp';
import homePageImage3Src from '../../assets/images/home-page-picture-3.jpg?w=600&format=webp';

const images = [
  { 
    srcset: `${homePageImage1Small} 400w, ${homePageImage1Medium} 600w, ${homePageImage1Large} 800w`,
    src: homePageImage1Src, 
    alt: 'Child in need - Your donation can change a life' 
  },
  { 
    srcset: `${homePageImage2Small} 400w, ${homePageImage2Medium} 600w, ${homePageImage2Large} 800w`,
    src: homePageImage2Src, 
    alt: 'Family together - Making a difference through donations' 
  },
  { 
    srcset: `${homePageImage3Small} 400w, ${homePageImage3Medium} 600w, ${homePageImage3Large} 800w`,
    src: homePageImage3Src, 
    alt: 'Young child portrait - Your support makes a difference' 
  },
];

export const HeroSection: React.FC = () => {
  const [featuredCampaign, setFeaturedCampaign] = useState<any>(null);
  const [stats, setStats] = useState({ uniqueDonors: 0 });

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load featured campaign (first approved campaign)
        const campaignsResponse = await campaignService.getAll({ status: 'approved', limit: 1 });
        if (campaignsResponse.campaigns && campaignsResponse.campaigns.length > 0) {
          setFeaturedCampaign(campaignsResponse.campaigns[0]);
        }
      } catch (error: any) {
        // Silently handle rate limit errors - component will show fallback image
      }

      try {
        // Load stats for donor count
        const platformStats = await statsService.getPublicStats();
        setStats({ uniqueDonors: platformStats.uniqueDonors });
      } catch (error: any) {
        // Silently handle rate limit errors - component will show default stats
      }
    };
    loadData();
  }, []);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-soft"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-soft" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 flex flex-col md:flex-row items-center gap-12">
        <HeroContent />

        <motion.div
          className="md:w-1/2 relative"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{ willChange: 'transform, opacity' }}
        >
          <div className="space-y-6">
            <ImageCarousel images={images} autoSlideInterval={10000} />

            {featuredCampaign && (
              <FeaturedCampaignCard
                campaign={featuredCampaign}
                uniqueDonors={stats.uniqueDonors}
              />
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

