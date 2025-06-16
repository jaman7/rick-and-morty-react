import AppRoutes from './routes/AppRoutes.tsx';

import './i18n';
import { lazy, Suspense } from 'react';
const GlobalOverlays = lazy(() => import('./view/components/layouts/GlobalOverlays'));

const App = () => {
  return (
    <>
      <AppRoutes />
      <Suspense fallback={null}>
        <GlobalOverlays />
      </Suspense>
    </>
  );
};

export default App;
