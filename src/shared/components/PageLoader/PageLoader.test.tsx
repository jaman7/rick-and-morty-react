import { render, screen } from '@testing-library/react';
import PageLoader from './PageLoader';

describe('PageLoader', () => {
  it('renders the loader scene with correct ARIA attributes', () => {
    render(<PageLoader />);
    const loader = screen.getByRole('status');

    expect(loader).toBeInTheDocument();
    expect(loader).toHaveAttribute('aria-busy', 'true');
    expect(loader).toHaveAttribute('aria-live', 'polite');
    expect(loader).toHaveAttribute('aria-label', 'Loading content');
  });

  it('renders all cube faces', () => {
    render(<PageLoader />);
    const faces = screen.getByRole('status').querySelectorAll('.cube-face');
    expect(faces.length).toBe(7);
  });

  it('is hidden from assistive tech internally', () => {
    render(<PageLoader />);
    const wrapper = screen.getByRole('status').querySelector('.cube-wrapper');
    expect(wrapper).toHaveAttribute('aria-hidden', 'true');
  });
});
