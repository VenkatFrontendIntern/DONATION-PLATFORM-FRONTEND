import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Header } from './components/layout/Header';
import { BottomNav } from './components/layout/BottomNav';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useAuth } from './contexts/AuthContext';
import LoadingFallback from './components/LoadingFallback';

// Lazy load all page components for code splitting
const Home = lazy(() => import('./pages/Home'));
const Campaigns = lazy(() => import('./pages/Campaigns'));
const CampaignDetail = lazy(() => import('./pages/CampaignDetail'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Auth/Signup'));
const CreateCampaign = lazy(() => import('./pages/CreateCampaign'));
const AdminDashboard = lazy(() => import('./pages/Admin/Dashboard'));
const PendingCampaigns = lazy(() => import('./pages/Admin/PendingCampaigns'));
const AboutUs = lazy(() => import('./pages/AboutUs'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Scroll to top on route change
const ScrollToTop = React.memo(() => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
});
ScrollToTop.displayName = 'ScrollToTop';

// Page transition wrapper - optimized for performance
const PageTransition: React.FC<{ children: React.ReactNode }> = React.memo(({ children }) => {
  // Reduce animation complexity for better performance
  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
}) as React.FC<{ children: React.ReactNode }>;
PageTransition.displayName = 'PageTransition';

const Layout: React.FC<{ children: React.ReactNode; showHeader?: boolean; showFooter?: boolean }> = React.memo(({
  children,
  showHeader = true,
  showFooter = true
}) => {
  return (
    <div className="flex flex-col min-h-screen text-gray-800">
      {showHeader && <Header />}
      <main className="flex-1">
        {children}
      </main>
      {showFooter && (
        <>
          <footer className="bg-gray-900 text-gray-400 py-12 pb-24 md:pb-12">
            <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-white font-bold text-lg mb-4">Engala Trust</h3>
                <p className="text-sm">Empowering change through transparent and secure giving.</p>
              </div>
              <div>
                <h4 className="text-white font-medium mb-4">Platform</h4>
                <ul className="space-y-2 text-sm">
                  <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
                  <li>How it Works</li>
                  <li>Pricing</li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-medium mb-4">Legal</h4>
                <ul className="space-y-2 text-sm">
                  <li>Privacy Policy</li>
                  <li>Terms of Use</li>
                  <li>80G Info</li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-medium mb-4">Contact</h4>
                <p className="text-sm">support@engalatrust.org</p>
              </div>
            </div>
          </footer>
          <BottomNav />
        </>
      )}
    </div>
  );
}) as React.FC<{ children: React.ReactNode; showHeader?: boolean; showFooter?: boolean }>;
Layout.displayName = 'Layout';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

const AnimatedRoutes: React.FC = () => {
  const location = useLocation();

  return (
    <Suspense fallback={<LoadingFallback />}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Public routes */}
          <Route path="/login" element={
            <Layout showHeader={false} showFooter={false}>
              <PageTransition><Login /></PageTransition>
            </Layout>
          } />
          <Route path="/signup" element={
            <Layout showHeader={false} showFooter={false}>
              <PageTransition><Signup /></PageTransition>
            </Layout>
          } />

          {/* Public routes with layout */}
          <Route path="/" element={
            <Layout>
              <PageTransition><Home /></PageTransition>
            </Layout>
          } />
          <Route path="/campaigns" element={
            <Layout>
              <PageTransition><Campaigns /></PageTransition>
            </Layout>
          } />
          <Route path="/campaign/:id" element={
            <Layout>
              <PageTransition><CampaignDetail /></PageTransition>
            </Layout>
          } />
          <Route path="/about" element={
            <Layout>
              <PageTransition><AboutUs /></PageTransition>
            </Layout>
          } />

          {/* Protected routes */}
          <Route path="/dashboard" element={
            <Layout>
              <PrivateRoute>
                <PageTransition><Dashboard /></PageTransition>
              </PrivateRoute>
            </Layout>
          } />
          <Route path="/start-campaign" element={
            <Layout>
              <PrivateRoute>
                <PageTransition><CreateCampaign /></PageTransition>
              </PrivateRoute>
            </Layout>
          } />

          {/* Admin routes - With normal layout (navbar and footer) */}
          <Route path="/admin" element={
            <Layout>
              <AdminRoute>
                <PageTransition><AdminDashboard /></PageTransition>
              </AdminRoute>
            </Layout>
          } />
          <Route path="/admin/pending-campaigns" element={
            <Layout>
              <AdminRoute>
                <PageTransition><PendingCampaigns /></PageTransition>
              </AdminRoute>
            </Layout>
          } />

          {/* 404 */}
          <Route path="*" element={
            <Layout>
              <PageTransition>
                <NotFound />
              </PageTransition>
            </Layout>
          } />
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <Router>
        <ScrollToTop />
        <AnimatedRoutes />
      </Router>
    </ErrorBoundary>
  );
};

export default App;
