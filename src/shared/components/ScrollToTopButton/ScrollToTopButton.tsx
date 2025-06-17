import { useEffect, useState } from 'react';
import { FaArrowUp } from 'react-icons/fa';
import Button, { ButtonVariant } from '../button/Button';
import { useIsMobile } from '@/hooks/useIsMobile';
import './ScrollToTopButton.scss';

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    toggleVisibility();

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!isVisible || isMobile) return null;

  return (
    <Button
      data-testid="scroll-to-top-button"
      className="scroll-to-top"
      variant={ButtonVariant.ROUND}
      handleClick={handleScrollToTop}
      aria-label="Scroll to top"
    >
      <FaArrowUp aria-hidden="true" focusable="false" />
    </Button>
  );
};

export default ScrollToTopButton;
