import api from './api';
import { ApiResponse, PaginatedResponse, extractData, extractPaginatedData } from '../utils/apiResponse';

interface CampaignsResponse {
  campaigns: any[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
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
    const response = await api.get<PaginatedResponse>('/admin/campaigns', { params: { status, page, limit } });
    const { items, pagination } = extractPaginatedData(response.data);
    return {
      campaigns: items,
      pagination,
    };
  },

  approveCampaign: async (id: string): Promise<{ campaign: any }> => {
    const response = await api.put<ApiResponse<{ campaign: any }>>(`/admin/campaign/${id}/approve`);
    return extractData(response.data);
  },

  rejectCampaign: async (id: string, rejectionReason: string): Promise<{ campaign: any }> => {
    const response = await api.put<ApiResponse<{ campaign: any }>>(`/admin/campaign/${id}/reject`, { rejectionReason });
    return extractData(response.data);
  },

  getStats: async (): Promise<StatsResponse> => {
    const response = await api.get<ApiResponse<StatsResponse>>('/admin/stats');
    return extractData(response.data);
  },

  getPaymentMethodAnalytics: async (): Promise<{
    paymentMethods: Array<{
      method: string;
      totalAmount: number;
      totalCount: number;
      successCount: number;
      failedCount: number;
      pendingCount: number;
      successAmount: number;
      successRate: number;
    }>;
    statusBreakdown: Record<string, { count: number; amount: number }>;
  }> => {
    try {
      const response = await api.get<ApiResponse<{
        paymentMethods: Array<{
          method: string;
          totalAmount: number;
          totalCount: number;
          successCount: number;
          failedCount: number;
          pendingCount: number;
          successAmount: number;
          successRate: number;
        }>;
        statusBreakdown: Record<string, { count: number; amount: number }>;
      }>>('/admin/payment-analytics');
      return extractData(response.data);
    } catch (error: any) {
      // Return empty data if API fails
      return {
        paymentMethods: [],
        statusBreakdown: {},
      };
    }
  },

  getAllUsers: async (params: { page?: number; limit?: number; search?: string } = {}): Promise<UsersResponse> => {
    const response = await api.get<PaginatedResponse>('/admin/users', { params });
    const { items, pagination } = extractPaginatedData(response.data);
    return {
      users: items,
      total: pagination.total,
    };
  },

  getAllDonations: async (params: { page?: number; limit?: number; campaignId?: string } = {}): Promise<DonationsResponse> => {
    const response = await api.get<PaginatedResponse>('/admin/donations', { params });
    const { items, pagination } = extractPaginatedData(response.data);
    return {
      donations: items,
      total: pagination.total,
    };
  },

  createCategory: async (categoryData: CategoryData): Promise<CategoryResponse> => {
    const response = await api.post<ApiResponse<CategoryResponse>>('/admin/categories', categoryData);
    return extractData(response.data);
  },

  getAllCategories: async (): Promise<CategoriesResponse> => {
    const response = await api.get<ApiResponse<CategoriesResponse>>('/admin/categories');
    return extractData(response.data);
  },

  deleteCategory: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete<ApiResponse<{ message: string }>>(`/admin/categories/${id}`);
    return extractData(response.data);
  },
};

