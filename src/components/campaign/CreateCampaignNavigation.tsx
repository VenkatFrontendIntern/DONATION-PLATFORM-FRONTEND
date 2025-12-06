import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { ArrowRight, ArrowLeft, Heart } from 'lucide-react';

interface CreateCampaignNavigationProps {
  currentStep: number;
  totalSteps: number;
  loading: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

export const CreateCampaignNavigation: React.FC<CreateCampaignNavigationProps> = ({
  currentStep,
  totalSteps,
  loading,
  onPrevious,
  onNext,
}) => {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 pt-4 sm:pt-6 pb-4 sm:pb-0"
      >
        <Button
          type="button"
          variant="outline"
          onClick={onPrevious}
          disabled={currentStep === 1}
          className="flex items-center justify-center gap-2 order-2 sm:order-1 w-full sm:w-auto min-h-[44px] touch-manipulation"
          size="md"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="text-sm sm:text-base">Previous</span>
        </Button>

        {currentStep < totalSteps ? (
          <Button
            type="button"
            onClick={onNext}
            className="flex items-center justify-center gap-2 order-1 sm:order-2 w-full sm:w-auto sm:ml-auto min-h-[44px] touch-manipulation"
            size="lg"
          >
            <span className="text-sm sm:text-base">Next Step</span>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
        ) : (
          <Button
            type="submit"
            loading={loading}
            size="lg"
            className="flex items-center justify-center gap-2 order-1 sm:order-2 w-full sm:w-auto sm:ml-auto min-h-[44px] touch-manipulation group"
          >
            <span className="flex items-center gap-2 text-sm sm:text-base">
              Submit for Review
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Button>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center gap-2 pt-2 sm:pt-4 pb-6 sm:pb-0"
      >
        <p className="text-xs sm:text-sm text-gray-500 text-center max-w-md flex items-start gap-2 px-2">
          <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-primary-500 mt-0.5 flex-shrink-0" />
          <span>Your campaign will be reviewed by our team before going live. This usually takes 24-48 hours.</span>
        </p>
      </motion.div>
    </>
  );
};

