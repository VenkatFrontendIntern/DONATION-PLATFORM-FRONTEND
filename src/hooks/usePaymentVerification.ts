import { useState } from 'react';
import { donationService } from '../services/donationService';
import { openRazorpay } from '../utils/razorpay';
import { retryWithBackoff, isNetworkError } from '../utils/retryWithBackoff';
import { getErrorMessage } from '../utils/apiResponse';
import toast from 'react-hot-toast';

interface PaymentVerificationParams {
  campaignId: string;
  campaignTitle: string;
  donationAmount: number;
  isAnonymous: boolean;
  donorName: string;
  donorEmail: string;
  donorPhone?: string;
  donorPan?: string;
}

export const usePaymentVerification = () => {
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [donationId, setDonationId] = useState<string | null>(null);

  const processPayment = async (params: PaymentVerificationParams, onSuccess?: () => void) => {
    setProcessing(true);
    
    try {
      const orderResponse = await donationService.createOrder({
        campaignId: params.campaignId,
        amount: params.donationAmount,
        isAnonymous: params.isAnonymous,
        donorName: params.donorName,
        donorEmail: params.donorEmail,
        donorPhone: params.donorPhone,
        donorPan: params.donorPan,
      });

      if (!orderResponse?.order?.id || orderResponse.order.amount === undefined) {
        throw new Error('Invalid order response. Please try again.');
      }

      const { order, donationId: newDonationId } = orderResponse;
      setDonationId(newDonationId);

      const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
      if (!razorpayKey) {
        toast.error('Razorpay key not configured. Please set VITE_RAZORPAY_KEY_ID in .env');
        setProcessing(false);
        return;
      }

      const razorpayResponse = await openRazorpay({
        key: razorpayKey,
        amount: order.amount,
        currency: order.currency || 'INR',
        order_id: order.id,
        name: 'Engala Trust',
        description: `Donation for ${params.campaignTitle}`,
        prefill: {
          name: params.donorName,
          email: params.donorEmail,
          contact: params.donorPhone,
        },
        modal: {
          ondismiss: () => {
            setProcessing(false);
          },
        },
      });

      await verifyPayment(newDonationId, order.id, razorpayResponse, onSuccess);
    } catch (error: any) {
      const errorMessage = getErrorMessage(error);
      
      if (isNetworkError(error)) {
        toast.error('Network error occurred. Please check your internet connection and try again.', { duration: 5000 });
      } else {
        toast.error(errorMessage);
      }
      throw error;
    } finally {
      setProcessing(false);
    }
  };

  const verifyPayment = async (
    newDonationId: string,
    orderId: string,
    razorpayResponse: any,
    onSuccess?: () => void
  ) => {
    try {
      await retryWithBackoff(
        () => donationService.verifyPayment({
          donationId: newDonationId,
          razorpayOrderId: orderId,
          razorpayPaymentId: razorpayResponse.razorpay_payment_id,
          razorpaySignature: razorpayResponse.razorpay_signature,
        }),
        3,
        1000
      );

      setSuccess(true);
      toast.success('Donation successful! 80G certificate sent to your email.');
      onSuccess?.();
    } catch (verifyError: any) {
      const errorMessage = getErrorMessage(verifyError);
      
      if (errorMessage.includes('already') || verifyError.response?.status === 200) {
        setSuccess(true);
        toast.success('Donation verified! 80G certificate sent to your email.');
        onSuccess?.();
      } else if (isNetworkError(verifyError)) {
        toast.error(
          'Network error occurred during verification. Your payment may have been processed. Please check your email or dashboard for confirmation.',
          { duration: 6000 }
        );
        // Don't set success to true - let user check status manually
        // The webhook handler will process the payment if it succeeded
      } else {
        throw verifyError;
      }
    }
  };

  const resetState = () => {
    setSuccess(false);
    setDonationId(null);
    setProcessing(false);
  };

  return {
    processing,
    success,
    donationId,
    processPayment,
    resetState,
  };
};

