/** @format */

export interface IOverview {
	vendedor: string;
	totalRevenue: number;
	orderCount: number;
	avgTicket: number;
	meta: number;
	percentualDif: number;
	forecast: number;
}

export interface ITimeSeries {
	period: string;
	revenue: number;
}
