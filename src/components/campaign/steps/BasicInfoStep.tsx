import React from 'react';
import { motion } from 'framer-motion';
import { Input } from '../../ui/Input';
import { FileText } from 'lucide-react';

interface StepProps {
  currentStep: number;
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const BasicInfoStep: React.FC<StepProps> = ({
  currentStep,
  formData,
  handleChange,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl sm:rounded-2xl shadow-lg shadow-gray-200/50 p-4 sm:p-6 md:p-8 border border-gray-100"
    >
      <div className="flex items-start sm:items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <div className="p-1.5 sm:p-2 bg-primary-100 rounded-lg flex-shrink-0">
          <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Basic Information</h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">Tell us about your campaign</p>
        </div>
      </div>
      
      <div className="space-y-4 sm:space-y-6">
        <Input
          label="Campaign Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          placeholder="e.g., Help Save a Life"
        />

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Your Story <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={6}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-300 rounded-lg sm:rounded-xl shadow-sm focus:outline-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-300 bg-white/80 backdrop-blur-sm resize-none"
            placeholder="Tell your story... Share what inspired you to start this fundraiser and how it will make a difference."
          />
          <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-gray-500">
            A compelling story helps people connect with your cause
          </p>
        </div>

        <Input
          label="Organizer Name"
          name="organizer"
          value={formData.organizer}
          onChange={handleChange}
          required
          placeholder="Your full name"
        />
      </div>
    </motion.div>
  );
};

