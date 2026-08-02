import { describe, expect, it, vi } from "vitest";
import DashboardLayout from "@/app/dashboard/layout";
import MetaInvestmentsSection from "@/app/dashboard/(admin)/meta-investments/_components/meta-investments-section";

vi.mock("@/lib/auth", () => ({
	authOptions: {},
	requireAdmin: async () => {
		throw new Error("database authorization should not run for page navigation");
	},
}));

vi.mock("@/lib/prisma", () => ({
	prisma: {
		metaInvestment: {
			findMany: async () => [],
		},
	},
}));

vi.mock("next-auth", () => ({
	getServerSession: async () => null,
}));

vi.mock("next/headers", () => ({
	cookies: async () => ({ get: () => undefined }),
}));

vi.mock("next/navigation", () => ({
	redirect: (destination: string): never => {
		throw new Error(`redirected to ${destination}`);
	},
}));

describe("dashboard layouts", () => {
	it("redirects an unauthenticated platform user to the sign-in page", async () => {
		await expect(DashboardLayout({ children: null })).rejects.toThrow(
			"redirected to /sign-in",
		);
	});

	it("renders meta investments without database authorization for page navigation", async () => {
		await expect(MetaInvestmentsSection()).resolves.toMatchObject({
			type: "div",
		});
	});
});
