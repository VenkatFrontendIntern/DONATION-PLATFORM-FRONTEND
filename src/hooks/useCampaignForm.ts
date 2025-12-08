import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { campaignService } from '../services/campaignService';
import { adminService } from '../services/adminService';
import { validators } from '../utils/validators';
import toast from 'react-hot-toast';

export const useCampaignForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    organizer: '',
    goalAmount: '',
    category: '',
    endDate: '',
    facebook: '',
    instagram: '',
    twitter: '',
    linkedin: '',
    whatsapp: '',
    youtube: '',
  });
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [galleryImages, setGalleryImages] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [previewVideos, setPreviewVideos] = useState<string[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await adminService.getAllCategories();
      setCategories(response.categories || []);
    } catch (error) {
      toast.error('Failed to load categories. Please refresh the page.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImages([reader.result as string]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setGalleryImages([...galleryImages, ...files]);
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewImages((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleVideosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setVideos([...videos, ...files]);
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewVideos((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    if (index === 0) {
      setCoverImage(null);
      setPreviewImages(previewImages.slice(1));
    } else {
      setGalleryImages(galleryImages.filter((_, i) => i !== index - 1));
      setPreviewImages(previewImages.filter((_, i) => i !== index));
    }
  };

  const removeVideo = (index: number) => {
    setVideos(videos.filter((_, i) => i !== index));
    setPreviewVideos(previewVideos.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!coverImage) {
      toast.error('Please upload a cover image');
      return;
    }

    if (!formData.category || formData.category.trim() === '') {
      toast.error('Please select a category');
      return;
    }

    if (!validators.amount(parseFloat(formData.goalAmount))) {
      toast.error('Please enter a valid goal amount');
      return;
    }

    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('organizer', formData.organizer);
      formDataToSend.append('goalAmount', formData.goalAmount);
      formDataToSend.append('category', formData.category.trim());
      formDataToSend.append('endDate', formData.endDate);
      formDataToSend.append('image', coverImage);
      
      if (formData.facebook) formDataToSend.append('socialMedia[facebook]', formData.facebook);
      if (formData.instagram) formDataToSend.append('socialMedia[instagram]', formData.instagram);
      if (formData.twitter) formDataToSend.append('socialMedia[twitter]', formData.twitter);
      if (formData.linkedin) formDataToSend.append('socialMedia[linkedin]', formData.linkedin);
      if (formData.whatsapp) formDataToSend.append('socialMedia[whatsapp]', formData.whatsapp);
      if (formData.youtube) formDataToSend.append('socialMedia[youtube]', formData.youtube);
      
      galleryImages.forEach((img) => {
        formDataToSend.append('images', img);
      });

      videos.forEach((video) => {
        formDataToSend.append('videos', video);
      });

      await campaignService.create(formDataToSend);
      toast.success('Campaign created successfully! It will be reviewed by admin.');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create campaign');
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    setFormData,
    coverImage,
    galleryImages,
    videos,
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
  };
};

