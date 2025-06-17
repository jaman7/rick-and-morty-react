import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import EpisodesPage from './EpisodesPage';
import { describe, it, vi, beforeEach, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import * as service from './EpisodesPage.service';
import { of, throwError } from 'rxjs';
import { IEpisodesResponse } from '@/shared/types/character';

const showErrorMock = vi.fn();
vi.mock('@/hooks/useToast', () => ({
  useToast: () => ({
    showError: showErrorMock,
  }),
}));

function renderWithRouter() {
  return render(
    <BrowserRouter>
      <EpisodesPage />
    </BrowserRouter>
  );
}

const mockEpisodes: IEpisodesResponse = {
  info: {
    count: 51,
    pages: 3,
    next: 'https://rickandmortyapi.com/api/episode/?page=2',
    prev: null,
  },
  results: [
    {
      id: 1,
      name: 'Pilot',
      air_date: 'December 2, 2013',
      episode: 'S01E01',
      characters: [],
      url: 'https://rickandmortyapi.com/api/episode/1',
      created: '2017-11-10T12:56:33.798Z',
    },
    {
      id: 2,
      name: 'Lawnmower Dog',
      air_date: 'December 9, 2013',
      episode: 'S01E02',
      characters: [],
      url: 'https://rickandmortyapi.com/api/episode/2',
      created: '2017-11-10T12:56:33.916Z',
    },
  ],
};

describe('EpisodesPage', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(service, 'getEpisodes').mockReturnValue(of(mockEpisodes));
    showErrorMock.mockReset();
  });

  it('renders header and AutoComplete', () => {
    renderWithRouter();
    expect(screen.getByText('Episodes')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Search character.../i)).toBeInTheDocument();
  });

  it('fetches and renders episode cards', async () => {
    renderWithRouter();
    await waitFor(() => {
      expect(screen.getByText('Pilot')).toBeInTheDocument();
      expect(screen.getByText('Lawnmower Dog')).toBeInTheDocument();
    });
  });

  it('renders pagination buttons', async () => {
    renderWithRouter();
    await waitFor(() => {
      expect(screen.getAllByRole('button').length).toBeGreaterThan(1);
    });
  });

  it('calls getEpisodes on page change', async () => {
    const spy = vi.spyOn(service, 'getEpisodes').mockReturnValue(of(mockEpisodes));
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
    vi.spyOn(service, 'getEpisodes').mockReturnValue(of({ info: { pages: 0 }, results: [] }));
    renderWithRouter();

    await waitFor(() => {
      expect(showErrorMock).toHaveBeenCalledWith('Error fetching episodes');
    });
  });

  it('handles fetch error and logs to console', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(service, 'getEpisodes').mockReturnValue(throwError(() => new Error('Fetch failed')));

    renderWithRouter();

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Failed to fetch episodes.', expect.any(Error));
    });

    consoleSpy.mockRestore();
  });
});
