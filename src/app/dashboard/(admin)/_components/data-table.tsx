/** @format */

'use client';

import {
	type ColumnDef,
	flexRender,
	getCoreRowModel,
	useReactTable,
	getPaginationRowModel,
	type SortingState,
	getSortedRowModel,
	type ColumnFiltersState,
	getFilteredRowModel,
} from '@tanstack/react-table';

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { DataTablePagination } from './data-table-pagination';

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
}

export function DataTable<TData, TValue>({
	columns,
	data,
}: DataTableProps<TData, TValue>) {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [roleFilter, setRoleFilter] = useState<string>('all');

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		onColumnFiltersChange: setColumnFilters,
		getFilteredRowModel: getFilteredRowModel(),
		state: {
			sorting,
			columnFilters,
		},
	});

	return (
		<div>
			<div className='flex items-center flex-col gap-5 md:flex-row  py-4'>
				<Input
					placeholder='Filtrar por nome'
					value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
					onChange={(event) =>
						table.getColumn('name')?.setFilterValue(event.target.value)
					}
					className='max-w-sm'
				/>
				<Select
					value={roleFilter}
					onValueChange={(value) => {
						setRoleFilter(value);
						table
							.getColumn('role')
							?.setFilterValue(value === 'all' ? '' : value);
					}}>
					<SelectTrigger className='w-full md:w-[220px]'>
						<SelectValue placeholder='Selecione o Cargo' />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value='all'>Todos os Cargos</SelectItem>
						<SelectItem value='ADMIN'>Administrador</SelectItem>
						<SelectItem value='MANAGER'>Gerente</SelectItem>
					</SelectContent>
				</Select>
			</div>
			<div className='rounded-md border'>
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext(),
												  )}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && 'selected'}>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id} className='text-sm text-nowrap'>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className='h-24 text-center'>
									Sem resultados.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<DataTablePagination table={table} />
		</div>
	);
}
