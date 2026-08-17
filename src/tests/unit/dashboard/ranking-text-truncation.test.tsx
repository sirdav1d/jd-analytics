// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import RankingSellers from '@/app/dashboard/comercial/_components/tables/ranking-sellers';
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

function expectScrollableRankingTable(name: string) {
	const label = screen.getByTitle(name);
	const table = label.closest('table');
	const wrapper = table?.parentElement;
	const card = wrapper?.parentElement?.parentElement;

	expect(label.textContent).toBe(name);
	expect(label.className).toContain('truncate');
	expect(table?.className).toContain('min-w-[36rem]');
	expect(table?.className).toContain('md:min-w-0');
	expect(table?.className).toContain('md:table-auto');
	expect(wrapper?.className).toContain('overflow-auto');
	expect(card?.className).toContain('min-w-0');
	expect(card?.className).toContain('overflow-hidden');
	expect(screen.queryByText(/\.\.\.$/)).toBeNull();
}

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

	expectScrollableRankingTable(customerName);
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

	expectScrollableRankingTable(productName);
});

it('keeps complete seller names while the five-column ranking scrolls inside the card', () => {
	const sellerName = 'VENDEDOR COM NOME COMPLETO';
	current.response = {
		ok: true,
		data: {
			sellers: [
				{
					posicao: 1,
					name: sellerName,
					sales: 10,
					revenue: 3200,
					avgTicket: 320,
				},
			],
		},
	};

	render(<RankingSellers data={Promise.resolve(null)} />);

	expectScrollableRankingTable(sellerName);
});
