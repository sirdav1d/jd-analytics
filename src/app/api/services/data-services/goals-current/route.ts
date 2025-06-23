/** @format */

import { getAuthenticatedClient } from '@/lib/google-authenticated-client';
import { prisma } from '@/lib/prisma';
import { endOfMonth, startOfMonth } from 'date-fns';
import { GoogleAdsApi } from 'google-ads-api';
import { NextResponse } from 'next/server';

export async function GET() {
	try {
		const today = new Date();
		const monthStart = startOfMonth(today);
		const monthEnd = endOfMonth(today);

		// 1. Commercial Data (Revenue)
		// Get current month revenue goals
		const salesGoals = await prisma.salesGoal.findMany({
			where: {
				goalDateRef: {
					gte: monthStart,
					lte: monthEnd,
				},
			},
		});

		// Calculate total revenue goal (sum of all sellers)
		const revenueGoal = salesGoals.reduce(
			(total, goal) => total + goal.revenue,
			0,
		);

		// Get current month actual revenue
		const currentOrders = await prisma.pedido.findMany({
			where: {
				data_pedido: {
					gte: monthStart,
					lte: today,
				},
				cancelled: false,
			},
			include: {
				items: true,
			},
		});

		const currentRevenue = currentOrders.reduce((total, order) => {
			const orderTotal = order.items.reduce(
				(sum, item) => sum + item.totalValue,
				0,
			);
			return total + orderTotal;
		}, 0);

		// Calculate revenue difference and percentage
		const revenueDifference = currentRevenue - revenueGoal;
		const revenuePercentage =
			revenueGoal > 0 ? (currentRevenue / revenueGoal) * 100 : 0;

		// 2. ROAS Data (Marketing)
		// Get current month ROAS goal
		const roasGoal = await prisma.roasGoal.findFirst({
			where: {
				goalDateRef: {
					gte: monthStart,
					lte: monthEnd,
				},
			},
		});

		let currentRoas = 0;
		let roasTarget = 0;

		if (roasGoal) {
			roasTarget = roasGoal.roas;

			// Get revenue from Google origin orders
			const googleOrders = await prisma.pedido.findMany({
				where: {
					data_pedido: {
						gte: monthStart,
						lte: today,
					},
					Origin: {
						name: {
							contains: 'google',
							mode: 'insensitive',
						},
					},
					cancelled: false,
				},
				include: {
					items: true,
				},
			});

			const googleRevenue = googleOrders.reduce((total, order) => {
				const orderTotal = order.items.reduce(
					(sum, item) => sum + item.totalValue,
					0,
				);
				return total + orderTotal;
			}, 0);

			// Get Google Ads cost
			try {
				const orgId = process.env.JD_CENTRO_ID!;
				const { refreshToken } = await getAuthenticatedClient(orgId);

				if (refreshToken) {
					const googleAdsClient = new GoogleAdsApi({
						client_id: process.env.GOOGLE_CLIENT_ID!,
						client_secret: process.env.GOOGLE_CLIENT_SECRET!,
						developer_token: process.env.GOOGLE_DEVELOPER_TOKEN!,
					});

					const customer = googleAdsClient.Customer({
						customer_id: '2971952651',
						refresh_token: refreshToken,
						linked_customer_id: '8251122454',
					});

					const data = await customer.report({
						entity: 'customer',
						metrics: ['metrics.cost_micros'],
						from_date: monthStart.toISOString().split('T')[0],
						to_date: today.toISOString().split('T')[0],
					});

					const costMicros = data?.[0]?.metrics?.cost_micros ?? 0;
					const cost = costMicros / 1_000_000;

					// Calculate current ROAS
					currentRoas = cost === 0 ? 0 : googleRevenue / cost;
				}
			} catch (error) {
				console.log('Error fetching Google Ads data:', error);
				// If can't fetch Google Ads data, ROAS stays 0
				currentRoas = 0;
			}
		}

		// Calculate ROAS difference and percentage
		const roasDifference = currentRoas - roasTarget;
		const roasPercentage =
			roasTarget > 0 ? (currentRoas / roasTarget) * 100 : 0;

		// Return the two requested objects
		return NextResponse.json({
			ok: true,
			data: {
				commercial: {
					currentRevenue,
					revenueGoal,
					difference: revenueDifference,
					percentage: revenuePercentage,
				},
				roas: {
					currentRoas,
					roasTarget,
					difference: roasDifference,
					percentage: roasPercentage,
				},
			},
			error: null,
		});
	} catch (error) {
		console.log(error);
		return NextResponse.json(
			{ message: 'Internal server error', error: error },
			{ status: 500 },
		);
	}
}
