import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const mocks = vi.hoisted(() => ({
	runReport: vi.fn(),
	getAccessToken: vi.fn(),
	getAuthenticatedClient: vi.fn(),
	pedidoFindMany: vi.fn(),
}));

vi.mock("@/lib/google-authenticated-client", () => ({
	getAuthenticatedClient: mocks.getAuthenticatedClient,
}));

vi.mock("@/lib/prisma", () => ({
	prisma: { pedido: { findMany: mocks.pedidoFindMany } },
}));

vi.mock("googleapis", () => ({
	google: {
		analyticsdata: () => ({
			properties: { runReport: mocks.runReport },
		}),
	},
}));

const emptyComparison = {
	valorAtual: 0,
	valorAnterior: 0,
	diferenca: 0,
	percentual: "N/A",
};

describe("Google Analytics route", () => {
	beforeEach(() => {
		mocks.runReport.mockReset().mockResolvedValue({ data: {} });
		mocks.getAccessToken.mockReset().mockResolvedValue("access-token");
		mocks.getAuthenticatedClient.mockReset().mockResolvedValue({
			oauth2Client: { getAccessToken: mocks.getAccessToken },
		});
		mocks.pedidoFindMany.mockReset().mockResolvedValue([]);
	});

	it("returns a complete zeroed payload when Analytics has no rows", async () => {
		const { GET } = await import(
			"@/app/api/services/google-services/get-analytics-data/route"
		);
		const response = await GET(
			new NextRequest(
				"http://internal.test/api/services/google-services/get-analytics-data?startDate=2026-08-01&endDate=2026-08-01",
			),
		);
		const body = await response.json();

		expect(body).toEqual({
			ok: true,
			data: [
				{
					sessions: emptyComparison,
					totalUsers: emptyComparison,
					bounceRate: emptyComparison,
					sessionConversionRate: emptyComparison,
					purchaseRevenue: emptyComparison,
					averageSessionDuration: emptyComparison,
					eventCount: emptyComparison,
					screenPageViews: emptyComparison,
				},
				{},
				{},
				emptyComparison,
			],
			error: null,
		});
	});

	it("includes ERP revenue from the requested civil day", async () => {
		mocks.pedidoFindMany.mockImplementation(async ({ where }) => {
			const { gte, lte } = where.data_pedido;
			const start = gte.toISOString();
			const end = lte.toISOString();
			if (
				start === "2026-08-01T00:00:00.000Z" &&
				end === "2026-08-01T00:00:00.000Z"
			) {
				return [{ items: [{ totalValue: 266 }] }];
			}
			if (
				start === "2026-07-31T00:00:00.000Z" &&
				end === "2026-07-31T00:00:00.000Z"
			) {
				return [{ items: [{ totalValue: 100 }] }];
			}
			return [];
		});

		const { GET } = await import(
			"@/app/api/services/google-services/get-analytics-data/route"
		);
		const response = await GET(
			new NextRequest(
				"http://internal.test/api/services/google-services/get-analytics-data?startDate=2026-08-01&endDate=2026-08-01",
			),
		);
		const body = await response.json();

		expect(body.data[3]).toEqual({
			valorAtual: 266,
			valorAnterior: 100,
			diferenca: 166,
			percentual: "166.00%",
		});
	});
});
