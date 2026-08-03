'use client';

import { useEffect, useState } from 'react';

export const DEFAULT_PAGE_SIZE = 5;
export const PAGE_SIZE_OPTIONS = [5, 10, 20, 30, 40, 50] as const;

export function useClientPagination<T>(
  items: readonly T[],
  initialPageSize = DEFAULT_PAGE_SIZE,
) {
  const [pageIndex, setStoredPageIndex] = useState(0);
  const [pageSize, setStoredPageSize] = useState(initialPageSize);
  const pageCount = Math.max(1, Math.ceil(items.length / pageSize));
  const safePageIndex = Math.min(pageIndex, pageCount - 1);

  useEffect(() => setStoredPageIndex((current) => Math.min(current, pageCount - 1)), [pageCount]);

  const setPageIndex = (next: number) =>
    setStoredPageIndex(Math.min(Math.max(next, 0), pageCount - 1));
  const setPageSize = (next: number) => {
    setStoredPageSize(next);
    setStoredPageIndex(0);
  };

  return {
    pageIndex: safePageIndex,
    pageSize,
    pageCount,
    pageItems: items.slice(safePageIndex * pageSize, (safePageIndex + 1) * pageSize),
    setPageIndex,
    setPageSize,
  };
}
