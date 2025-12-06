import React, { Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Layout } from '../components/layout/Layout';
import { PageTransition } from '../components/layout/PageTransition';
import { PrivateRoute, AdminRoute } from '../components/routes/ProtectedRoute';
import LoadingFallback from '../components/LoadingFallback';

const Home = lazy(() => import('../pages/Home'));
const Campaigns = lazy(() => import('../pages/Campaigns'));
const CampaignDetail = lazy(() => import('../pages/CampaignDetail'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Login = lazy(() => import('../pages/Login'));
const Signup = lazy(() => import('../pages/Auth/Signup'));
const CreateCampaign = lazy(() => import('../pages/CreateCampaign'));
const AdminDashboard = lazy(() => import('../pages/Admin/Dashboard'));
const PendingCampaigns = lazy(() => import('../pages/Admin/PendingCampaigns'));
const AboutUs = lazy(() => import('../pages/AboutUs'));
const NotFound = lazy(() => import('../pages/NotFound'));

export const AppRoutes: React.FC = () => {
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

