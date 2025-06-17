import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Navbar from './NavBar';

const renderNavbar = (initialPath = '/', isMobileMenuOpen = false) => {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Navbar isMobileMenuOpen={isMobileMenuOpen} />
    </MemoryRouter>
  );
};

describe('Navbar', () => {
  it('renders all navigation links with correct labels and hrefs', () => {
    renderNavbar();

    const characters = screen.getByRole('link', { name: /Characters/i });
    const episodes = screen.getByRole('link', { name: /Episodes/i });
    const location = screen.getByRole('link', { name: /Location/i });

    expect(characters).toHaveAttribute('href', '/');
    expect(episodes).toHaveAttribute('href', '/episodes');
    expect(location).toHaveAttribute('href', '/location');
  });

  it('adds active class when link matches current route', () => {
    renderNavbar('/episodes');

    const episodes = screen.getByRole('link', { name: /Episodes/i });
    expect(episodes.className).toMatch(/active/);
  });

  it('applies mobile menu classes when open', () => {
    const { container } = renderNavbar('/', true);

    const nav = container.querySelector('nav');
    expect(nav?.className).toMatch(/navbar--mobile/);
    expect(nav?.className).toMatch(/navbar--visible/);
  });

  it('matches snapshot', () => {
    const { container } = renderNavbar('/', true);
    expect(container).toMatchSnapshot();
  });
});
