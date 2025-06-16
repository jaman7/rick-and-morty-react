import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Paginator from './Paginator';
import { BrowserRouter } from 'react-router-dom';

describe('Paginator', () => {
  const mockOnPageChange = vi.fn();

  const setup = (currentPage = 3, totalPages = 10, maxVisiblePages = 5) => {
    mockOnPageChange.mockClear();
    render(
      <BrowserRouter>
        <Paginator currentPage={currentPage} totalPages={totalPages} maxVisiblePages={maxVisiblePages} onPageChange={mockOnPageChange} />
      </BrowserRouter>
    );
  };

  it('should render navigation buttons', () => {
    setup();
    expect(screen.getByLabelText('First Page')).toBeInTheDocument();
    expect(screen.getByLabelText('Previous Page')).toBeInTheDocument();
    expect(screen.getByLabelText('Next Page')).toBeInTheDocument();
    expect(screen.getByLabelText('Last Page')).toBeInTheDocument();
  });

  it('should call onPageChange with correct page number on nav clicks', () => {
    setup(3);

    fireEvent.click(screen.getByLabelText('First Page'));
    expect(mockOnPageChange).toHaveBeenCalledWith(1);

    fireEvent.click(screen.getByLabelText('Previous Page'));
    expect(mockOnPageChange).toHaveBeenCalledWith(2);

    fireEvent.click(screen.getByLabelText('Next Page'));
    expect(mockOnPageChange).toHaveBeenCalledWith(4);

    fireEvent.click(screen.getByLabelText('Last Page'));
    expect(mockOnPageChange).toHaveBeenCalledWith(10);
  });

  it('should disable previous/first buttons on first page', () => {
    setup(1);

    expect(screen.getByLabelText('First Page')).toBeDisabled();
    expect(screen.getByLabelText('Previous Page')).toBeDisabled();
  });

  it('should disable next/last buttons on last page', () => {
    setup(10, 10);

    expect(screen.getByLabelText('Next Page')).toBeDisabled();
    expect(screen.getByLabelText('Last Page')).toBeDisabled();
  });

  it('should highlight the current page button', () => {
    setup(5);
    const current = screen.getByLabelText('Page 5');
    expect(current).toHaveClass('active');
  });

  it('should show correct visible pages based on maxVisiblePages', () => {
    setup(4, 10, 3);
    const pageButtons = screen.getAllByRole('button', { name: /^Page \d+$/ });
    expect(pageButtons.length).toBeLessThanOrEqual(3);
  });

  it('should call onPageChange when a numbered page button is clicked', () => {
    setup(3);
    fireEvent.click(screen.getByLabelText('Page 4'));
    expect(mockOnPageChange).toHaveBeenCalledWith(4);
  });
});
