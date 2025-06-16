import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Collapse from './Collapse';

vi.mock('@/hooks/useFallbackTranslation', () => ({
  useFallbackTranslation: () => ({ t: (key: string) => key }),
}));

describe('Collapse', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders header and children', () => {
    render(
      <Collapse header="test.header">
        <p>Content inside</p>
      </Collapse>
    );

    expect(screen.getByText('test.header')).toBeInTheDocument();
    expect(screen.getByText('Content inside')).toBeInTheDocument();
  });

  it('toggles visibility when header is clicked', () => {
    render(
      <Collapse header="Toggle Test">
        <div data-testid="collapsible-content">Hidden Content</div>
      </Collapse>
    );

    const header = screen.getByText('Toggle Test');
    const content = screen.getByTestId('collapsible-content').parentElement;

    expect(content).toHaveAttribute('aria-hidden', 'true');

    fireEvent.click(header);
    expect(content).toHaveAttribute('aria-hidden', 'false');

    fireEvent.click(header);
    expect(content).toHaveAttribute('aria-hidden', 'true');
  });

  it('applies custom className and padding', () => {
    render(
      <Collapse header="Class Test" className="my-collapse" padding={{ paddingLeft: 16, paddingRight: 24 }}>
        <span>Styled content</span>
      </Collapse>
    );

    const container = screen.getByText('Class Test').parentElement?.parentElement;
    expect(container?.classList.contains('my-collapse')).toBe(true);
  });

  it('renders correctly without header', () => {
    render(
      <Collapse>
        <p>No header content</p>
      </Collapse>
    );
    expect(screen.getByText('No header content')).toBeInTheDocument();
  });

  it('handles iconArrowLast prop (arrow after text)', () => {
    render(
      <Collapse header="Arrow Last" iconArrowLast>
        <span>Arrow content</span>
      </Collapse>
    );

    const header = screen.getByText('Arrow Last').parentElement;
    expect(header?.classList.contains('collapsed__header--reversed')).toBe(true);
  });
});
