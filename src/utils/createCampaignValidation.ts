import toast from 'react-hot-toast';

export const validateStep = (step: number, formData: any, previewImages: string[]): boolean => {
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
      return true;
    default:
      return true;
  }
};

export const calculateProgress = (formData: any, previewImages: string[]): number => {
  const fields = [
    formData.title,
    formData.description,
    formData.organizer,
    formData.category,
    formData.goalAmount,
    formData.endDate,
    previewImages[0]
  ];
  const filled = fields.filter(f => f && f.toString().trim() !== '').length;
  return Math.round((filled / fields.length) * 100);
};

