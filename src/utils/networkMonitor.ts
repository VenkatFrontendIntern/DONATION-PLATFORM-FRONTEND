/**
 * Network monitoring utility
 * Detects online/offline status and connection quality
 */

type NetworkStatus = 'online' | 'offline' | 'slow';

let networkStatus: NetworkStatus = navigator.onLine ? 'online' : 'offline';
const listeners: Set<(status: NetworkStatus) => void> = new Set();

// Monitor online/offline events
window.addEventListener('online', () => {
  networkStatus = 'online';
  notifyListeners();
});

window.addEventListener('offline', () => {
  networkStatus = 'offline';
  notifyListeners();
});

function notifyListeners() {
  listeners.forEach(listener => listener(networkStatus));
}

export const networkMonitor = {
  /**
   * Get current network status
   */
  getStatus: (): NetworkStatus => networkStatus,

  /**
   * Check if network is online
   */
  isOnline: (): boolean => networkStatus === 'online',

  /**
   * Subscribe to network status changes
   */
  subscribe: (callback: (status: NetworkStatus) => void): (() => void) => {
    listeners.add(callback);
    // Return unsubscribe function
    return () => {
      listeners.delete(callback);
    };
  },

  /**
   * Test network connection quality
   */
  testConnection: async (): Promise<boolean> => {
    try {
      const startTime = Date.now();
      const response = await fetch('/health', {
        method: 'HEAD',
        cache: 'no-cache',
        signal: AbortSignal.timeout(5000), // 5 second timeout
      });
      const duration = Date.now() - startTime;
      
      // Consider connection slow if it takes more than 3 seconds
      if (duration > 3000) {
        networkStatus = 'slow';
        notifyListeners();
      }
      
      return response.ok;
    } catch (error) {
      networkStatus = 'offline';
      notifyListeners();
      return false;
    }
  },
};

