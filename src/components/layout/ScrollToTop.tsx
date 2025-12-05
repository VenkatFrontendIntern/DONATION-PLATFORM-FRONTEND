import React from 'react';
import { useLocation } from 'react-router-dom';

export const ScrollToTop: React.FC = React.memo(() => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
});

ScrollToTop.displayName = 'ScrollToTop';

