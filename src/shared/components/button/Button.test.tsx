import { render, screen, fireEvent } from '@testing-library/react';
import Button, { ButtonVariant } from './Button';
import { describe, it, vi, expect } from 'vitest';

describe('Button', () => {
  vi.mock('@/hooks/useFallbackTranslation', () => ({
    useFallbackTranslation: () => ({ t: (key: string) => key }),
  }));

  it('renders with default props', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('calls handleClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button handleClick={handleClick}>Click</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalled();
  });

  it('disables the button when `disabled` is true', () => {
    const handleClick = vi.fn();
    render(
      <Button disabled handleClick={handleClick}>
        Disabled
      </Button>
    );
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('applies correct variant class', () => {
    render(<Button variant={ButtonVariant.SECONDARY}>Secondary</Button>);
    const button = screen.getByRole('button');
    expect(button.className).toContain(ButtonVariant.SECONDARY);
  });

  it('sets aria-label from name', () => {
    render(<Button name="test.name" />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label');
  });

  it('renders multiple buttons from buttonsConfig', () => {
    render(
      <Button
        buttonsConfig={[
          { name: 'one', children: 'One' },
          { name: 'two', children: 'Two' },
        ]}
      />
    );
    expect(screen.getAllByRole('button')).toHaveLength(2);
  });
});
