import React from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Stethoscope, GraduationCap, Building2, TreePine } from 'lucide-react';
import { ImpactCard } from './ImpactCard';

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

const impactCards = [
  {
    title: 'Healthcare (Medical Fund)',
    icon: Stethoscope,
    items: [
      'Donated **₹1 Crore** worth of critical medical equipment to the NICU at **MGM Hospital, Warangal**[cite: 206].',
      'Provided **₹1 Lakh** to the Red Cross for TB patients [cite: 226] and supported 200+ individuals with medical aid.'
    ],
  },
  {
    title: 'Education & Empowerment',
    icon: GraduationCap,
    items: [
      'Established a **Tailoring Institute** for women\'s self-employment[cite: 182].',
      'Sponsors coaching and study materials for underprivileged students in government schools[cite: 168].'
    ],
  },
  {
    title: 'Village Development',
    icon: Building2,
    items: [
      'Invested **₹3 Crores** in 40 villages for roads, borewells, and LED lighting[cite: 167].',
      'Donated a **Tractor** to Atmakur Gram Panchayat for better sanitation[cite: 184].'
    ],
  },
  {
    title: 'Culture & Nature',
    icon: TreePine,
    items: [
      'Spearheaded the renovation of ancient temples in Atmakur and Nerkulla[cite: 175].',
      'Adopted an **Ostrich** at Kakatiya Zoo Park [cite: 200] to promote wildlife conservation.'
    ],
  },
];

export const ImpactSection: React.FC = () => {
  const impactRef = useRef(null);
  const isImpactInView = useInView(impactRef, { once: true, margin: "-100px" });

  return (
    <section ref={impactRef} className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isImpactInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto mb-12"
        >
          <p className="text-lg text-gray-700 leading-relaxed text-center">
            Before launching this platform, our Chairman set the standard for impactful giving through the Engala Charitable Trust. These achievements form the blueprint for the causes we support today:
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isImpactInView ? "visible" : "hidden"}
        >
          {impactCards.map((card, index) => (
            <ImpactCard
              key={index}
              title={card.title}
              icon={card.icon}
              items={card.items}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

