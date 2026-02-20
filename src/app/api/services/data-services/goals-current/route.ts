/** @format */

import { prisma } from '@/lib/prisma';
import { getMarketingReportAggregate } from '@/services/marketing-report/get-marketing-report-aggregate';
import { endOfMonth, startOfMonth } from 'date-fns';
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
		}

		const aggregate = await getMarketingReportAggregate();
		if (aggregate.ok) {
			currentRoas = aggregate.data.roasGeral;
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
