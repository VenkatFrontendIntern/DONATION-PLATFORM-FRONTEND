import React from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Sprout } from 'lucide-react';

export const FoundationSection: React.FC = () => {
  const foundationRef = useRef(null);
  const isFoundationInView = useInView(foundationRef, { once: true, margin: "-100px" });

  return (
    <section ref={foundationRef} className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isFoundationInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-gradient-to-br from-primary-50 to-gray-50 rounded-3xl p-8 md:p-12 shadow-lg border border-primary-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
                <Sprout className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">A Heritage of Selflessness</h2>
            </div>
            <p className="text-lg text-gray-700 leading-relaxed">
              The spirit of the Engala Trust is rooted in the history of the <strong className="text-primary-700">'Deshai Anna Datha Family'</strong> of Atmakur. Inspired by his forefathers, who donated a historic <strong className="text-primary-700">4,000 acres of land</strong> to the landless poor across 105 villages, Sri Engala Venkatram Reddy established this platform to make philanthropy accessible, transparent, and impactful for everyone.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

