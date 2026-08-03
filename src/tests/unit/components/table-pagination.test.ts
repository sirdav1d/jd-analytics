// @vitest-environment jsdom
import { createElement } from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { TablePagination } from '@/components/ui/table-pagination';
import { useClientPagination } from '@/hooks/use-client-pagination';

function Harness({ items }: { items: string[] }) {
  const pagination = useClientPagination(items);

  return createElement(
    'div',
    null,
    createElement('output', null, pagination.pageItems.join(',')),
    createElement('button', { onClick: () => pagination.setPageIndex(1) }, 'ir à página 2'),
    createElement('button', { onClick: () => pagination.setPageSize(10) }, 'mostrar 10'),
  );
}

afterEach(cleanup);

describe('shared table pagination', () => {
  it('shows five items by default and resets to page one after changing page size', () => {
    render(createElement(Harness, { items: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'] }));

    expect(screen.getByText('1,2,3,4,5')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'ir à página 2' }));
    expect(screen.getByText('6,7,8,9,10')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'mostrar 10' }));
    expect(screen.getByText('1,2,3,4,5,6,7,8,9,10')).toBeTruthy();
  });

  it('renders Portuguese numbered navigation and disables the previous action on page one', () => {
    const onPageChange = vi.fn();

    render(createElement(TablePagination, {
      pageIndex: 0,
      pageSize: 5,
      pageCount: 3,
      totalItems: 11,
      onPageChange,
      onPageSizeChange: vi.fn(),
    }));

    expect(screen.getByRole('navigation', { name: 'Paginação' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Página 1' }).getAttribute('aria-current')).toBe('page');
    expect(screen.getByRole('link', { name: 'Página anterior' }).getAttribute('aria-disabled')).toBe('true');
    fireEvent.click(screen.getByRole('link', { name: 'Página 2' }));
    expect(onPageChange).toHaveBeenCalledWith(1);
  });

  it('adds shared vertical spacing to visible pagination navigation', () => {
    render(createElement(TablePagination, {
      pageIndex: 0,
      pageSize: 5,
      pageCount: 3,
      totalItems: 11,
      onPageChange: vi.fn(),
      onPageSizeChange: vi.fn(),
    }));

    expect(screen.getByRole('navigation', { name: 'Paginação' }).classList.contains('py-5')).toBe(true);
  });
});
