import React from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Users, TrendingUp, Heart } from 'lucide-react';
import { AnimatedCounter } from './AnimatedCounter';

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

export const StatsSection: React.FC = () => {
  const statsRef = useRef(null);
  const isStatsInView = useInView(statsRef, { once: true, margin: "-100px" });

  const stats = [
    { icon: Users, value: 1200, suffix: '+', label: 'Active Donors', color: 'from-blue-500 to-blue-600' },
    { icon: TrendingUp, value: 50000, suffix: '+', label: 'Raised (₹)', color: 'from-primary-500 to-primary-600' },
    { icon: Heart, value: 150, suffix: '+', label: 'Campaigns Funded', color: 'from-pink-500 to-pink-600' },
  ];

  return (
    <section ref={statsRef} className="py-16 bg-gradient-to-br from-white via-primary-50/30 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isStatsInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Making a Real Difference</h2>
          <p className="text-lg text-gray-600">Join our community of changemakers</p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isStatsInView ? "visible" : "hidden"}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="relative group"
            >
              <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-300">
                <div className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mb-4 mx-auto shadow-lg`}>
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </div>
                  <p className="text-gray-600 font-semibold">{stat.label}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

