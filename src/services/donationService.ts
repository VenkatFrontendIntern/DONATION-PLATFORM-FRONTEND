import api from './api';
import { ApiResponse, PaginatedResponse, extractData, extractPaginatedData } from '../utils/apiResponse';

interface CreateOrderData {
  campaignId: string;
  amount: number;
  isAnonymous: boolean;
  donorName: string;
  donorEmail: string;
  donorPhone?: string;
  donorPan?: string;
}

interface CreateOrderResponseData {
  order: {
    id: string;
    amount: number;
    currency: string;
  };
  donationId: string;
}

interface VerifyPaymentData {
  donationId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

interface VerifyPaymentResponseData {
  donation: any;
}

interface DonationsResponseData {
  donations: any[];
  total?: number;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export const donationService = {
  createOrder: async (donationData: CreateOrderData): Promise<CreateOrderResponseData> => {
    const response = await api.post<ApiResponse<CreateOrderResponseData>>('/donation/create-order', donationData);
    return extractData(response.data);
  },

  verifyPayment: async (verificationData: VerifyPaymentData): Promise<VerifyPaymentResponseData> => {
    const response = await api.post<ApiResponse<VerifyPaymentResponseData>>('/donation/verify', verificationData);
    return extractData(response.data);
  },

  getCertificate: async (donationId: string): Promise<Blob> => {
    const response = await api.get(`/donation/certificate/${donationId}`, {
      responseType: 'blob',
    });
    return response.data;
  },

  getMyDonations: async (params: { page?: number; limit?: number } = {}): Promise<DonationsResponseData> => {
    const response = await api.get<PaginatedResponse>('/donation/my-donations', { params });
    const { items, pagination } = extractPaginatedData(response.data);
    return {
      donations: items,
      total: pagination.total,
      pagination: pagination,
    };
  },

  getCampaignDonations: async (campaignId: string, params: { limit?: number; page?: number } = {}): Promise<DonationsResponseData> => {
    const response = await api.get<ApiResponse<DonationsResponseData>>(`/donation/campaign/${campaignId}`, { params });
    return extractData(response.data);
  },
};

