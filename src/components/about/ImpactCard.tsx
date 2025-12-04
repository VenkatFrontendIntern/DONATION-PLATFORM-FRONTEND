import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface ImpactCardProps {
  title: string;
  icon: LucideIcon;
  items: string[];
}

export const ImpactCard: React.FC<ImpactCardProps> = ({ title, icon: Icon, items }) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.5,
            ease: "easeOut" as const,
          },
        },
      }}
      className="relative group"
    >
      <div className="bg-white rounded-2xl p-8 border border-gray-200 hover:shadow-xl transition-all duration-300 h-full">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
            <Icon className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          </div>
        </div>
        <ul className="space-y-3">
          {items.map((item, itemIndex) => {
            const parts = item.split(/(\*\*.*?\*\*)/g);
            return (
              <li key={itemIndex} className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-700 leading-relaxed">
                  {parts.map((part, partIndex) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                      const boldText = part.slice(2, -2);
                      return <strong key={partIndex} className="text-primary-700">{boldText}</strong>;
                    }
                    return <span key={partIndex}>{part}</span>;
                  })}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </motion.div>
  );
};

