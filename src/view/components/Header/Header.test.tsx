import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Header from './Header';

function renderHeader() {
  return render(
    <BrowserRouter>
      <Header />
    </BrowserRouter>
  );
}

describe('Header', () => {
  beforeEach(() => {
    vi.useFakeTimers(); // jeśli potrzebna obsługa animacji
  });

  it('renders the header with title and burger icon', () => {
    renderHeader();
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Rick and Morty Characters/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Open Menu/i })).toBeInTheDocument();
  });

  it('toggles menu when burger button is clicked', () => {
    renderHeader();
    const burger = screen.getByRole('button', { name: /Open Menu/i });

    fireEvent.click(burger);
    expect(burger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('button', { name: /Close Menu/i })).toBeInTheDocument();

    fireEvent.click(burger);
    expect(burger).toHaveAttribute('aria-expanded', 'false');
  });

  it('closes menu when Escape key is pressed', () => {
    renderHeader();
    const burger = screen.getByRole('button', { name: /Open Menu/i });

    fireEvent.click(burger);
    expect(burger).toHaveAttribute('aria-expanded', 'true');

    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });
    expect(burger).toHaveAttribute('aria-expanded', 'false');
  });

  it('renders navigation links', () => {
    renderHeader();
    const links = screen.getAllByRole('link');
    expect(links.some((l) => l.textContent === 'Characters')).toBe(true);
    expect(links.some((l) => l.textContent === 'Episodes')).toBe(true);
    expect(links.some((l) => l.textContent === 'Location')).toBe(true);
  });

  it('applies aria-controls and aria-expanded correctly', () => {
    renderHeader();
    const burger = screen.getByRole('button', { name: /Open Menu/i });
    expect(burger).toHaveAttribute('aria-controls', 'main-navigation');
    expect(burger).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(burger);
    expect(burger).toHaveAttribute('aria-expanded', 'true');
  });
});
