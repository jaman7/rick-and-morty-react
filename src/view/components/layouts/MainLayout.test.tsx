import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './MainLayout';

const renderWithOutlet = (component: React.ReactNode, path = '/') => {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={component} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
};

describe('MainLayout', () => {
  it('renders Header and main content from Outlet', () => {
    renderWithOutlet(<div data-testid="mock-outlet">Hello from page</div>);

    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Rick and Morty Characters/i })).toBeInTheDocument();

    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByTestId('mock-outlet')).toHaveTextContent('Hello from page');
  });

  it('matches snapshot', () => {
    const { container } = renderWithOutlet(<div>Hello snapshot</div>);
    expect(container).toMatchSnapshot();
  });
});
