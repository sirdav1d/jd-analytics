import { isValidElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
	requireAdmin: vi.fn(),
	userFindMany: vi.fn(),
	salesGoalFindMany: vi.fn(),
	roasGoalFindMany: vi.fn(),
	metaInvestmentFindMany: vi.fn(),
	queryRaw: vi.fn(),
	currentGoogleAdsCosts: vi.fn(),
	closedGoogleAdsCosts: vi.fn(),
	forbiddenFetch: vi.fn(),
	forbiddenCookies: vi.fn(),
	forbiddenHeaders: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({ requireAdmin: mocks.requireAdmin }));

vi.mock("@/lib/prisma", () => ({
	prisma: {
		user: { findMany: mocks.userFindMany },
		salesGoal: { findMany: mocks.salesGoalFindMany },
		roasGoal: { findMany: mocks.roasGoalFindMany },
		metaInvestment: { findMany: mocks.metaInvestmentFindMany },
		$queryRaw: mocks.queryRaw,
	},
}));

vi.mock("@/services/google-services/get-monthly-ads-costs", () => ({
	getCurrentMonthlyGoogleAdsCosts: mocks.currentGoogleAdsCosts,
	getClosedMonthlyGoogleAdsCosts: mocks.closedGoogleAdsCosts,
}));

vi.mock("next/headers", () => ({
	cookies: mocks.forbiddenCookies,
	headers: mocks.forbiddenHeaders,
}));

const activeAdmin = {
	id: "admin-id",
	name: "Admin",
	email: "admin@example.test",
	role: "ADMIN",
	isActive: true,
};

const user = {
	id: "seller-id",
	name: "Ada",
	email: "ada@example.test",
	externalId: "external-id",
	role: "SELLER",
	isActive: true,
	createdAt: new Date("2026-08-01T12:00:00.000Z"),
};

function expectNoRequestContextOrHttpAccess() {
	expect(mocks.forbiddenFetch).not.toHaveBeenCalled();
	expect(mocks.forbiddenCookies).not.toHaveBeenCalled();
	expect(mocks.forbiddenHeaders).not.toHaveBeenCalled();
}

beforeEach(() => {
	vi.stubEnv("NEXT_PUBLIC_API_URL", "https://forbidden-origin.example.test");
	vi.stubGlobal("fetch", mocks.forbiddenFetch);
	mocks.forbiddenFetch.mockRejectedValue(
		new Error("internal admin data must not use HTTP"),
	);
	mocks.forbiddenCookies.mockImplementation(() => {
		throw new Error("internal admin data must not read cookies");
	});
	mocks.forbiddenHeaders.mockImplementation(() => {
		throw new Error("internal admin data must not read headers");
	});
	mocks.requireAdmin.mockResolvedValue(activeAdmin);
	mocks.userFindMany.mockResolvedValue([user]);
	mocks.salesGoalFindMany.mockResolvedValue([]);
	mocks.roasGoalFindMany.mockResolvedValue([]);
	mocks.metaInvestmentFindMany.mockResolvedValue([]);
	mocks.queryRaw.mockResolvedValue([]);
	mocks.currentGoogleAdsCosts.mockResolvedValue({});
	mocks.closedGoogleAdsCosts.mockResolvedValue({});
});

describe("internal administrative data boundaries", () => {
	it("loads users through the real internal service without HTTP or request context", async () => {
		const { FetchAllUsers } = await import(
			"@/services/data-services/get-users-all"
		);

		await expect(FetchAllUsers()).resolves.toEqual({
			error: null,
			ok: true,
			data: [{ ...user, createdAt: "2026-08-01T12:00:00.000Z" }],
		});
		expectNoRequestContextOrHttpAccess();
	});

	it("loads commercial goals through the real service without HTTP or request context", async () => {
		const { FetchGoalTargetData } = await import(
			"@/services/data-services/get-goal-target"
		);

		await expect(
			FetchGoalTargetData(new Date("2026-08-15T12:00:00.000Z")),
		).resolves.toEqual({
			ok: true,
			error: null,
			companyGoal: { meta: 0, realized: 0, remaining: 0, predicted: 0 },
			currentGoals: [],
			history: [],
		});
		expectNoRequestContextOrHttpAccess();
	});

	it("loads marketing goals through the real service without HTTP or request context", async () => {
		const { createMarketingGoalLoaders } = await import(
			"@/services/data-services/get-marketing-goals"
		);

		const loaders = createMarketingGoalLoaders(
			"products",
			new Date("2026-08-15T12:00:00.000Z"),
		);

		await expect(loaders.response).resolves.toEqual({
			ok: false,
			data: null,
			bigNumbers: null,
			error: "Nenhuma meta encontrada",
			status: 404,
		});
		await expect(loaders.bigNumbers).resolves.toEqual({
			ok: false,
			bigNumbers: null,
			error: "Nenhuma meta encontrada",
		});
		await expect(loaders.history).resolves.toEqual({
			ok: false,
			data: null,
			error: "Nenhuma meta encontrada",
		});
		expectNoRequestContextOrHttpAccess();
	});

	it("loads meta investments through the real section without HTTP or request context", async () => {
		const { default: MetaInvestmentsSection } = await import(
			"@/app/dashboard/(admin)/meta-investments/_components/meta-investments-section"
		);

		const tree = await MetaInvestmentsSection();

		expect(isValidElement(tree)).toBe(true);
		expect(tree.type).toBe("div");
		expectNoRequestContextOrHttpAccess();
	});
});
