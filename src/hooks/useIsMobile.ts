import { useEffect, useState } from 'react';

const MOBILE_WIDTH = 768;
const DEBOUNCE_DELAY = 150;

export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < MOBILE_WIDTH);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const handleResize = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setIsMobile(window.innerWidth < MOBILE_WIDTH);
      }, DEBOUNCE_DELAY);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return isMobile;
}
