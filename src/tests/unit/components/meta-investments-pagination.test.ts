// @vitest-environment jsdom

import { createElement } from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { MetaInvestment } from '@/lib/api/meta-investments';
import MetaInvestmentsTable from '@/app/dashboard/(admin)/meta-investments/_components/meta-investments-table';
import MetaInvestmentsSection from '@/app/dashboard/(admin)/meta-investments/_components/meta-investments-section';

const { findMany, connection } = vi.hoisted(() => ({
	findMany: vi.fn(),
	connection: vi.fn(),
}));

vi.mock('@/lib/prisma', () => ({
	prisma: { metaInvestment: { findMany } },
}));

vi.mock('next/server', () => ({ connection }));

vi.mock('@/app/dashboard/(admin)/meta-investments/_components/meta-investment-form', () => ({
	default: () => null,
}));

const investments: MetaInvestment[] = [
	{
		id: 'investment-1',
		periodStart: '2026-06-01T00:00:00.000Z',
		periodEnd: '2026-06-05T00:00:00.000Z',
		totalInvestment: 100,
		lastSyncAt: '2026-06-05T12:00:00.000Z',
	},
	{
		id: 'investment-2',
		periodStart: '2026-05-01T00:00:00.000Z',
		periodEnd: '2026-05-05T00:00:00.000Z',
		totalInvestment: 200,
		lastSyncAt: '2026-05-05T12:00:00.000Z',
	},
	{
		id: 'investment-3',
		periodStart: '2026-04-01T00:00:00.000Z',
		periodEnd: '2026-04-05T00:00:00.000Z',
		totalInvestment: 300,
		lastSyncAt: '2026-04-05T12:00:00.000Z',
	},
	{
		id: 'investment-4',
		periodStart: '2026-03-01T00:00:00.000Z',
		periodEnd: '2026-03-05T00:00:00.000Z',
		totalInvestment: 400,
		lastSyncAt: '2026-03-05T12:00:00.000Z',
	},
	{
		id: 'investment-5',
		periodStart: '2026-02-01T00:00:00.000Z',
		periodEnd: '2026-02-05T00:00:00.000Z',
		totalInvestment: 500,
		lastSyncAt: '2026-02-05T12:00:00.000Z',
	},
	{
		id: 'investment-6',
		periodStart: '2026-01-01T00:00:00.000Z',
		periodEnd: '2026-01-31T00:00:00.000Z',
		totalInvestment: 600,
		lastSyncAt: '2026-01-31T12:00:00.000Z',
	},
];

afterEach(() => {
	cleanup();
	findMany.mockReset();
	connection.mockReset();
});

describe('Meta investment history pagination', () => {
	it('shows five investments per page', () => {
		render(createElement(MetaInvestmentsTable, { investments }));

		expect(screen.getAllByRole('button', { name: 'Editar investimento' })).toHaveLength(5);
		expect(screen.queryByText('01/01 - 31/01')).toBeNull();

		fireEvent.click(screen.getByRole('link', { name: 'Próxima página' }));

		expect(screen.getByText('01/01 - 31/01')).toBeTruthy();
		expect(screen.getAllByRole('button', { name: 'Editar investimento' })).toHaveLength(1);
	});

	it('keeps the pagination outside an external table border', async () => {
		findMany.mockResolvedValue(
			investments.map((investment) => ({
				...investment,
				periodStart: new Date(investment.periodStart),
				periodEnd: new Date(investment.periodEnd),
				lastSyncAt: new Date(investment.lastSyncAt),
				createdAt: new Date(investment.periodStart),
				updatedAt: new Date(investment.lastSyncAt),
			})),
		);

		render(await MetaInvestmentsSection());
		fireEvent.click(
			screen.getByRole('button', { name: 'Histórico de investimentos' }),
		);

		const pagination = screen.getByRole('navigation', { name: 'Paginação' });
		expect(pagination.closest('.border')).toBeNull();
	});

	it('waits for a request before reading investments from the database', async () => {
		const events: string[] = [];
		let releaseConnection!: () => void;
		const pendingConnection = new Promise<void>((resolve) => {
			releaseConnection = resolve;
		});
		connection.mockImplementationOnce(() => {
			events.push('connection');
			return pendingConnection;
		});
		findMany.mockImplementationOnce(async () => {
			events.push('findMany');
			return [];
		});

		const section = MetaInvestmentsSection();

		expect(connection).toHaveBeenCalledOnce();
		expect(findMany).not.toHaveBeenCalled();
		releaseConnection();
		await section;

		expect(events).toEqual(['connection', 'findMany']);
	});
});
