/** @format */

import type { Table } from '@tanstack/react-table';

import { TablePagination } from '@/components/ui/table-pagination';

interface DataTablePaginationProps<TData> {
	table: Table<TData>;
}

export function DataTablePagination<TData>({
	table,
}: DataTablePaginationProps<TData>) {
	return (
		<TablePagination
			pageIndex={table.getState().pagination.pageIndex}
			pageSize={table.getState().pagination.pageSize}
			pageCount={table.getPageCount()}
			totalItems={table.getFilteredRowModel().rows.length}
			onPageChange={(pageIndex) => table.setPageIndex(pageIndex)}
			onPageSizeChange={(pageSize) => {
				table.setPageSize(pageSize);
				table.setPageIndex(0);
			}}
		/>
	);
}
