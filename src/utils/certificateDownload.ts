import { donationService } from '../services/donationService';
import { getErrorMessage } from './apiResponse';
import toast from 'react-hot-toast';

export const downloadCertificate = async (donationId: string): Promise<void> => {
  try {
    const blob = await donationService.getCertificate(donationId);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `80G-Certificate-${donationId}.pdf`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    toast.success('Certificate downloaded');
  } catch (error: any) {
    const errorMessage = getErrorMessage(error);
    toast.error(errorMessage || 'Failed to download certificate. Please try again.');
    throw error;
  }
};

