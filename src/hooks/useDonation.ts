import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { donationService } from '../services/donationService';
import { openRazorpay } from '../utils/razorpay';
import { useAuth } from '../contexts/AuthContext';
import { getErrorMessage } from '../utils/apiResponse';
import toast from 'react-hot-toast';

interface UseDonationProps {
  campaignId: string | undefined;
  campaignTitle: string;
  onSuccess?: () => void;
}

export const useDonation = ({ campaignId, campaignTitle, onSuccess }: UseDonationProps) => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [donationAmount, setDonationAmount] = useState<number | ''>('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [donorPhone, setDonorPhone] = useState('');
  const [donorPan, setDonorPan] = useState('');
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [donationId, setDonationId] = useState<string | null>(null);

  useEffect(() => {
    if (user && isAuthenticated) {
      setDonorName(user.name || '');
      setDonorEmail(user.email || '');
      setDonorPhone(user.phone || '');
      setDonorPan(user.pan || '');
    }
  }, [user, isAuthenticated]);

  // Retry utility for network failures
  const retryWithBackoff = async <T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000
  ): Promise<T> => {
    let lastError: any;
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error: any) {
        lastError = error;
        
        // Don't retry on client errors (4xx) - these are not network issues
        if (error.response?.status >= 400 && error.response?.status < 500) {
          throw error;
        }
        
        // Check if it's a network error
        const isNetworkError = 
          !error.response || // No response means network error
          error.code === 'ECONNABORTED' ||
          error.code === 'ETIMEDOUT' ||
          error.message?.includes('Network Error') ||
          error.message?.includes('timeout') ||
          error.message?.includes('network');
        
        if (!isNetworkError && attempt < maxRetries - 1) {
          throw error; // Not a network error, don't retry
        }
        
        if (attempt < maxRetries - 1) {
          const delay = baseDelay * Math.pow(2, attempt);
          console.warn(`Network error on attempt ${attempt + 1}, retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    throw lastError;
  };

  const handleDonate = async () => {
    if (!donationAmount || !campaignId) return;

    if (!isAuthenticated) {
      toast.error('Please login to donate');
      navigate('/login');
      return;
    }

    if (!donorName || !donorEmail) {
      toast.error('Please fill in your details');
      return;
    }

    setProcessing(true);
    try {
      // Create order first
      const orderResponse = await donationService.createOrder({
        campaignId,
        amount: Number(donationAmount),
        isAnonymous,
        donorName,
        donorEmail,
        donorPhone: donorPhone || undefined,
        donorPan: donorPan ? donorPan.toUpperCase() : undefined,
      });

      // Validate order response
      if (!orderResponse) {
        throw new Error('Failed to create payment order. Please try again.');
      }

      const { order, donationId: newDonationId } = orderResponse;
      
      if (!order) {
        throw new Error('Order creation failed. Please try again.');
      }

      if (!order.id || order.amount === undefined) {
        throw new Error('Invalid order response. Please try again.');
      }

      setDonationId(newDonationId);

      const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
      if (!razorpayKey) {
        toast.error('Razorpay key not configured. Please set VITE_RAZORPAY_KEY_ID in .env');
        setProcessing(false);
        return;
      }

      // Close donation modal immediately before opening Razorpay
      setShowDonateModal(false);

      // Open Razorpay checkout immediately
      const razorpayResponse = await openRazorpay({
        key: razorpayKey,
        amount: order.amount,
        currency: order.currency || 'INR',
        order_id: order.id,
        name: 'Engala Trust',
        description: `Donation for ${campaignTitle}`,
        prefill: {
          name: donorName,
          email: donorEmail,
          contact: donorPhone,
        },
        modal: {
          ondismiss: () => {
            // Reopen donation modal if user closes Razorpay without paying
            setShowDonateModal(true);
            setProcessing(false);
          },
        },
      });

      // Verify payment after successful Razorpay payment (with retry for network failures)
      try {
        await retryWithBackoff(
          () => donationService.verifyPayment({
            donationId: newDonationId,
            razorpayOrderId: order.id,
            razorpayPaymentId: razorpayResponse.razorpay_payment_id,
            razorpaySignature: razorpayResponse.razorpay_signature,
          }),
          3,
          1000
        );

        setSuccess(true);
        setShowDonateModal(true); // Reopen modal to show success message
        toast.success('Donation successful! 80G certificate sent to your email.');
        onSuccess?.();
      } catch (verifyError: any) {
        // Check if payment was already verified (idempotency)
        const errorMessage = getErrorMessage(verifyError);
        if (errorMessage.includes('already') || verifyError.response?.status === 200) {
          // Payment was already verified, treat as success
          setSuccess(true);
          setShowDonateModal(true);
          toast.success('Donation verified! 80G certificate sent to your email.');
          onSuccess?.();
        } else {
          // Network error or other error - show warning but payment might have succeeded
          const isNetworkError = 
            !verifyError.response ||
            verifyError.code === 'ECONNABORTED' ||
            verifyError.message?.includes('Network Error');
          
          if (isNetworkError) {
            toast.error(
              'Network error occurred during verification. Your payment may have been processed. Please check your email or dashboard for confirmation.',
              { duration: 6000 }
            );
            // Still show success state as payment was completed in Razorpay
            setSuccess(true);
            setShowDonateModal(true);
            onSuccess?.();
          } else {
            throw verifyError; // Re-throw non-network errors
          }
        }
      }
    } catch (error: any) {
      // Reopen modal on error
      setShowDonateModal(true);
      // Extract user-friendly error message
      const errorMessage = getErrorMessage(error);
      
      // Check if it's a network error
      const isNetworkError = 
        !error.response ||
        error.code === 'ECONNABORTED' ||
        error.message?.includes('Network Error');
      
      if (isNetworkError) {
        toast.error('Network error occurred. Please check your internet connection and try again.', { duration: 5000 });
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setProcessing(false);
    }
  };

  const handleDownloadCertificate = async () => {
    if (!donationId) return;
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
    }
  };

  const resetModal = () => {
    setShowDonateModal(false);
    setSuccess(false);
    setDonationId(null);
  };

  return {
    donationAmount,
    setDonationAmount,
    isAnonymous,
    setIsAnonymous,
    donorName,
    setDonorName,
    donorEmail,
    setDonorEmail,
    donorPhone,
    setDonorPhone,
    donorPan,
    setDonorPan,
    showDonateModal,
    setShowDonateModal,
    processing,
    success,
    donationId,
    handleDonate,
    handleDownloadCertificate,
    resetModal,
  };
};

