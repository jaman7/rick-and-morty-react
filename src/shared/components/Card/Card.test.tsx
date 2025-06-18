import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import Card from './Card';

describe('Card', () => {
  const observe = vi.fn();
  const unobserve = vi.fn();
  const disconnect = vi.fn();

  beforeEach(() => {
    // @ts-ignore: mock global ResizeObserver
    global.ResizeObserver = vi.fn(() => ({
      observe,
      unobserve,
      disconnect,
    }));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders title and children', () => {
    render(
      <Card name="Rick Card">
        <p>Child content</p>
      </Card>
    );
    expect(screen.getByText('Rick Card')).toBeInTheDocument();
    expect(screen.getByText('Child content')).toBeInTheDocument();
  });

  it('applies hoverable class if hoverable is true', () => {
    const { container } = render(<Card name="Hover" isEffect />);
    const cardDiv = container.querySelector('.card');
    expect(cardDiv?.classList.contains('hoverable')).toBe(true);
  });

  it('calls onResize when size changes', async () => {
    const onResize = vi.fn();

    render(<Card name="Resizable" onResize={onResize} />);

    const mockEntry = [
      {
        contentRect: { width: 200, height: 100 },
      },
    ];

    const callback = (global.ResizeObserver as unknown as ReturnType<typeof vi.fn>).mock.calls[0][0];

    await act(() => {
      callback(mockEntry);
    });

    expect(onResize).toHaveBeenCalledWith(200, 100);
  });

  it('matches snapshot', () => {
    const { asFragment } = render(
      <Card name="Snapshot" isEffect className="custom-class">
        <span>Snapshot test</span>
      </Card>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
