import api from './api';
import { ApiResponse, extractData } from '../utils/apiResponse';

export interface PublicStats {
  totalUsers: number;
  totalCampaigns: number;
  totalDonations: number;
  totalAmount: number;
  uniqueDonors: number;
}

export const statsService = {
  getPublicStats: async (): Promise<PublicStats> => {
    const response = await api.get<ApiResponse<PublicStats>>('/stats');
    return extractData(response.data);
  },
};

