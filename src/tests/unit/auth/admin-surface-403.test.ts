import { describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { AuthorizationError } from "@/lib/authorization";

const mocks = vi.hoisted(() => ({
	findMany: vi.fn(),
	findFirst: vi.fn(),
	findUnique: vi.fn(),
	create: vi.fn(),
	update: vi.fn(),
	upsert: vi.fn(),
	aggregate: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({
	requireAdmin: vi.fn(async () => {
		throw new AuthorizationError(403, "Acesso restrito a administradores");
	}),
}));
vi.mock("@/lib/prisma", () => ({
	prisma: new Proxy(
		{},
		{
			get: () => ({
				findMany: mocks.findMany,
				findFirst: mocks.findFirst,
				findUnique: mocks.findUnique,
				create: mocks.create,
				update: mocks.update,
				upsert: mocks.upsert,
				aggregate: mocks.aggregate,
			}),
		},
	),
}));

const assertNoEffect = () => {
	for (const mock of [
		mocks.findMany,
		mocks.findFirst,
		mocks.findUnique,
		mocks.create,
		mocks.update,
		mocks.upsert,
		mocks.aggregate,
	]) {
		expect(mock).not.toHaveBeenCalled();
	}
};

describe("administrative surfaces for active non-admins", () => {
	it.each([
		["CSV uploads", () => import("@/app/api/upload/route").then(({ POST }) => POST(new NextRequest("http://localhost/api/upload", { method: "POST" })) )],
		["origin CSV uploads", () => import("@/app/api/upload-origin/route").then(({ POST }) => POST(new NextRequest("http://localhost/api/upload-origin", { method: "POST" })) )],
		["user listing", () => import("@/app/api/services/user-get-all/route").then(({ GET }) => GET())],
		["Meta investment listing", () => import("@/app/api/services/meta-investments/route").then(({ GET }) => GET(new NextRequest("http://localhost/api/services/meta-investments")))],
		["sales goal reporting", () => import("@/app/api/services/data-services/goal-target/route").then(({ GET }) => GET())],
		["marketing goal reporting", () => import("@/app/api/services/data-services/marketing-goal/route").then(({ GET }) => GET(new NextRequest("http://localhost/api/services/data-services/marketing-goal")))],
		["Google OAuth initiation", () => import("@/app/api/auth/login-google/route").then(({ GET }) => GET())],
		["Google OAuth callback", () => import("@/app/api/auth/callback/route").then(({ GET }) => GET(new NextRequest("http://localhost/api/auth/callback?code=secret")))],
	])("returns 403 before running %s", async (_surface, invoke) => {
		const response = await invoke();

		expect(response.status).toBe(403);
		await expect(response.json()).resolves.toEqual({
			error: "Acesso restrito a administradores",
		});
		assertNoEffect();
	});

	it.each([
		["user creation", () => import("@/actions/user/create").then(({ createUserAction }) => createUserAction("Ada", "ada@example.com", "MANAGER", "password123", "external-id"))],
		["user updates", () => import("@/actions/user/update").then(({ updateUserAction }) => updateUserAction({ userUp: { email: "ada@example.com" } }))],
		["user deactivation", () => import("@/actions/user/delete").then(({ deleteUserAction }) => deleteUserAction("user-id"))],
		["seller listing", () => import("@/actions/user/get-all").then(({ default: getAllSellers }) => getAllSellers())],
		["sales goal creation", () => import("@/actions/goals/create").then(({ CreateSalesGoalAction }) => CreateSalesGoalAction({ userId: "user-id", goalDateRef: new Date(), revenue: 100 }))],
		["sales goal updates", () => import("@/actions/goals/update").then(({ UpdateSalesGoalAction }) => UpdateSalesGoalAction({ goalId: "goal-id", revenue: 100 }))],
		["ROAS goal creation", () => import("@/actions/roasGoal/create").then(({ CreateRoasGoalAction }) => CreateRoasGoalAction({ goalDateRef: new Date(), roas: 2 }))],
		["ROAS goal updates", () => import("@/actions/roasGoal/update").then(({ UpdateRoasGoalAction }) => UpdateRoasGoalAction({ goalId: "goal-id", roas: 2 }))],
		["Meta investment writes", () => import("@/actions/meta-investment/upsert").then(({ UpsertMetaInvestmentAction }) => UpsertMetaInvestmentAction({ periodEnd: new Date(), totalInvestment: 100 }))],
		["organization creation", () => import("@/actions/org/create").then(({ CreateOrgAction }) => CreateOrgAction("JD"))],
		["organization token updates", () => import("@/actions/org/update-tokens").then(({ updateOrganizationTokens }) => updateOrganizationTokens("org-id", "access", "refresh", 1))],
	])("rejects %s with 403 before causing effects", async (_surface, invoke) => {
		await expect(invoke()).rejects.toMatchObject({
			name: "AuthorizationError",
			status: 403,
			message: "Acesso restrito a administradores",
		});
		assertNoEffect();
	});
});
