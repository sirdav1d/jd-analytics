// @vitest-environment jsdom
import {
	cleanup,
	fireEvent,
	render,
	screen,
	waitFor,
} from '@testing-library/react';
import { createElement } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Filter from '@/app/dashboard/_components/filter';

const push = vi.hoisted(() => vi.fn());
const refresh = vi.hoisted(() => vi.fn());
const params = vi.hoisted(() => ({
	value: new URLSearchParams(
		'startDate=2026-08-01&endDate=2026-08-03&view=summary',
	),
}));

vi.mock('next/navigation', () => ({
	useRouter: () => ({ push, refresh }),
	usePathname: () => '/dashboard',
	useSearchParams: () => params.value,
}));

vi.mock('@/components/ui/date-range-picker', () => ({
	DatePickerWithRange: ({
		setDate,
	}: {
		setDate: (range: { from: Date; to: Date }) => void;
	}) =>
		createElement(
			'button',
			{
				type: 'button',
				onClick: () =>
					setDate({
						from: new Date(2026, 7, 1, 12),
						to: new Date(2026, 7, 3, 12),
					}),
			},
			'Selecionar agosto',
		),
}));

describe('dashboard filter', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		params.value = new URLSearchParams(
			'startDate=2026-08-01&endDate=2026-08-03&view=summary',
		);
	});

	afterEach(() => {
		cleanup();
		vi.unstubAllGlobals();
	});

	it('refreshes the same database period without calling Linx', async () => {
		const fetchMock = vi.fn();
		vi.stubGlobal('fetch', fetchMock);
		render(createElement(Filter));

		fireEvent.click(screen.getByRole('button', { name: /Buscar/i }));

		await waitFor(() => expect(refresh).toHaveBeenCalledTimes(1));
		expect(push).not.toHaveBeenCalled();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('pushes a changed period while preserving unrelated parameters', async () => {
		params.value = new URLSearchParams(
			'startDate=2026-07-01&endDate=2026-07-31&view=summary',
		);
		const fetchMock = vi.fn();
		vi.stubGlobal('fetch', fetchMock);
		render(createElement(Filter));

		fireEvent.click(screen.getByRole('button', { name: 'Selecionar agosto' }));
		fireEvent.click(screen.getByRole('button', { name: /Buscar/i }));

		await waitFor(() => {
			expect(push).toHaveBeenCalledWith(
				'/dashboard?startDate=2026-08-01&endDate=2026-08-03&view=summary',
				{ scroll: false },
			);
		});
		expect(refresh).not.toHaveBeenCalled();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});
