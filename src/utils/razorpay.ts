// Razorpay integration utility
import toast from 'react-hot-toast';

declare global {
  interface Window {
    Razorpay: any;
    loadRazorpay?: () => void;
  }
}

export const loadRazorpay = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve();
      return;
    }

    // Use the pre-defined loadRazorpay function from index.html if available
    if (typeof window.loadRazorpay === 'function') {
      window.loadRazorpay();
      // Poll for Razorpay to be available
      const checkInterval = setInterval(() => {
        if (window.Razorpay) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 50);
      
      // Timeout after 5 seconds
      setTimeout(() => {
        clearInterval(checkInterval);
        if (!window.Razorpay) {
          reject(new Error('Failed to load Razorpay'));
        }
      }, 5000);
      return;
    }

    // Fallback: load script dynamically
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Razorpay'));
    document.head.appendChild(script);
  });
};

export const openRazorpay = async (options: any): Promise<any> => {
  // Check for Razorpay key ID in environment variables
  const razorpayKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID;
  
  if (!razorpayKeyId || razorpayKeyId.trim() === '') {
    const errorMessage = 'Razorpay configuration is missing. Please contact support.';
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }

  // Use the key from options if provided, otherwise use the env var
  const keyToUse = options.key || razorpayKeyId;
  
  if (!keyToUse || keyToUse.trim() === '') {
    const errorMessage = 'Razorpay key is missing. Please contact support.';
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }

  await loadRazorpay();

  return new Promise((resolve, reject) => {
    const razorpay = new window.Razorpay({
      key: keyToUse,
      amount: options.amount,
      currency: options.currency || 'INR',
      order_id: options.order_id,
      name: options.name || 'Engala Trust',
      description: options.description || 'Donation',
      prefill: {
        name: options.prefill?.name || '',
        email: options.prefill?.email || '',
        contact: options.prefill?.contact || '',
      },
      theme: {
        color: '#10b981',
      },
      handler: (response: any) => {
        resolve(response);
      },
      modal: {
        ...options.modal,
        ondismiss: () => {
          if (options.modal?.ondismiss) {
            options.modal.ondismiss();
          }
          reject(new Error('Payment cancelled by user'));
        },
      },
    });

    razorpay.on('payment.failed', (response: any) => {
      reject(new Error(response.error?.description || response.error?.reason || 'Payment failed'));
    });

    // Open Razorpay checkout immediately
    razorpay.open();
  });
};

