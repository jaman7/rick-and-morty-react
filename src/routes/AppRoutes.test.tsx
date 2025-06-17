import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import AppRoutes from './AppRoutes';
import { MemoryRouter } from 'react-router-dom';
import { of } from 'rxjs';
import React from 'react';
import * as service from '@/view/pages/MainPage/MainPage.service';
import { ICharactersResponse } from '@/shared/types/character';

vi.mock('@/shared/components/PageLoader/PageLoader', () => ({
  default: () => <div>Loading...</div>,
}));

const showErrorMock = vi.fn();

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

// Helper
const renderWithRouter = (initialRoute = '/') => {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <AppRoutes />
    </MemoryRouter>
  );
};

describe('AppRoutes', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(service, 'getCharacters').mockReturnValue(of(mockCharacters));
    showErrorMock.mockReset();
  });

  it('matches snapshot', () => {
    const { asFragment } = renderWithRouter('/');
    expect(asFragment()).toMatchSnapshot();
  });

  it('shows PageLoader while loading', () => {
    renderWithRouter('/');
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('shows PageLoader while loading lazy components', async () => {
    const LazyComponent = React.lazy(
      () => new Promise<{ default: React.FC }>((res) => setTimeout(() => res({ default: () => <h2>Lazy Loaded</h2> }), 100))
    );

    const FallbackTest = () => (
      <MemoryRouter>
        <React.Suspense fallback={<div>Loading...</div>}>
          <LazyComponent />
        </React.Suspense>
      </MemoryRouter>
    );

    render(<FallbackTest />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Lazy Loaded')).toBeInTheDocument();
    });
  });

  it('renders MainPage at /', async () => {
    renderWithRouter('/');
    await waitFor(async () => {
      expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
      expect(screen.getByText('Morty Smith')).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/Search character.../i)).toBeInTheDocument();
      await screen.findByText((content, node) => node?.tagName === 'H2' && /characters/i.test(content));
    });
  });

  it('renders EpisodesPage at /episodes', async () => {
    renderWithRouter('/episodes');
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /episodes/i })).toBeInTheDocument();
    });
  });

  it('renders LocationPage at /location', async () => {
    renderWithRouter('/location');
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /location/i })).toBeInTheDocument();
    });
  });
});
