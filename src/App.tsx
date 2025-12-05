import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ScrollToTop } from './components/layout/ScrollToTop';
import { AppRoutes } from './routes/AppRoutes';

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <Router>
        <ScrollToTop />
        <AppRoutes />
      </Router>
    </ErrorBoundary>
  );
};

export default App;
