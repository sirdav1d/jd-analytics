// @vitest-environment jsdom

import React, { createElement } from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import * as clientPagination from '@/hooks/use-client-pagination';

type FulfilledPromise<T> = Promise<T> & {
	status: 'fulfilled';
	value: T;
};

function fulfilled<T>(value: T): FulfilledPromise<T> {
	return Object.assign(Promise.resolve(value), {
		status: 'fulfilled' as const,
		value,
	});
}

Object.assign(React, {
	use: <T,>(promise: FulfilledPromise<T>) => promise.value,
});

afterEach(() => {
	cleanup();
	vi.restoreAllMocks();
});

describe('goal histories pagination', () => {
	it('calls the marketing pagination Hook when the response becomes invalid', async () => {
		const paginationSpy = vi.spyOn(clientPagination, 'useClientPagination');
		const { default: HistoryMarketingGoals } = await import(
			'@/app/dashboard/(admin)/goals-marketing/_components/history-marketing-goals'
		);
		const validData = fulfilled({
			ok: true,
			data: [
				{
					goalDateRef: '2026-06-01T00:00:00.000Z',
					faturamento: 100,
					custo: 10,
					roasAtingido: 10,
					roas: 3,
				},
			],
		});
		const invalidData = fulfilled({ ok: false, data: null, error: 'indisponível' });
		const { rerender } = render(createElement(HistoryMarketingGoals, { data: validData }));

		rerender(createElement(HistoryMarketingGoals, { data: invalidData }));

		expect(paginationSpy).toHaveBeenCalledTimes(2);
		expect(paginationSpy).toHaveBeenLastCalledWith([]);
		expect(screen.getByText('Dados Não Encontrados')).toBeTruthy();
	});

	it('paginates marketing history table rows', async () => {
		const { default: HistoryMarketingGoals } = await import(
			'@/app/dashboard/(admin)/goals-marketing/_components/history-marketing-goals'
		);
		const data = fulfilled({
			ok: true,
			data: [6, 5, 4, 3, 2, 1].map((month) => ({
				goalDateRef: `2026-${String(month).padStart(2, '0')}-01T00:00:00.000Z`,
				faturamento: 100,
				custo: 10,
				roasAtingido: 10,
				roas: 3,
			})),
		});

		render(createElement(HistoryMarketingGoals, { data }));
		fireEvent.click(screen.getByRole('button', { name: /Histórico de metas/i }));

		expect(screen.getByText('2026-06')).toBeTruthy();
		expect(screen.getByText('2026-05')).toBeTruthy();
		expect(screen.getByText('2026-04')).toBeTruthy();
		expect(screen.getByText('2026-03')).toBeTruthy();
		expect(screen.getByText('2026-02')).toBeTruthy();
		expect(screen.queryByText('2026-01')).toBeNull();
		fireEvent.click(screen.getByRole('link', { name: 'Próxima página' }));
		expect(screen.getByText('2026-01')).toBeTruthy();
		expect(screen.queryByText('2026-06')).toBeNull();
	});

	it('paginates commercial history by month', async () => {
		const { default: HistoryGoal } = await import(
			'@/app/dashboard/(admin)/goals-comercial/_components/history-goals'
		);
		const data = fulfilled({
			history: [6, 5, 4, 3, 2, 1].map((month) => ({
				month: `2026-${String(month).padStart(2, '0')}-01`,
				goals: [
					{
						sellerName: `Vendedor ${month}`,
						revenue: 100,
						realized: 90,
					},
				],
			})),
		});

		render(createElement(HistoryGoal, { data }));

		expect(screen.getAllByRole('button', { name: /\/26$/ })).toHaveLength(5);
		fireEvent.click(screen.getByRole('link', { name: 'Próxima página' }));
		expect(screen.getByRole('button', { name: '01/26' })).toBeTruthy();
		expect(screen.getAllByRole('button', { name: /\/26$/ })).toHaveLength(1);
	});
});
