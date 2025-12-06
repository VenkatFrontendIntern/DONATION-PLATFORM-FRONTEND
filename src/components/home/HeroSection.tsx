import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { Heart, Users } from 'lucide-react';
import { AnimatedCounter } from './AnimatedCounter';
import { campaignService } from '../../services/campaignService';
import { statsService } from '../../services/statsService';
import { CURRENCY_SYMBOL } from '../../constants';
import { ProgressBar } from '../ui/ProgressBar';
import homePageImage from '../../assets/images/home-page-picture-1.jpg?url';

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
        <motion.div
          className="md:w-1/2 space-y-8 z-10"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{ willChange: 'transform, opacity' }}
        >
          <motion.div
            className="inline-flex items-center px-4 py-2 rounded-full bg-white/80 backdrop-blur-md border border-primary-200 text-primary-700 text-sm font-bold shadow-lg"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <motion.span
              className="flex h-2 w-2 bg-primary-600 rounded-full mr-2"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            #1 Trusted Crowdfunding Platform
          </motion.div>

          <motion.h1
            className="text-5xl md:text-7xl font-extrabold text-gray-900 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Small contributions, <br />
            <span className="bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
              Big Impact.
            </span>
          </motion.h1>

          <motion.p
            className="text-xl text-gray-600 max-w-lg leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            Join thousands of donors changing lives today. Start a fundraiser for medical emergencies, education, or social causes.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            <Link to="/campaigns">
              <Button size="lg" className="w-full sm:w-auto">
                Donate Now
              </Button>
            </Link>
            <Link to="/start-campaign">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Start a Fundraiser
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          className="md:w-1/2 relative"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{ willChange: 'transform, opacity' }}
        >
          <div className="space-y-6">
            <motion.div
              className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              style={{ willChange: 'transform' }}
            >
              <img
                src={homePageImage}
                alt="Child in need - Your donation can change a life"
                className="w-full h-full object-cover"
                loading="eager"
                decoding="async"
                fetchPriority="high"
                width={600}
                height={600}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </motion.div>

            {/* Campaign Info Card - Below Image */}
            {featuredCampaign && (
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
                    <p className="font-bold text-gray-900 text-lg line-clamp-1">{featuredCampaign.title}</p>
                    <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                      <Users className="w-4 h-4" />
                      <AnimatedCounter value={stats.uniqueDonors} suffix="+ donors making a difference" />
                    </p>
                  </div>
                </div>
                <div className="mb-3">
                  <ProgressBar
                    goal={featuredCampaign.goalAmount}
                    raised={featuredCampaign.raisedAmount}
                    showLabels={false}
                  />
                </div>
                <p className="text-sm text-gray-700 font-semibold">
                  {CURRENCY_SYMBOL}{featuredCampaign.raisedAmount.toLocaleString('en-IN')} raised of {CURRENCY_SYMBOL}{featuredCampaign.goalAmount.toLocaleString('en-IN')} goal
                  {featuredCampaign.category && ` • ${featuredCampaign.category.name}`}
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

