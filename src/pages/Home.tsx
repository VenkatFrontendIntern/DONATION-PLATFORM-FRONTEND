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
        console.log('🔍 Fetching featured campaigns...');
        const response = await campaignService.getAll({ status: 'approved', limit: 3 });
        console.log('✅ Featured campaigns response:', response);
        setFeaturedCampaigns(response.campaigns || []);
        console.log(`📊 Loaded ${response.campaigns?.length || 0} featured campaigns`);
      } catch (error: any) {
        console.error('❌ Failed to fetch campaigns:', error);
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
