import { FC } from 'react';
import { FaAngleLeft, FaAngleRight, FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa';
import Button, { ButtonVariant } from '../button/Button';
import { getVisiblePages } from './getVisiblePages';
import './Paginator.scss';

interface PaginatorProps {
  currentPage: number;
  totalPages: number;
  maxVisiblePages?: number;
  onPageChange: (page: number) => void;
}

const { ROUND } = ButtonVariant;

const Paginator: FC<PaginatorProps> = ({ currentPage, totalPages, maxVisiblePages = 5, onPageChange }) => {
  const visiblePages = getVisiblePages(currentPage, totalPages, maxVisiblePages);

  return (
    <div className="paginator">
      <Button
        className="paginator__nav"
        variant={ROUND}
        handleClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        aria-label="First Page"
      >
        <FaAngleDoubleLeft />
      </Button>
      <Button
        variant={ROUND}
        className="paginator__nav"
        handleClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous Page"
      >
        <FaAngleLeft />
      </Button>

      {visiblePages?.map((page) => (
        <Button
          key={`paginator-page-btn-${page}`}
          variant={ROUND}
          aria-label={`Page ${page}`}
          className="paginator__page"
          active={page === currentPage}
          handleClick={() => onPageChange(page)}
        >
          {page}
        </Button>
      ))}

      <Button
        className="paginator__nav"
        variant={ROUND}
        handleClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next Page"
      >
        <FaAngleRight />
      </Button>
      <Button
        className="paginator__nav"
        variant={ROUND}
        handleClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        aria-label="Last Page"
      >
        <FaAngleDoubleRight />
      </Button>
    </div>
  );
};

export default Paginator;
