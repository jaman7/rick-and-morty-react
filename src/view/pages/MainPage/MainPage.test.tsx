import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import MainPage from './MainPage';
import { describe, it, vi, beforeEach, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import * as service from './MainPage.service';
import { of, throwError } from 'rxjs';
import { ICharactersResponse } from '@/shared/types/character';

const showErrorMock = vi.fn();
vi.mock('@/hooks/useToast', () => ({
  useToast: () => ({
    showError: showErrorMock,
  }),
}));

function renderWithRouter() {
  return render(
    <BrowserRouter>
      <MainPage />
    </BrowserRouter>
  );
}

const mockCharacters: ICharactersResponse = {
  info: {
    count: 826,
    pages: 42,
    next: 'https://rickandmortyapi.com/api/character/?page=2',
    prev: null,
  },
  results: [
    {
      id: 1,
      name: 'Rick Sanchez',
      status: 'Alive' as const,
      species: 'Human',
      type: '',
      gender: 'Male',
      origin: {
        name: 'Earth (C-137)',
        url: 'https://rickandmortyapi.com/api/location/1',
      },
      location: {
        name: 'Citadel of Ricks',
        url: 'https://rickandmortyapi.com/api/location/3',
      },
      image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
      episode: ['https://rickandmortyapi.com/api/episode/1'],
      url: 'https://rickandmortyapi.com/api/character/1',
      created: '2017-11-04T18:48:46.250Z',
    },
    {
      id: 2,
      name: 'Morty Smith',
      status: 'Alive' as const,
      species: 'Human',
      type: '',
      gender: 'Male',
      origin: {
        name: 'unknown',
        url: '',
      },
      location: {
        name: 'Citadel of Ricks',
        url: 'https://rickandmortyapi.com/api/location/3',
      },
      image: 'https://rickandmortyapi.com/api/character/avatar/2.jpeg',
      episode: ['https://rickandmortyapi.com/api/episode/1'],
      url: 'https://rickandmortyapi.com/api/character/2',
      created: '2017-11-04T18:50:21.651Z',
    },
    {
      id: 3,
      name: 'Summer Smith',
      status: 'Alive',
      species: 'Human',
      type: '',
      gender: 'Female',
      origin: {
        name: 'Earth (Replacement Dimension)',
        url: 'https://rickandmortyapi.com/api/location/20',
      },
      location: {
        name: 'Earth (Replacement Dimension)',
        url: 'https://rickandmortyapi.com/api/location/20',
      },
      image: 'https://rickandmortyapi.com/api/character/avatar/3.jpeg',
      episode: ['https://rickandmortyapi.com/api/episode/6'],
      url: 'https://rickandmortyapi.com/api/character/3',
      created: '2017-11-04T19:09:56.428Z',
    },
  ],
};

describe('MainPage', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(service, 'getCharacters').mockReturnValue(of(mockCharacters));
    showErrorMock.mockReset();
  });

  it('renders header and AutoComplete', () => {
    renderWithRouter();
    expect(screen.getByText('Characters')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Search character.../i)).toBeInTheDocument();
  });

  it('fetches and renders character cards', async () => {
    renderWithRouter();
    await waitFor(() => {
      expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
      expect(screen.getByText('Morty Smith')).toBeInTheDocument();
    });
  });

  it('renders pagination buttons', async () => {
    renderWithRouter();
    await waitFor(() => {
      expect(screen.getAllByRole('button').length).toBeGreaterThan(1);
    });
  });

  it('calls getCharacters on page change', async () => {
    const spy = vi.spyOn(service, 'getCharacters').mockReturnValue(of(mockCharacters));
    renderWithRouter();

    await waitFor(() => {
      expect(spy).toHaveBeenCalledTimes(1);
    });

    const nextBtns = screen.getAllByRole('button', { name: /Next Page/i });
    expect(nextBtns.length).toBeGreaterThan(1);

    fireEvent.click(nextBtns[0]);

    await waitFor(() => {
      expect(spy).toHaveBeenCalledTimes(2);
    });
  });

  it('shows toast on empty results', async () => {
    vi.spyOn(service, 'getCharacters').mockReturnValue(of({ info: { pages: 0 }, results: [] }));
    renderWithRouter();

    await waitFor(() => {
      expect(showErrorMock).toHaveBeenCalledWith('Error fetching characters');
    });
  });

  it('handles fetch error and logs to console', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(service, 'getCharacters').mockReturnValue(throwError(() => new Error('Fetch failed')));

    renderWithRouter();

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Error fetching characters', expect.any(Error));
    });

    consoleSpy.mockRestore();
  });

  it('renders no cards when results are empty', async () => {
    vi.spyOn(service, 'getCharacters').mockReturnValue(of({ info: { pages: 0 }, results: [] }));
    renderWithRouter();

    await waitFor(() => {
      expect(screen.queryAllByRole('img')).toHaveLength(0);
    });
  });

  it('shows scroll to top button after scrolling', async () => {
    renderWithRouter();

    fireEvent.scroll(window, { target: { scrollY: 400 } });

    const scrollBtn = screen.queryByTestId('scroll-to-top-button');
    expect(scrollBtn).not.toBeInTheDocument();
  });
});
