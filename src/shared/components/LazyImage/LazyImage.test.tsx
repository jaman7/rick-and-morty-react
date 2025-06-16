import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LazyImage, { ILazyImage } from './LazyImage';
import { describe, it, expect, vi } from 'vitest';

describe('LazyImage', () => {
  const defaultProps: ILazyImage = {
    src: 'https://example.com/image.jpg',
    alt: 'Test image',
    className: 'custom-class',
  };

  beforeAll(() => {
    Object.defineProperty(global.Image.prototype, 'src', {
      set(src) {
        this._src = src;
        setTimeout(() => {
          this.onload?.();
        }, 100);
      },
      get() {
        return this._src;
      },
    });
  });

  it('renders placeholder before image loads', async () => {
    render(<LazyImage {...defaultProps} />);

    const placeholder = screen.queryByTestId('lazy-placeholder');
    expect(placeholder).toBeInTheDocument();

    const image = screen.getByAltText('Test image');
    expect(image).toHaveClass('lazyloading');

    fireEvent.load(image);

    await waitFor(() => {
      expect(screen.queryByTestId('lazy-placeholder')).not.toBeInTheDocument();
    });

    expect(image).toHaveClass('lazyloaded');
  });

  it('loads image and applies lazyloaded class on load', () => {
    render(<LazyImage {...defaultProps} />);
    const img = screen.getAllByRole('img')[0];
    fireEvent.load(img);
    expect(img).toHaveClass('lazyloaded');
  });

  it('shows fallback image on error', () => {
    render(<LazyImage {...defaultProps} />);
    const img = screen.getAllByRole('img')[0];
    fireEvent.error(img);
    expect(img).toHaveAttribute('src', 'https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg');
  });

  it('calls onClick when clicked', () => {
    const onClick = vi.fn();
    render(<LazyImage {...defaultProps} onClick={onClick} />);
    const img = screen.getAllByRole('img')[0];
    fireEvent.click(img);
    expect(onClick).toHaveBeenCalled();
  });

  it('matches snapshot', () => {
    const { asFragment } = render(<LazyImage {...defaultProps} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
