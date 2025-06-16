import { render, screen, fireEvent, act } from '@testing-library/react';
import ScrollToTopButton from './ScrollToTopButton';
import { MemoryRouter } from 'react-router-dom';

describe('ScrollToTopButton', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'scrollTo', {
      value: vi.fn(),
      writable: true,
    });
  });

  it('does not render when scrollY is below threshold', () => {
    Object.defineProperty(window, 'scrollY', {
      value: 0,
      writable: true,
    });

    render(
      <MemoryRouter>
        <ScrollToTopButton />
      </MemoryRouter>
    );

    const button = screen.queryByTestId('scroll-to-top-button');
    expect(button).not.toBeInTheDocument();
  });

  it('renders button when scrollY is above threshold', async () => {
    Object.defineProperty(window, 'innerWidth', { value: 1024, writable: true });
    Object.defineProperty(window, 'scrollY', { value: 400, writable: true });

    render(
      <MemoryRouter>
        <ScrollToTopButton />
      </MemoryRouter>
    );

    await act(() => {
      fireEvent.scroll(window);
    });

    const button = await screen.findByTestId('scroll-to-top-button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-label', 'Scroll to top');
  });

  it('clicking button scrolls to top', async () => {
    Object.defineProperty(window, 'innerWidth', { value: 1024, writable: true });
    Object.defineProperty(window, 'scrollY', { value: 400, writable: true });

    render(
      <MemoryRouter>
        <ScrollToTopButton />
      </MemoryRouter>
    );

    await act(() => {
      fireEvent.scroll(window);
    });

    const button = await screen.findByTestId('scroll-to-top-button');
    fireEvent.click(button);
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });

  it('does not render on mobile viewports', () => {
    Object.defineProperty(window, 'innerWidth', { value: 500, writable: true });
    Object.defineProperty(window, 'scrollY', { value: 400, writable: true });

    render(
      <MemoryRouter>
        <ScrollToTopButton />
      </MemoryRouter>
    );

    act(() => {
      fireEvent.scroll(window);
    });

    const button = screen.queryByTestId('scroll-to-top-button');
    expect(button).not.toBeInTheDocument();
  });
});
