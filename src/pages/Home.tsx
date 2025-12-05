import React, { useEffect, useState } from 'react';
import { campaignService } from '../services/campaignService';
import { HeroSection } from '../components/home/HeroSection';
import { StatsSection } from '../components/home/StatsSection';
import { FeaturesSection } from '../components/home/FeaturesSection';
import { FeaturedCampaignsSection } from '../components/home/FeaturedCampaignsSection';

const Home: React.FC = () => {
  const [featuredCampaigns, setFeaturedCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await campaignService.getAll({ status: 'approved', limit: 3 });
        setFeaturedCampaigns(response.campaigns || []);
      } catch (error: any) {
        // Silently handle errors - component will show empty state
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, []);

  return (
    <div className="pb-20 md:pb-0">
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <FeaturedCampaignsSection campaigns={featuredCampaigns} loading={loading} />
    </div>
  );
};

export default Home;
