import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import FiltersPanel from './FiltersPanel';

const mockOnFilterChange = vi.fn();
const mockOnPinChange = vi.fn();
const mockOnCollapseChange = vi.fn();

const filters = {
  status: {
    value: ['Alive'],
    multiple: false,
  },
};

const setup = () =>
  render(
    <MemoryRouter>
      <FiltersPanel
        config={filters}
        onChange={mockOnFilterChange}
        isPinned={false}
        onPinChange={mockOnPinChange}
        onCollapseChange={mockOnCollapseChange}
      />
    </MemoryRouter>
  );

describe('FiltersPanel', () => {
  it('should render filters with default values', () => {
    setup();
    expect(screen.getByText('status')).toBeInTheDocument();
    expect(screen.getByText('Alive')).toBeInTheDocument();
  });

  it('should call onPinChange when pin button is clicked', () => {
    setup();
    const pinButton = screen.getByRole('button', { name: /pin/i });
    fireEvent.click(pinButton);
    expect(mockOnPinChange).toHaveBeenCalled();
  });

  it('should call onCollapseChange when collapse button is clicked', () => {
    setup();
    const collapseButton = screen.getByRole('button', { name: /collapse/i });
    fireEvent.click(collapseButton);
    expect(mockOnCollapseChange).toHaveBeenCalled();
  });

  it('should call onChange when filter value is changed', () => {
    setup();
    const filterOption = screen.getByText('Alive');
    fireEvent.click(filterOption);

    expect(mockOnFilterChange).toHaveBeenCalledWith({
      status: { value: ['Alive'], matchMode: 'in' },
    });
  });
});
