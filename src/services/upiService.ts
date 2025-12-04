import api from './api';

interface GenerateQRData {
  campaignId: string;
  amount: number;
  donorName: string;
  donorEmail: string;
}

interface GenerateQRResponse {
  qrCode: string;
  upiId: string;
  amount: number;
}

export const upiService = {
  generateQR: async (donationData: GenerateQRData): Promise<GenerateQRResponse> => {
    const response = await api.post<GenerateQRResponse>('/upi/generate-qr', donationData);
    return response.data;
  },
};

