import React from 'react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { ImageUpload } from '../components/campaign/ImageUpload';
import { CategorySelector } from '../components/campaign/CategorySelector';
import { SocialMediaLinks } from '../components/campaign/SocialMediaLinks';
import { useCampaignForm } from '../hooks/useCampaignForm';
import { CURRENCY_SYMBOL } from '../constants';

const CreateCampaign: React.FC = () => {
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

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pb-24">
      <h1 className="text-3xl font-bold mb-8">Start a Campaign</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Campaign Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          placeholder="e.g., Help Save a Life"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={6}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Tell your story..."
          />
        </div>

        <Input
          label="Organizer Name"
          name="organizer"
          value={formData.organizer}
          onChange={handleChange}
          required
        />

        <CategorySelector
          categories={categories}
          selectedCategory={formData.category}
          onSelectCategory={(categoryId) => setFormData({ ...formData, category: categoryId })}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label={`Goal Amount (${CURRENCY_SYMBOL})`}
            name="goalAmount"
            type="number"
            value={formData.goalAmount}
            onChange={handleChange}
            required
            min="100"
          />
          <Input
            label="End Date"
            name="endDate"
            type="date"
            value={formData.endDate}
            onChange={handleChange}
            required
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

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

        <SocialMediaLinks formData={formData} onChange={handleChange} />

        <Button type="submit" fullWidth loading={loading}>
          Submit for Review
        </Button>
      </form>
    </div>
  );
};

export default CreateCampaign;
