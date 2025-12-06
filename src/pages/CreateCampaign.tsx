import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { ImageUpload } from '../components/campaign/ImageUpload';
import { CategorySelector } from '../components/campaign/CategorySelector';
import { SocialMediaLinks } from '../components/campaign/SocialMediaLinks';
import { useCampaignForm } from '../hooks/useCampaignForm';
import { CURRENCY_SYMBOL } from '../constants';
import { 
  Sparkles, 
  FileText, 
  Target, 
  Image as ImageIcon, 
  Share2,
  ArrowRight,
  ArrowLeft,
  Heart,
  CheckCircle2
} from 'lucide-react';
import toast from 'react-hot-toast';

const TOTAL_STEPS = 5;

const CreateCampaign: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const {
    formData,
    setFormData,
    previewImages,
    categories,
    loading,
    handleChange,
    handleCoverImageChange,
    handleGalleryImagesChange,
    removeImage,
    handleSubmit,
  } = useCampaignForm();

  // Calculate form completion percentage
  const calculateProgress = () => {
    const fields = [
      formData.title,
      formData.description,
      formData.organizer,
      formData.category,
      formData.goalAmount,
      formData.endDate,
      previewImages[0] // cover image
    ];
    const filled = fields.filter(f => f && f.toString().trim() !== '').length;
    return Math.round((filled / fields.length) * 100);
  };

  const progress = calculateProgress();

  // Step validation
  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!formData.title.trim() || !formData.description.trim() || !formData.organizer.trim()) {
          toast.error('Please fill in all required fields');
          return false;
        }
        return true;
      case 2:
        if (!formData.category) {
          toast.error('Please select a category');
          return false;
        }
        return true;
      case 3:
        if (!formData.goalAmount || parseFloat(formData.goalAmount) < 100) {
          toast.error('Please enter a valid goal amount (minimum ₹100)');
          return false;
        }
        if (!formData.endDate) {
          toast.error('Please select an end date');
          return false;
        }
        return true;
      case 4:
        if (!previewImages[0]) {
          toast.error('Please upload a cover image');
          return false;
        }
        return true;
      case 5:
        // Social media is optional, so always valid
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < TOTAL_STEPS) {
        setCurrentStep(currentStep + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep(currentStep)) {
      await handleSubmit(e);
    }
  };

  const steps = [
    { number: 1, title: 'Basic Info', icon: FileText },
    { number: 2, title: 'Category', icon: Target },
    { number: 3, title: 'Goals', icon: Target },
    { number: 4, title: 'Images', icon: ImageIcon },
    { number: 5, title: 'Social Links', icon: Share2 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-4 sm:py-6 md:py-8 px-3 sm:px-4 md:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
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
          
          {/* Step Indicator - Mobile Optimized */}
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

          {/* Progress Bar */}
          <div className="mt-4 sm:mt-6 max-w-md mx-auto px-2">
            <div className="flex justify-between text-xs sm:text-sm text-gray-600 mb-2">
              <span>Step {currentStep} of {TOTAL_STEPS}</span>
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

        <form onSubmit={handleFormSubmit} className="space-y-4 sm:space-y-6">
          <AnimatePresence mode="wait">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
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
            )}

            {/* Step 2: Category Selection */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl sm:rounded-2xl shadow-lg shadow-gray-200/50 p-4 sm:p-6 md:p-8 border border-gray-100"
              >
                <div className="flex items-start sm:items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                  <div className="p-1.5 sm:p-2 bg-secondary-100 rounded-lg flex-shrink-0">
                    <Target className="w-4 h-4 sm:w-5 sm:h-5 text-secondary-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Choose Category</h2>
                    <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">Select the category that best fits your campaign</p>
                  </div>
                </div>
                <CategorySelector
                  categories={categories}
                  selectedCategory={formData.category}
                  onSelectCategory={(categoryId) => setFormData({ ...formData, category: categoryId })}
                />
              </motion.div>
            )}

            {/* Step 3: Goals & Timeline */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl sm:rounded-2xl shadow-lg shadow-gray-200/50 p-4 sm:p-6 md:p-8 border border-gray-100"
              >
                <div className="flex items-start sm:items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                  <div className="p-1.5 sm:p-2 bg-primary-100 rounded-lg flex-shrink-0">
                    <Target className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Goals & Timeline</h2>
                    <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">Set your fundraising goal and deadline</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <Input
                      label={`Goal Amount (${CURRENCY_SYMBOL})`}
                      name="goalAmount"
                      type="number"
                      value={formData.goalAmount}
                      onChange={handleChange}
                      required
                      min="100"
                      placeholder="1000"
                    />
                    <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-gray-500">
                      Minimum amount: {CURRENCY_SYMBOL}100
                    </p>
                  </div>
                  <div>
                    <Input
                      label="End Date"
                      name="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={handleChange}
                      required
                      min={new Date().toISOString().split('T')[0]}
                    />
                    <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-gray-500">
                      When do you want to end this fundraiser?
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 4: Images */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl sm:rounded-2xl shadow-lg shadow-gray-200/50 p-4 sm:p-6 md:p-8 border border-gray-100"
              >
                <div className="flex items-start sm:items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                  <div className="p-1.5 sm:p-2 bg-secondary-100 rounded-lg flex-shrink-0">
                    <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5 text-secondary-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Visuals</h2>
                    <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">Add images to make your campaign stand out</p>
                  </div>
                </div>
                
                <div className="space-y-4 sm:space-y-6">
                  <ImageUpload
                    label="Cover Image"
                    required
                    previewImages={previewImages}
                    onCoverImageChange={handleCoverImageChange}
                    onRemoveImage={removeImage}
                  />

                  <ImageUpload
                    label="Gallery Images (Optional)"
                    previewImages={previewImages}
                    onGalleryImagesChange={handleGalleryImagesChange}
                    onRemoveImage={removeImage}
                    isGallery
                  />
                </div>
              </motion.div>
            )}

            {/* Step 5: Social Media */}
            {currentStep === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl sm:rounded-2xl shadow-lg shadow-gray-200/50 p-4 sm:p-6 md:p-8 border border-gray-100"
              >
                <div className="flex items-start sm:items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                  <div className="p-1.5 sm:p-2 bg-primary-100 rounded-lg flex-shrink-0">
                    <Share2 className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Social Media Links</h2>
                    <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">Connect your social profiles (Optional)</p>
                  </div>
                </div>
                <SocialMediaLinks formData={formData} onChange={handleChange} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons - Mobile Optimized */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 pt-4 sm:pt-6 pb-4 sm:pb-0"
          >
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex items-center justify-center gap-2 order-2 sm:order-1 w-full sm:w-auto min-h-[44px] touch-manipulation"
              size="md"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base">Previous</span>
            </Button>

            {currentStep < TOTAL_STEPS ? (
              <Button
                type="button"
                onClick={handleNext}
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

          {/* Info Message */}
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
        </form>
      </div>
    </div>
  );
};

export default CreateCampaign;
