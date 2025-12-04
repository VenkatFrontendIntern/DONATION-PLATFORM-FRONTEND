import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Button } from '../ui/Button';
import { ArrowRight } from 'lucide-react';

export const CTASection: React.FC = () => {
  const ctaRef = useRef(null);
  const isCtaInView = useInView(ctaRef, { once: true, margin: "-100px" });

  return (
    <section ref={ctaRef} className="py-16 bg-gradient-to-br from-primary-600 to-primary-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isCtaInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={isCtaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Be Part of the Legacy
          </motion.h2>
          <motion.p
            className="text-xl md:text-2xl text-white/90 leading-relaxed mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={isCtaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            You don't need to donate acres of land to make a difference. [cite_start]Like our Chairman's walk in the <strong>Bharat Jodo Yatra</strong>[cite: 7], every small step counts. Join Engala Trust today.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isCtaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <Link to="/campaigns">
              <Button size="lg" variant="secondary" className="bg-white text-primary-700 hover:bg-gray-100">
                Start Donating
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

