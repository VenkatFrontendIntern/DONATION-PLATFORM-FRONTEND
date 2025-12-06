import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, FileText, Target, Image as ImageIcon, Share2, CheckCircle2 } from 'lucide-react';

interface Step {
  number: number;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface CreateCampaignHeaderProps {
  currentStep: number;
  totalSteps: number;
  progress: number;
  steps: Step[];
}

export const CreateCampaignHeader: React.FC<CreateCampaignHeaderProps> = ({
  currentStep,
  totalSteps,
  progress,
  steps,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center mb-4 sm:mb-6 md:mb-8"
    >
      <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl sm:rounded-2xl mb-3 sm:mb-4 shadow-lg shadow-primary-500/30">
        <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
      </div>
      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2 sm:mb-3 px-2">
        Start Your Fundraiser
      </h1>
      <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-2">
        Share your story and make a difference. Let's create something amazing together.
      </p>
      
      <div className="mt-4 sm:mt-6 md:mt-8 mb-4 sm:mb-6 px-2">
        <div className="flex items-center justify-center gap-1 sm:gap-2 md:gap-3 lg:gap-4 flex-wrap">
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            const isCompleted = currentStep > step.number;
            const isCurrent = currentStep === step.number;
            
            return (
              <React.Fragment key={step.number}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex flex-col items-center gap-1 sm:gap-2"
                >
                  <div
                    className={`relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full border-2 transition-all duration-300 touch-manipulation ${
                      isCompleted
                        ? 'bg-primary-500 border-primary-500 text-white'
                        : isCurrent
                        ? 'bg-primary-100 border-primary-500 text-primary-600 scale-110'
                        : 'bg-white border-gray-300 text-gray-400'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />
                    ) : (
                      <StepIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                    )}
                  </div>
                  <span
                    className={`text-[10px] sm:text-xs font-medium hidden xs:block ${
                      isCurrent ? 'text-primary-600' : 'text-gray-500'
                    }`}
                  >
                    {step.title}
                  </span>
                </motion.div>
                {index < steps.length - 1 && (
                  <div
                    className={`h-0.5 w-4 sm:w-6 md:w-8 lg:w-12 xl:w-16 transition-all duration-300 ${
                      currentStep > step.number ? 'bg-primary-500' : 'bg-gray-300'
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <div className="mt-4 sm:mt-6 max-w-md mx-auto px-2">
        <div className="flex justify-between text-xs sm:text-sm text-gray-600 mb-2">
          <span>Step {currentStep} of {totalSteps}</span>
          <span className="font-semibold text-primary-600">{progress}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 sm:h-2.5 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </div>
    </motion.div>
  );
};

