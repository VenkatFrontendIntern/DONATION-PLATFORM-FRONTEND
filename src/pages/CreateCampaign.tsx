import React, { useState, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useCampaignForm } from '../hooks/useCampaignForm';
import { CreateCampaignHeader } from '../components/campaign/CreateCampaignHeader';
import { 
  BasicInfoStep, 
  CategoryStep, 
  GoalsStep, 
  ImagesStep, 
  SocialMediaStep 
} from '../components/campaign/steps';
import { CreateCampaignNavigation } from '../components/campaign/CreateCampaignNavigation';
import { validateStep, calculateProgress } from '../utils/createCampaignValidation';
import { FileText, Target, Image as ImageIcon, Share2 } from 'lucide-react';

const TOTAL_STEPS = 5;

const CreateCampaign: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const {
    formData,
    setFormData,
    previewImages,
    previewVideos,
    categories,
    loading,
    handleChange,
    handleCoverImageChange,
    handleGalleryImagesChange,
    handleVideosChange,
    removeImage,
    removeVideo,
    handleSubmit,
  } = useCampaignForm();

  const progress = useMemo(() => calculateProgress(formData, previewImages), [formData, previewImages]);

  const steps = useMemo(() => [
    { number: 1, title: 'Basic Info', icon: FileText },
    { number: 2, title: 'Category', icon: Target },
    { number: 3, title: 'Goals', icon: Target },
    { number: 4, title: 'Images', icon: ImageIcon },
    { number: 5, title: 'Social Links', icon: Share2 },
  ], []);

  const handleNext = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (validateStep(currentStep, formData, previewImages)) {
      if (currentStep < TOTAL_STEPS) {
        setCurrentStep(currentStep + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handlePrevious = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Only allow submission on the last step
    if (currentStep !== TOTAL_STEPS) {
      // If not on last step, just go to next step
      handleNext();
      return;
    }
    
    if (validateStep(currentStep, formData, previewImages)) {
      await handleSubmit(e);
    }
  };

  // Prevent form submission on Enter key press unless on last step
  const handleFormKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && currentStep !== TOTAL_STEPS) {
      e.preventDefault();
      handleNext();
    }
  };

  const stepProps = {
    stepNumber: currentStep,
    currentStep,
    formData,
    previewImages,
    previewVideos,
    categories,
    handleChange,
    setFormData,
    handleCoverImageChange,
    handleGalleryImagesChange,
    handleVideosChange,
    removeImage,
    removeVideo,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-4 sm:py-6 md:py-8 px-3 sm:px-4 md:px-6">
      <div className="max-w-5xl mx-auto">
        <CreateCampaignHeader
          currentStep={currentStep}
          totalSteps={TOTAL_STEPS}
          progress={progress}
          steps={steps}
        />

        <form onSubmit={handleFormSubmit} onKeyDown={handleFormKeyDown} className="space-y-4 sm:space-y-6">
          <AnimatePresence mode="wait">
            {currentStep === 1 && <BasicInfoStep key="step-1" {...stepProps} />}
            {currentStep === 2 && <CategoryStep key="step-2" {...stepProps} />}
            {currentStep === 3 && <GoalsStep key="step-3" {...stepProps} />}
            {currentStep === 4 && <ImagesStep key="step-4" {...stepProps} />}
            {currentStep === 5 && <SocialMediaStep key="step-5" {...stepProps} />}
          </AnimatePresence>

          <CreateCampaignNavigation
            currentStep={currentStep}
            totalSteps={TOTAL_STEPS}
            loading={loading}
            onPrevious={handlePrevious}
            onNext={handleNext}
          />
        </form>
      </div>
    </div>
  );
};

export default CreateCampaign;
