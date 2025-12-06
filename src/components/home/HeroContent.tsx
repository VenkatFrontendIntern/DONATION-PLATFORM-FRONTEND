import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';

export const HeroContent: React.FC = () => {
  return (
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
  );
};

