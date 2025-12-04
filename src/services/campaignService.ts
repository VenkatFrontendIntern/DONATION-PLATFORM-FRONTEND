import api from './api';

interface CampaignParams {
  status?: string;
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}

interface CampaignResponse {
  campaigns: any[];
  total?: number;
  page?: number;
  limit?: number;
}

interface SingleCampaignResponse {
  campaign: any;
}

interface CategoriesResponse {
  categories: any[];
}

export const campaignService = {
  getAll: async (params: CampaignParams = {}): Promise<CampaignResponse> => {
    const response = await api.get<CampaignResponse>('/campaign', { params });
    return response.data;
  },

  getById: async (id: string): Promise<SingleCampaignResponse> => {
    const response = await api.get<SingleCampaignResponse>(`/campaign/${id}`);
    return response.data;
  },

  create: async (formData: FormData): Promise<SingleCampaignResponse> => {
    const response = await api.post<SingleCampaignResponse>('/campaign', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  update: async (id: string, formData: FormData): Promise<SingleCampaignResponse> => {
    const response = await api.put<SingleCampaignResponse>(`/campaign/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  delete: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(`/campaign/${id}`);
    return response.data;
  },

  getMyCampaigns: async (): Promise<CampaignResponse> => {
    const response = await api.get<CampaignResponse>('/campaign/my-campaigns');
    return response.data;
  },

  getCategories: async (): Promise<CategoriesResponse> => {
    const response = await api.get<CategoriesResponse>('/campaign/categories');
    return response.data;
  },
};

