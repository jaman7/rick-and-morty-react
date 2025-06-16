import PageLoader from '@/shared/components/PageLoader/PageLoader';
import ScrollToTopButton from '@/shared/components/ScrollToTopButton/ScrollToTopButton';
import Toast from '@/shared/components/Toast/Toast';
import { useGlobalStore } from '@/store/useGlobalStore';
import { createPortal } from 'react-dom';

const GlobalOverlays = () => {
  const isLoading = useGlobalStore((state) => state.isLoading) ?? false;

  return (
    <>
      <ScrollToTopButton />
      {isLoading && typeof document !== 'undefined' && createPortal(<PageLoader />, document.body)}
      <Toast />
    </>
  );
};

export default GlobalOverlays;
