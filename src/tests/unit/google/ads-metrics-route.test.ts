import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const mocks = vi.hoisted(() => ({
	report: vi.fn(),
	pedidoFindMany: vi.fn(),
	getAuthenticatedClient: vi.fn(),
}));

vi.mock("@/lib/google-ads-account", () => ({
	resolveGoogleAdsAccount: () => ({
		customerId: "customer-id",
		managerId: "manager-id",
	}),
}));

vi.mock("@/lib/google-authenticated-client", () => ({
	getAuthenticatedClient: mocks.getAuthenticatedClient,
}));

vi.mock("@/lib/prisma", () => ({
	prisma: { pedido: { findMany: mocks.pedidoFindMany } },
}));

vi.mock("google-ads-api", () => ({
	Constraints: {},
	enums: { CampaignStatus: { ENABLED: "ENABLED" } },
	GoogleAdsApi: class {
		Customer() {
			return { report: mocks.report };
		}
	},
}));

describe("Google Ads metrics route", () => {
	beforeEach(() => {
		mocks.report.mockReset();
		mocks.pedidoFindMany.mockReset().mockResolvedValue([]);
		mocks.getAuthenticatedClient.mockReset().mockResolvedValue({
			refreshToken: "refresh-token",
		});
	});

	it("returns every metric when the current period has no Google Ads rows", async () => {
		mocks.report
			.mockResolvedValueOnce([])
			.mockResolvedValueOnce([])
			.mockResolvedValueOnce([
				{
					metrics: {
						ctr: 0.1,
						impressions: 100,
						clicks: 10,
						cost_micros: 1_000_000,
						conversions: 2,
					},
				},
			]);

		const { GET } = await import(
			"@/app/api/services/google-services/get-ads-data/route"
		);
		const response = await GET(
			new NextRequest(
				"http://internal.test/api/services/google-services/get-ads-data?startDate=2026-08-01&endDate=2026-08-01&scope=products",
			),
		);
		const body = await response.json();

		expect(body.ok).toBe(true);
		expect(body.data.dataADS).toEqual({
			ctr: { current: 0, previous: 0.1, diff: -0.1, percentChange: -100 },
			impressions: {
				current: 0,
				previous: 100,
				diff: -100,
				percentChange: -100,
			},
			clicks: { current: 0, previous: 10, diff: -10, percentChange: -100 },
			cost_micros: {
				current: 0,
				previous: 1_000_000,
				diff: -1_000_000,
				percentChange: -100,
			},
			conversions: {
				current: 0,
				previous: 2,
				diff: -2,
				percentChange: -100,
			},
		});
	});

	it("calculates ROAS with ERP sales from the requested civil day", async () => {
		mocks.report
			.mockResolvedValueOnce([])
			.mockResolvedValueOnce([
				{ metrics: { cost_micros: 1_000_000 } },
			])
			.mockResolvedValueOnce([
				{ metrics: { cost_micros: 1_000_000 } },
			]);
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
				start === "2026-07-01T00:00:00.000Z" &&
				end === "2026-07-01T00:00:00.000Z"
			) {
				return [{ items: [{ totalValue: 100 }] }];
			}
			return [];
		});

		const { GET } = await import(
			"@/app/api/services/google-services/get-ads-data/route"
		);
		const response = await GET(
			new NextRequest(
				"http://internal.test/api/services/google-services/get-ads-data?startDate=2026-08-01&endDate=2026-08-01&scope=products",
			),
		);
		const body = await response.json();

		expect(body.data.roas).toEqual({
			current: 266,
			previous: 100,
			diff: 166,
			percentChange: 166,
		});
	});
});
