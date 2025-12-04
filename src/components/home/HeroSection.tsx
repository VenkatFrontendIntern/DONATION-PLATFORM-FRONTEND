import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { Heart, Users } from 'lucide-react';
import { AnimatedCounter } from './AnimatedCounter';
import homePageImage from '../../assets/images/home-page-picture-1.jpg?url';

export const HeroSection: React.FC = () => {
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
            Small contributions, <br/>
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
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/20"></div>
            
            <div className="absolute bottom-6 left-6 right-6 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-lg">
                  <Heart className="w-6 h-6 text-white" fill="white" />
                </div>
                <div>
                  <p className="font-bold text-white text-lg drop-shadow-lg">Help Save a Life Today</p>
                  <p className="text-sm text-white/90 flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <AnimatedCounter value={1200} suffix="+ donors making a difference" />
                  </p>
                </div>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: '68%' }}
                  transition={{ duration: 1.5, delay: 1 }}
                  style={{ willChange: 'width' }}
                />
              </div>
              <p className="text-xs text-white/90 mt-2 font-semibold">₹2.4L raised of ₹3.5L goal • Medical Emergency Fund</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

