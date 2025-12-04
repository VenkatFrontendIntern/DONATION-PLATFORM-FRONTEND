// Razorpay integration utility
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
  await loadRazorpay();

  return new Promise((resolve, reject) => {
    const razorpay = new window.Razorpay({
      ...options,
      handler: (response: any) => {
        resolve(response);
      },
      prefill: {
        name: options.prefill?.name || '',
        email: options.prefill?.email || '',
        contact: options.prefill?.contact || '',
      },
      theme: {
        color: '#10b981',
      },
    });

    razorpay.on('payment.failed', (response: any) => {
      reject(new Error(response.error.description || 'Payment failed'));
    });

    razorpay.open();
  });
};

