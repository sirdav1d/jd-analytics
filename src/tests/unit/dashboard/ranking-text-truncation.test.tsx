// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import TopClients from '@/app/dashboard/comercial/_components/tables/top-clients';
import TopProducts from '@/app/dashboard/comercial/_components/tables/top-products';

const current = vi.hoisted(() => ({
	response: {} as unknown,
}));

vi.mock('react', async (importOriginal) => {
	const actual = await importOriginal<typeof import('react')>();
	return { ...actual, use: () => current.response };
});

afterEach(cleanup);

it('keeps complete customer names in the DOM without JavaScript ellipses', () => {
	const customerName = 'JOSÉ PAULO VILARINHO DA SILVA';
	current.response = {
		ok: true,
		data: {
			topCustomers: [
				{
					posicao: 1,
					code: 101,
					name: customerName,
					purchases: 3,
					revenue: 1200,
				},
			],
		},
	};

	render(<TopClients data={Promise.resolve(null)} />);

	expect(screen.getByText(customerName)).not.toBeNull();
	expect(screen.queryByText(/\.\.\.$/)).toBeNull();
});

it('keeps complete product names in the DOM without JavaScript ellipses', () => {
	const productName = 'FECA';
	current.response = {
		ok: true,
		data: {
			products: [
				{
					posicao: 1,
					code: 202,
					name: productName,
					sales: 5,
					revenue: 2400,
				},
			],
		},
	};

	render(<TopProducts data={Promise.resolve(null)} />);

	expect(screen.getByText(productName)).not.toBeNull();
	expect(screen.queryByText(/\.\.\.$/)).toBeNull();
});
