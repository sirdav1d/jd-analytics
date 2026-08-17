// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react';
import { createElement } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Greeting from '@/components/greeting';
import OverviewUnitModeSync from '@/app/dashboard/_components/overview-unit-mode-sync';
import { DashboardOverviewProvider } from '@/providers/dashboard-overview-provider';

const pathname = vi.hoisted(() => ({ value: '/dashboard' }));

vi.mock('next/navigation', () => ({
	usePathname: () => pathname.value,
}));

function dataWithOrganizations(...organizations: string[]) {
	return Promise.resolve({
		ok: true,
		data: {
			result: organizations.map((organization) => ({ organization })),
		},
	});
}

async function renderTitle(...organizations: string[]) {
	const sync = await OverviewUnitModeSync({
		data: dataWithOrganizations(...organizations),
	});
	const fetchMock = vi.fn();
	vi.stubGlobal('fetch', fetchMock);
	render(
		createElement(
			DashboardOverviewProvider,
			null,
			sync,
			createElement(Greeting),
		),
	);
	return fetchMock;
}

afterEach(() => {
	cleanup();
	vi.unstubAllGlobals();
	pathname.value = '/dashboard';
});

describe('dashboard overview mode', () => {
	it('shows only Visão Geral when the history has no usable organization series', async () => {
		const fetchMock = await renderTitle();
		expect(await screen.findByText('Visão Geral')).not.toBeNull();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('shows only Visão Geral for one organization without fetching again', async () => {
		const fetchMock = await renderTitle('JD Centro');
		expect(await screen.findByText('Visão Geral')).not.toBeNull();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('keeps the exact multi-unit title without fetching again', async () => {
		const fetchMock = await renderTitle('JD Centro', 'JD Icaraí');
		expect(
			await screen.findByText('Visão Geral Centro Vs. Icaraí'),
		).not.toBeNull();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('preserves the existing title for another dashboard route', () => {
		pathname.value = '/dashboard/profile';
		render(
			createElement(
				DashboardOverviewProvider,
				null,
				createElement(Greeting),
			),
		);
		expect(screen.getByText('Seu Perfil')).not.toBeNull();
	});
});
