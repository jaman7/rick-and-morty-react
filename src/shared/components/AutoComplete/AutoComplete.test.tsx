import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AutoComplete from './AutoComplete';
import { MemoryRouter } from 'react-router-dom';

vi.mock('@/core/services/http/http.service', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      get: vi.fn().mockResolvedValue({
        results: [{ name: 'Rick Sanchez' }, { name: 'Morty Smith' }],
      }),
    })),
  };
});

describe('AutoComplete', () => {
  const mockOnSelect = vi.fn();

  beforeEach(() => {
    mockOnSelect.mockReset();
  });

  const renderWithRouter = () =>
    render(
      <MemoryRouter initialEntries={['/characters']}>
        <AutoComplete url="/character" paramName="name" queryVal="" onSelect={mockOnSelect} placeholder="Search character..." />
      </MemoryRouter>
    );

  it('should render input with placeholder', () => {
    renderWithRouter();
    expect(screen.getByPlaceholderText(/search character/i)).toBeInTheDocument();
  });

  it('should show suggestions when typing', async () => {
    renderWithRouter();

    const input = screen.getByPlaceholderText(/search character/i);
    fireEvent.change(input, { target: { value: 'Ri' } });

    await waitFor(() => {
      expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
      expect(screen.getByText('Morty Smith')).toBeInTheDocument();
    });
  });

  it('should call onSelect when suggestion clicked', async () => {
    renderWithRouter();

    const input = screen.getByPlaceholderText(/search character/i);
    fireEvent.change(input, { target: { value: 'Ri' } });

    await waitFor(async () => {
      const item = screen.getByText('Rick Sanchez');
      expect(item).toBeInTheDocument();
      await fireEvent.mouseDown(screen.getByText('Rick Sanchez'));
    });

    expect(mockOnSelect).toHaveBeenCalledWith('Rick Sanchez');
  });
});
