import api from './api';
import { ApiResponse, extractData } from '../utils/apiResponse';

interface SubscribeNewsletterResponse {
  email: string;
}

interface SendNewsletterData {
  subject: string;
  content: string;
  campaignId?: string;
}

interface SendNewsletterResponse {
  totalSubscribers: number;
  successCount: number;
  failCount: number;
}

export const newsletterService = {
  subscribe: async (email: string): Promise<SubscribeNewsletterResponse> => {
    const response = await api.post<ApiResponse<SubscribeNewsletterResponse>>('/newsletter/subscribe', { email });
    return extractData(response.data);
  },

  unsubscribe: async (email: string): Promise<{ email: string }> => {
    const response = await api.get<ApiResponse<{ email: string }>>('/newsletter/unsubscribe', {
      params: { email },
    });
    return extractData(response.data);
  },

  sendNewsletter: async (data: SendNewsletterData): Promise<SendNewsletterResponse> => {
    const response = await api.post<ApiResponse<SendNewsletterResponse>>('/newsletter/send', data);
    return extractData(response.data);
  },
};

