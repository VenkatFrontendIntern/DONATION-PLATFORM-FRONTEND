import api from './api';

interface CampaignsResponse {
  campaigns: any[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  total?: number;
  page?: number;
  limit?: number;
}

interface StatsResponse {
  stats?: {
    totalUsers?: number;
    totalCampaigns: number;
    totalDonations: number;
    totalAmount: number;
    pendingCampaigns: number;
    approvedCampaigns: number;
    rejectedCampaigns: number;
  };
  totalUsers?: number;
  totalCampaigns?: number;
  totalDonations?: number;
  totalAmount?: number;
  pendingCampaigns?: number;
  approvedCampaigns?: number;
  rejectedCampaigns?: number;
}

interface UsersResponse {
  users: any[];
  total?: number;
}

interface DonationsResponse {
  donations: any[];
  total?: number;
}

interface CategoryData {
  name: string;
  slug?: string;
  description?: string;
}

interface CategoryResponse {
  category: any;
}

interface CategoriesResponse {
  categories: any[];
}

export const adminService = {
  getPendingCampaigns: async (status: string = 'pending', page: number = 1, limit: number = 10): Promise<CampaignsResponse> => {
    const response = await api.get<CampaignsResponse>('/admin/campaigns', { params: { status, page, limit } });
    return response.data;
  },

  approveCampaign: async (id: string): Promise<{ campaign: any }> => {
    const response = await api.put<{ campaign: any }>(`/admin/campaign/${id}/approve`);
    return response.data;
  },

  rejectCampaign: async (id: string, rejectionReason: string): Promise<{ campaign: any }> => {
    const response = await api.put<{ campaign: any }>(`/admin/campaign/${id}/reject`, { rejectionReason });
    return response.data;
  },

  getStats: async (): Promise<StatsResponse> => {
    const response = await api.get<StatsResponse>('/admin/stats');
    return response.data;
  },

  getAllUsers: async (params: { page?: number; limit?: number; search?: string } = {}): Promise<UsersResponse> => {
    const response = await api.get<UsersResponse>('/admin/users', { params });
    return response.data;
  },

  getAllDonations: async (params: { page?: number; limit?: number; campaignId?: string } = {}): Promise<DonationsResponse> => {
    const response = await api.get<DonationsResponse>('/admin/donations', { params });
    return response.data;
  },

  createCategory: async (categoryData: CategoryData): Promise<CategoryResponse> => {
    const response = await api.post<CategoryResponse>('/admin/categories', categoryData);
    return response.data;
  },

  getAllCategories: async (): Promise<CategoriesResponse> => {
    const response = await api.get<CategoriesResponse>('/admin/categories');
    return response.data;
  },

  deleteCategory: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(`/admin/categories/${id}`);
    return response.data;
  },
};

