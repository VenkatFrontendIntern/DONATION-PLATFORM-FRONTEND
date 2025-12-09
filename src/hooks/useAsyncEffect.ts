import { useEffect, useRef } from 'react';

/**
 * Custom hook for async operations in useEffect with proper cleanup
 * Prevents memory leaks and state updates on unmounted components
 */
export const useAsyncEffect = (
  effect: () => Promise<void | (() => void)>,
  deps?: React.DependencyList
) => {
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    let cleanup: (() => void) | void;

    const runEffect = async () => {
      try {
        cleanup = await effect();
      } catch (error) {
        if (isMountedRef.current) {
          console.error('Error in async effect:', error);
        }
      }
    };

    runEffect();

    return () => {
      isMountedRef.current = false;
      if (cleanup && typeof cleanup === 'function') {
        cleanup();
      }
    };
  }, deps);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);
};

/**
 * Hook to check if component is mounted
 */
export const useIsMounted = () => {
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return () => isMountedRef.current;
};

