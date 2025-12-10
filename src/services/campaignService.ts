import api from './api';
import { ApiResponse, PaginatedResponse, extractData, extractPaginatedData } from '../utils/apiResponse';

interface CampaignParams {
  status?: string;
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}

interface CampaignResponse {
  campaigns: any[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

interface SingleCampaignResponse {
  campaign: any;
}

interface CategoriesResponse {
  categories: any[];
}

export const campaignService = {
  getAll: async (params: CampaignParams = {}): Promise<CampaignResponse> => {
    const response = await api.get<PaginatedResponse>('/campaign', { params });
    const { items, pagination } = extractPaginatedData(response.data);
    return {
      campaigns: items,
      total: pagination.total,
      page: pagination.page,
      limit: pagination.limit,
      pages: pagination.pages,
    };
  },

  getById: async (id: string): Promise<SingleCampaignResponse> => {
    const response = await api.get<ApiResponse<SingleCampaignResponse>>(`/campaign/${id}`);
    return extractData(response.data);
  },

  create: async (formData: FormData): Promise<SingleCampaignResponse> => {
    const response = await api.post<ApiResponse<SingleCampaignResponse>>('/campaign', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return extractData(response.data);
  },

  update: async (id: string, formData: FormData): Promise<SingleCampaignResponse> => {
    const response = await api.put<ApiResponse<SingleCampaignResponse>>(`/campaign/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return extractData(response.data);
  },

  delete: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete<ApiResponse<{ message: string }>>(`/campaign/${id}`);
    return extractData(response.data);
  },

  getMyCampaigns: async (params: { page?: number; limit?: number } = {}): Promise<CampaignResponse> => {
    const response = await api.get<PaginatedResponse>('/campaign/my-campaigns', { params });
    const { items, pagination } = extractPaginatedData(response.data);
    return {
      campaigns: items,
      total: pagination.total,
      page: pagination.page,
      limit: pagination.limit,
      pages: pagination.pages,
    };
  },

  getCategories: async (): Promise<CategoriesResponse> => {
    const response = await api.get<ApiResponse<CategoriesResponse>>('/campaign/categories');
    return extractData(response.data);
  },
};

