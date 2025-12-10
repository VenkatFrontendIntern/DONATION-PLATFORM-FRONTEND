import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  showInfo?: boolean;
  showLimitSelector?: boolean;
  limitOptions?: number[];
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onLimitChange,
  showInfo = true,
  showLimitSelector = true,
  limitOptions = [5, 10, 15, 20, 25],
  className = '',
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Always show pagination if limit selector is enabled or if there are items
  // Only hide if no items and no limit selector
  if (totalItems === 0 && !showLimitSelector) {
    return null;
  }

  // Generate page numbers to display (max 3 page buttons)
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 3) {
      // Show all pages if total pages is 3 or less
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      // Show current page if it's not first or last
      if (currentPage !== 1 && currentPage !== totalPages) {
        // Add ellipsis before current page if there's a gap
        if (currentPage > 2) {
          pages.push('ellipsis-start');
        }
        pages.push(currentPage);
        // Add ellipsis after current page if there's a gap
        if (currentPage < totalPages - 1) {
          pages.push('ellipsis-end');
        }
      } else if (currentPage === 1) {
        // On first page, show page 2 and ellipsis
        pages.push(2);
        pages.push('ellipsis-end');
      } else if (currentPage === totalPages) {
        // On last page, show ellipsis and second-to-last page
        pages.push('ellipsis-start');
        pages.push(totalPages - 1);
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLimit = Number(e.target.value);
    if (onLimitChange) {
      onLimitChange(newLimit);
    }
  };

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}>
      <div className="flex flex-col sm:flex-row items-center gap-4">
        {showInfo && (
          <div className="text-sm text-gray-600">
            Showing <span className="font-medium">{startItem}</span> to{' '}
            <span className="font-medium">{endItem}</span> of{' '}
            <span className="font-medium">{totalItems}</span> results
          </div>
        )}

        {showLimitSelector && onLimitChange && (
          <div className="flex items-center gap-2">
            <label htmlFor="items-per-page" className="text-sm text-gray-600 whitespace-nowrap">
              Items per page:
            </label>
            <select
              id="items-per-page"
              value={itemsPerPage}
              onChange={handleLimitChange}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {limitOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center gap-2">
        {/* Previous Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center gap-1"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Previous</span>
        </Button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {pageNumbers.map((page, idx) => {
            if (page === 'ellipsis-start' || page === 'ellipsis-end') {
              return (
                <span key={`ellipsis-${idx}`} className="px-2 text-gray-500">
                  ...
                </span>
              );
            }

            const pageNum = page as number;
            return (
              <Button
                key={pageNum}
                variant={currentPage === pageNum ? 'primary' : 'outline'}
                size="sm"
                onClick={() => onPageChange(pageNum)}
                className="min-w-[2.5rem]"
              >
                {pageNum}
              </Button>
            );
          })}
        </div>

        {/* Next Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center gap-1"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-4 h-4" />
        </Button>
        </div>
      )}
    </div>
  );
};

