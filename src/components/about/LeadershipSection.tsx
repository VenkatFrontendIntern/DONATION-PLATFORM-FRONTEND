import React from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Briefcase } from 'lucide-react';

export const LeadershipSection: React.FC = () => {
  const leadershipRef = useRef(null);
  const isLeadershipInView = useInView(leadershipRef, { once: true, margin: "-100px" });

  return (
    <section ref={leadershipRef} className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isLeadershipInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-gradient-to-br from-primary-50 to-gray-50 rounded-3xl p-8 md:p-12 shadow-lg border border-primary-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
                <Briefcase className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Leadership</h2>
            </div>
            <p className="text-lg text-gray-700 leading-relaxed">
              Sri Engala Venkatram Reddy brings corporate excellence to social service. As the former <strong className="text-primary-700">CEO of Deccan Chargers</strong> (2009 IPL Winners) and current <strong className="text-primary-700">Chairman of KUDA</strong>, he ensures that <strong className="text-primary-700">Engala Trust</strong> operates with the highest standards of integrity and efficiency.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

