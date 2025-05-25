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

export interface ICompanySummary {
	meta: number;
	realizado: number;
	forecast: number;
	diffPercent: number;
}

export interface IGoalTracking {
	overview: IOverview[];
	timeSeries: ITimeSeries[];
	companySummary: ICompanySummary;
	ok: boolean;
	error?: string | null;
}

export interface IRankingSellers {
	posicao: number;
	name: string;
	sales: number;
	revenue: number;
	avgTicket: number;
}

export interface IProduct {
	posicao: number;
	code: number;
	name: string;
	sales: number;
	revenue: number;
}

export interface ICustomer {
	posicao: number;
	code: number;
	name: string;
	purchases: number;
	revenue: number;
}
