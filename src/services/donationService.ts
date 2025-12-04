import api from './api';

interface CreateOrderData {
  campaignId: string;
  amount: number;
  isAnonymous: boolean;
  donorName: string;
  donorEmail: string;
  donorPhone?: string;
  donorPan?: string;
}

interface CreateOrderResponse {
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

interface VerifyPaymentResponse {
  success: boolean;
  message: string;
}

interface DonationsResponse {
  donations: any[];
  total?: number;
}

export const donationService = {
  createOrder: async (donationData: CreateOrderData): Promise<CreateOrderResponse> => {
    const response = await api.post<CreateOrderResponse>('/donation/create-order', donationData);
    return response.data;
  },

  verifyPayment: async (verificationData: VerifyPaymentData): Promise<VerifyPaymentResponse> => {
    const response = await api.post<VerifyPaymentResponse>('/donation/verify', verificationData);
    return response.data;
  },

  getCertificate: async (donationId: string): Promise<Blob> => {
    const response = await api.get(`/donation/certificate/${donationId}`, {
      responseType: 'blob',
    });
    return response.data;
  },

  getMyDonations: async (): Promise<DonationsResponse> => {
    const response = await api.get<DonationsResponse>('/donation/my-donations');
    return response.data;
  },

  getCampaignDonations: async (campaignId: string, params: { limit?: number; page?: number } = {}): Promise<DonationsResponse> => {
    const response = await api.get<DonationsResponse>(`/donation/campaign/${campaignId}`, { params });
    return response.data;
  },
};

