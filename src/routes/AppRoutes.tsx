import { Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import { lazy, Suspense } from 'react';
import PageLoader from '@/shared/components/PageLoader/PageLoader';
import MainLayout from '@/view/components/layouts/MainLayout';

const MainPage = lazy(() => import('@/view/pages/MainPage/MainPage'));
const EpisodesPage = lazy(() => import('@/view/pages/EpisodesPage/EpisodesPage'));
const LocationPage = lazy(() => import('@/view/pages/LocationPage/LocationPage'));

const PageWrapper = ({ children }: { children: React.ReactNode }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
    {children}
  </motion.div>
);

const AppRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route
            path="/"
            element={
              <PageWrapper>
                <MainPage />
              </PageWrapper>
            }
          />
          <Route
            path="/episodes"
            element={
              <PageWrapper>
                <EpisodesPage />
              </PageWrapper>
            }
          />
          <Route
            path="/location"
            element={
              <PageWrapper>
                <LocationPage />
              </PageWrapper>
            }
          />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
