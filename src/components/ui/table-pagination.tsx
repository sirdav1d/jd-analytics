'use client';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PAGE_SIZE_OPTIONS } from '@/hooks/use-client-pagination';

export interface TablePaginationProps {
  pageIndex: number;
  pageSize: number;
  pageCount: number;
  totalItems: number;
  onPageChange: (pageIndex: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

function getPageNumbers(pageIndex: number, pageCount: number) {
  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_, index) => index);
  }

  return Array.from(new Set([0, pageIndex - 1, pageIndex, pageIndex + 1, pageCount - 1]))
    .filter((page) => page > 0 && page < pageCount - 1 || page === 0 || page === pageCount - 1)
    .sort((first, second) => first - second);
}

export function TablePagination({
  pageIndex,
  pageSize,
  pageCount,
  totalItems,
  onPageChange,
  onPageSizeChange,
}: TablePaginationProps) {
  if (totalItems <= 5) {
    return null;
  }

  const pageNumbers = getPageNumbers(pageIndex, pageCount);
  const canGoPrevious = pageIndex > 0;
  const canGoNext = pageIndex < pageCount - 1;

  const changePage = (nextPageIndex: number) => (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    onPageChange(nextPageIndex);
  };

  return (
    <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
      <div className='flex items-center gap-2 text-sm'>
        <span>Linhas por página</span>
        <Select value={String(pageSize)} onValueChange={(value) => onPageSizeChange(Number(value))}>
          <SelectTrigger className='h-9 w-[72px]' aria-label='Linhas por página'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PAGE_SIZE_OPTIONS.map((option) => (
              <SelectItem key={option} value={String(option)}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Pagination aria-label='Paginação' className='mx-0 w-auto justify-end'>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href='#'
              aria-disabled={!canGoPrevious}
              tabIndex={canGoPrevious ? undefined : -1}
              onClick={canGoPrevious ? changePage(pageIndex - 1) : (event) => event.preventDefault()}
            />
          </PaginationItem>
          {pageNumbers.map((page, index) => (
            <PaginationItem key={page}>
              {index > 0 && page - pageNumbers[index - 1] > 1 && <PaginationEllipsis />}
              <PaginationLink
                href='#'
                isActive={page === pageIndex}
                aria-label={`Página ${page + 1}`}
                onClick={changePage(page)}
              >
                {page + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              href='#'
              aria-disabled={!canGoNext}
              tabIndex={canGoNext ? undefined : -1}
              onClick={canGoNext ? changePage(pageIndex + 1) : (event) => event.preventDefault()}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
