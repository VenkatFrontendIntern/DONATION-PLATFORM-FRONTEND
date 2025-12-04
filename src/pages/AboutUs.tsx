import React from 'react';
import { AboutHeroSection } from '../components/about/HeroSection';
import { FoundationSection } from '../components/about/FoundationSection';
import { ImpactSection } from '../components/about/ImpactSection';
import { LeadershipSection } from '../components/about/LeadershipSection';
import { CTASection } from '../components/about/CTASection';

const AboutUs: React.FC = () => {
  return (
    <div className="pb-20 md:pb-0 bg-gradient-to-b from-gray-50 to-white">
      <AboutHeroSection />
      <FoundationSection />
      <ImpactSection />
      <LeadershipSection />
      <CTASection />
    </div>
  );
};

export default AboutUs;
