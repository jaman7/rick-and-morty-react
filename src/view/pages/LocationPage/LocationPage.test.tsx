import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, vi, beforeEach, expect } from 'vitest';
import LocationPage from './LocationPage';
import { BrowserRouter } from 'react-router-dom';
import * as service from './LocationPage.service';
import { of, throwError } from 'rxjs';
import { ILocationResponse } from '@/shared/types/character';

const showErrorMock = vi.fn();
vi.mock('@/hooks/useToast', () => ({
  useToast: () => ({
    showError: showErrorMock,
  }),
}));

function renderWithRouter() {
  return render(
    <BrowserRouter>
      <LocationPage />
    </BrowserRouter>
  );
}

const mockLocations: ILocationResponse = {
  info: {
    count: 42,
    pages: 2,
    next: 'https://rickandmortyapi.com/api/location/?page=2',
    prev: null,
  },
  results: [
    {
      id: 1,
      name: 'Earth (C-137)',
      type: 'Planet',
      dimension: 'Dimension C-137',
      residents: [],
      url: 'https://rickandmortyapi.com/api/location/1',
      created: '2017-11-10T12:42:04.162Z',
    },
    {
      id: 2,
      name: 'Abadango',
      type: 'Cluster',
      dimension: 'unknown',
      residents: [],
      url: 'https://rickandmortyapi.com/api/location/2',
      created: '2017-11-10T13:06:38.182Z',
    },
  ],
};

describe('LocationPage', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(service, 'getLocations').mockReturnValue(of(mockLocations));
    showErrorMock.mockReset();
  });

  it('renders page title and AutoComplete input', () => {
    renderWithRouter();
    expect(screen.getByText('Location')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Search character.../i)).toBeInTheDocument();
  });

  it('renders location cards', async () => {
    renderWithRouter();
    await waitFor(() => {
      expect(screen.getByText('Earth (C-137)')).toBeInTheDocument();
      expect(screen.getByText('Abadango')).toBeInTheDocument();
    });
  });

  it('renders pagination buttons', async () => {
    renderWithRouter();
    await waitFor(() => {
      expect(screen.getAllByRole('button').length).toBeGreaterThan(1);
    });
  });

  it('calls getLocations on page change', async () => {
    const spy = vi.spyOn(service, 'getLocations').mockReturnValue(of(mockLocations));
    renderWithRouter();

    await waitFor(() => {
      expect(spy).toHaveBeenCalledTimes(1);
    });

    const nextBtns = screen.getAllByRole('button', { name: /Next Page/i });
    fireEvent.click(nextBtns[0]);

    await waitFor(() => {
      expect(spy).toHaveBeenCalledTimes(2);
    });
  });

  it('shows toast on empty results', async () => {
    vi.spyOn(service, 'getLocations').mockReturnValue(of({ info: { pages: 0 }, results: [] }));
    renderWithRouter();

    await waitFor(() => {
      expect(showErrorMock).toHaveBeenCalledWith('Error fetching locations');
    });
  });

  it('logs to console on fetch error', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(service, 'getLocations').mockReturnValue(throwError(() => new Error('Failed')));

    renderWithRouter();

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Failed to fetch locations.', expect.any(Error));
    });

    consoleSpy.mockRestore();
  });
});
