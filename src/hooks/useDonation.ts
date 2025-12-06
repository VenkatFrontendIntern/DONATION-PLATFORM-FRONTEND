import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useDonationForm } from './useDonationForm';
import { usePaymentVerification } from './usePaymentVerification';
import { downloadCertificate } from '../utils/certificateDownload';
import toast from 'react-hot-toast';

interface UseDonationProps {
  campaignId: string | undefined;
  campaignTitle: string;
  onSuccess?: () => void;
}

export const useDonation = ({ campaignId, campaignTitle, onSuccess }: UseDonationProps) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [showDonateModal, setShowDonateModal] = useState(false);

  const donationForm = useDonationForm();
  const paymentVerification = usePaymentVerification();

  const handleDonate = async () => {
    if (!donationForm.donationAmount || !campaignId) return;

    if (!isAuthenticated) {
      toast.error('Please login to donate');
      navigate('/login');
      return;
    }

    if (!donationForm.donorName || !donationForm.donorEmail) {
      toast.error('Please fill in your details');
      return;
    }

    setShowDonateModal(false);

    try {
      await paymentVerification.processPayment({
        campaignId,
        campaignTitle,
        donationAmount: Number(donationForm.donationAmount),
        isAnonymous: donationForm.isAnonymous,
        donorName: donationForm.donorName,
        donorEmail: donationForm.donorEmail,
        donorPhone: donationForm.donorPhone || undefined,
        donorPan: donationForm.donorPan ? donationForm.donorPan.toUpperCase() : undefined,
      }, () => {
        setShowDonateModal(true);
        onSuccess?.();
      });

      setShowDonateModal(true);
    } catch (error) {
      setShowDonateModal(true);
    }
  };

  const handleDownloadCertificate = async () => {
    if (!paymentVerification.donationId) return;
    await downloadCertificate(paymentVerification.donationId);
  };

  const resetModal = () => {
    setShowDonateModal(false);
    paymentVerification.resetState();
  };

  return {
    ...donationForm,
    showDonateModal,
    setShowDonateModal,
    processing: paymentVerification.processing,
    success: paymentVerification.success,
    donationId: paymentVerification.donationId,
    handleDonate,
    handleDownloadCertificate,
    resetModal,
  };
};

