// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import type { ColumnDef } from '@tanstack/react-table';
import { createElement } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { DataTable as UsersDataTable } from '@/app/dashboard/(admin)/_components/data-table';
import { DataTable as CurrentGoalsDataTable } from '@/app/dashboard/(admin)/_components/data-table-current-goal/data-table';

vi.mock('react', async (importOriginal) => {
	const actual = await importOriginal<typeof import('react')>();

	return {
		...actual,
		use: <T,>(promise: Promise<T> & { value?: T }) => promise.value,
	};
});

vi.mock('@/app/dashboard/(admin)/users/_components/form-create', () => ({
	default: () => null,
}));

afterEach(cleanup);

function fulfilledPromise<T>(value: T) {
	return Object.assign(Promise.resolve(value), { value });
}

describe('admin TanStack table pagination', () => {
	it('shows five current goals and navigates to the sixth record', async () => {
		type Record = { name: string };
		const columns: ColumnDef<Record>[] = [
			{ accessorKey: 'name', header: 'Nome' },
		];
		const currentGoals = Array.from({ length: 6 }, (_, index) => ({
			name: `Registro ${index + 1}`,
		}));

		render(
			createElement(CurrentGoalsDataTable<Record, unknown>, {
				columns,
				data: fulfilledPromise({ currentGoals }),
			}),
		);

		expect(await screen.findByText('Registro 1')).toBeTruthy();
		expect(screen.getAllByRole('row')).toHaveLength(6);
		fireEvent.click(screen.getByRole('link', { name: 'Próxima página' }));
		expect(screen.getByText('Registro 6')).toBeTruthy();
		expect(screen.queryByText('Registro 1')).toBeNull();
	});

	it('shows five users and exposes the five-row page size', async () => {
		type UserRecord = {
			id: string;
			name: string;
			email: string;
			role: string;
		};
		const columns: ColumnDef<UserRecord>[] = [
			{ accessorKey: 'name', header: 'Nome' },
			{ accessorKey: 'email', header: 'E-mail' },
			{ accessorKey: 'role', header: 'Cargo' },
		];
		const users = Array.from({ length: 6 }, (_, index) => ({
			id: `user-${index + 1}`,
			name: `Usuário ${index + 1}`,
			email: `usuario${index + 1}@example.com`,
			role: 'SELLER',
		}));

		render(
			createElement(UsersDataTable<UserRecord, unknown>, {
				columns,
				data: fulfilledPromise({ data: users }),
			}),
		);

		expect(await screen.findByText('Usuário 1')).toBeTruthy();
		expect(screen.getAllByRole('row')).toHaveLength(6);
		expect(
			screen.getByRole('combobox', { name: 'Linhas por página' }).textContent,
		).toBe('5');
	});

	it('shows the users empty state when the response data is null', () => {
		type UserRecord = {
			id: string;
			name: string;
			email: string;
			role: string;
		};
		const columns: ColumnDef<UserRecord>[] = [
			{ accessorKey: 'name', header: 'Nome' },
			{ accessorKey: 'email', header: 'E-mail' },
			{ accessorKey: 'role', header: 'Cargo' },
		];

		render(
			createElement(UsersDataTable<UserRecord, unknown>, {
				columns,
				data: fulfilledPromise({ data: null }),
			}),
		);

		expect(screen.getByText('Dados não encontrados')).toBeTruthy();
	});
});
