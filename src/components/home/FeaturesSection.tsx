import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, FileCheck, Zap } from 'lucide-react';

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

const features = [
  {
    icon: ShieldCheck,
    title: '100% Secure Payments',
    description: 'Your donations are protected with military-grade encryption and secure payment gateways.',
    gradient: 'from-blue-50 to-blue-100/50',
    border: 'border-blue-200/50',
    iconGradient: 'from-blue-500 to-blue-600',
  },
  {
    icon: FileCheck,
    title: 'Instant 80G Certificates',
    description: 'Receive tax exemption certificates instantly via email after every successful donation.',
    gradient: 'from-primary-50 to-primary-100/50',
    border: 'border-primary-200/50',
    iconGradient: 'from-primary-500 to-primary-600',
  },
  {
    icon: Zap,
    title: 'Fast Withdrawals',
    description: 'Campaign organizers receive funds directly to their bank accounts with minimal waiting time.',
    gradient: 'from-purple-50 to-purple-100/50',
    border: 'border-purple-200/50',
    iconGradient: 'from-purple-500 to-purple-600',
  },
];

export const FeaturesSection: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              variants={itemVariants} 
              className={`p-8 bg-gradient-to-br ${feature.gradient} rounded-2xl border ${feature.border} hover:shadow-xl transition-all duration-300`}
            >
              <div className={`w-14 h-14 bg-gradient-to-br ${feature.iconGradient} text-white rounded-xl flex items-center justify-center mb-6 shadow-lg`}>
                <feature.icon size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

