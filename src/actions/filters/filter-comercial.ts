/** @format */

'use server';

import { prisma } from '@/lib/prisma';

export async function getComercialFilterAction() {
	try {
		const catogories = await prisma.product.groupBy({
			by: ['sector'],
		});

		const customerTypes = await prisma.customer.groupBy({
			by: ['personType'],
		});

		if (!catogories || !customerTypes) {
			return {
				ok: false,
				error: 'No data found',
				data: null,
				status: 404,
			};
		}

		return {
			ok: true,
			error: null,
			data: {
				catogories,
				customerTypes,
			},
			status: 200,
		};
	} catch (error) {
		console.error('Error fetching data:', error);
		return {
			ok: false,
			error: error,
			data: null,
			status: 500,
		};
	}
}
