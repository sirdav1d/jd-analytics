import { isValidElement } from "react";
import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
	getServerSession: vi.fn(),
	userFindUnique: vi.fn(),
	metaInvestmentUpsert: vi.fn(),
	transaction: vi.fn(),
	createMarketingGoalLoaders: vi.fn(() => ({
		bigNumbers: Promise.resolve({ ok: true, data: [], error: null }),
		history: Promise.resolve({ ok: true, data: [], error: null }),
		response: Promise.resolve({
			ok: true,
			data: [],
			bigNumbers: [],
			error: null,
			status: 200,
		}),
	})),
	readAllSellers: vi.fn(async () => ({ ok: true, data: [], error: null })),
	fetchGoalTargetData: vi.fn(async () => ({
		ok: true,
		error: null,
		companyGoal: { meta: 0, realized: 0, remaining: 0, predicted: 0 },
		currentGoals: [],
		history: [],
	})),
}));

vi.mock("next-auth", async () => {
	const actual = await vi.importActual<typeof import("next-auth")>("next-auth");
	return { ...actual, getServerSession: mocks.getServerSession };
});

vi.mock("@/lib/prisma", () => ({
	prisma: {
		user: { findUnique: mocks.userFindUnique },
		metaInvestment: { upsert: mocks.metaInvestmentUpsert },
		$transaction: mocks.transaction,
	},
}));

vi.mock("@/services/data-services/get-marketing-goals", () => ({
	createMarketingGoalLoaders: mocks.createMarketingGoalLoaders,
}));

vi.mock("@/services/data-services/get-sellers", () => ({
	readAllSellers: mocks.readAllSellers,
}));

vi.mock("@/services/data-services/get-goal-target", () => ({
	FetchGoalTargetData: mocks.fetchGoalTargetData,
}));

beforeEach(() => {
	mocks.getServerSession.mockResolvedValue(null);
});

describe("administrative page navigation", () => {
	it("constructs the marketing goals page without page-level authorization", async () => {
		const { default: GoalsMarketing } = await import(
			"@/app/dashboard/(admin)/goals-marketing/page"
		);

		const tree = await GoalsMarketing();

		expect(isValidElement(tree)).toBe(true);
		expect(tree.type).toBe("div");
		expect(tree.props.className).toContain("min-h-screen");
	});

	it("constructs the commercial goals page without page-level authorization", async () => {
		const { default: GoalsComercial } = await import(
			"@/app/dashboard/(admin)/goals-comercial/page"
		);

		const tree = await GoalsComercial();

		expect(isValidElement(tree)).toBe(true);
		expect(tree.type).toBe("div");
		expect(tree.props.className).toContain("bg-background");
	});
});

describe("backend administrative authorization", () => {
	it("rejects unauthenticated access through the real requireAdmin boundary", async () => {
		const { requireAdmin } = await import("@/lib/auth");

		await expect(requireAdmin()).rejects.toMatchObject({
			name: "AuthorizationError",
			status: 401,
			message: "Não autenticado",
		});
		expect(mocks.userFindUnique).not.toHaveBeenCalled();
	});

	it("protects the marketing-goal route before loading report data", async () => {
		const { GET } = await import(
			"@/app/api/services/data-services/marketing-goal/route"
		);

		const response = await GET(
			new NextRequest(
				"http://localhost/api/services/data-services/marketing-goal?scope=services",
			),
		);

		expect(response.status).toBe(401);
		await expect(response.json()).resolves.toEqual({ error: "Não autenticado" });
		expect(mocks.createMarketingGoalLoaders).not.toHaveBeenCalled();
	});

	it("protects the meta-investment action before mutating data", async () => {
		const { UpsertMetaInvestmentAction } = await import(
			"@/actions/meta-investment/upsert"
		);

		await expect(
			UpsertMetaInvestmentAction({
				periodEnd: new Date("2026-08-31T00:00:00.000Z"),
				totalInvestment: 100,
			}),
		).rejects.toMatchObject({
			name: "AuthorizationError",
			status: 401,
			message: "Não autenticado",
		});
		expect(mocks.metaInvestmentUpsert).not.toHaveBeenCalled();
	});

	it("protects the Linx status route before starting coordinated data access", async () => {
		const { GET } = await import("@/app/api/admin/linx/status/route");

		const response = await GET();

		expect(response.status).toBe(401);
		await expect(response.json()).resolves.toEqual({ error: "Não autenticado" });
		expect(mocks.transaction).not.toHaveBeenCalled();
	});
});
