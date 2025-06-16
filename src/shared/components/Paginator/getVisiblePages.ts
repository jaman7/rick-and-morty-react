export const getVisiblePages = (currentPage: number, totalPages: number, maxVisiblePages: number): number[] => {
  const pages = [];

  const half = Math.floor(maxVisiblePages / 2);
  let start = Math.max(currentPage - half, 1);
  let end = start + maxVisiblePages - 1;

  if (end > totalPages) {
    end = totalPages;
    start = Math.max(end - maxVisiblePages + 1, 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return pages;
};
