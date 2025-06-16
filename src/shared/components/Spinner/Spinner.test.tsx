import { render, screen } from '@testing-library/react';
import Spinner from './Spinner';
import { describe, it, expect } from 'vitest';

describe('Spinner', () => {
  it('renders spinner with default size and color', () => {
    render(<Spinner />);
    const spinnerWrapper = screen.getByRole('status');

    expect(spinnerWrapper).toBeInTheDocument();
    expect(spinnerWrapper).toHaveAttribute('aria-label', 'Loading...');
    expect(spinnerWrapper).toHaveAttribute('aria-busy', 'true');
  });

  it('renders spinner with custom size and color', () => {
    render(<Spinner size="large" color="#ff0000" />);
    const spinner = screen.getByRole('status').querySelector('.loader') as HTMLElement;

    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveStyle({
      width: '60px',
      height: '60px',
      border: '4px solid #ff0000',
    });

    expect(spinner.style.borderTopColor).toBe('transparent');
  });

  it('renders spinner with custom aria label', () => {
    render(<Spinner ariaLabel="Please wait" />);
    const spinnerWrapper = screen.getByRole('status');

    expect(spinnerWrapper).toHaveAttribute('aria-label', 'Please wait');
    expect(screen.getByText('Please wait')).toBeInTheDocument();
  });

  it('matches snapshot for default spinner', () => {
    const { container } = render(<Spinner />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('applies framer-motion infinite rotation animation (snapshot)', () => {
    const { asFragment } = render(<Spinner />);
    expect(asFragment()).toMatchSnapshot();
  });
});
