import { createElement } from "react";
import { describe, expect, it, vi } from "vitest";
import DashboardLayout from "@/app/dashboard/layout";
import AuthenticationLayout from "@/app/(public)/(auth)/layout";
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
	getServerSession: async () => {
		throw new Error("server session access is navigation middleware's responsibility");
	},
}));

vi.mock("next/headers", () => ({
	cookies: async () => ({ get: () => undefined }),
}));

vi.mock("next/server", () => ({ connection: vi.fn() }));

vi.mock("next/navigation", () => ({
	redirect: (destination: string): never => {
		throw new Error(`redirected to ${destination}`);
	},
}));

describe("dashboard layouts", () => {
	it("returns the dashboard shell without reading the server session", async () => {
		await expect(
			DashboardLayout({ children: createElement("p", null, "Dashboard content") }),
		).resolves.toMatchObject({
			props: { defaultOpen: true },
		});
	});

	it("returns the authentication main structure without session redirects", () => {
		expect(
			AuthenticationLayout({ children: createElement("p", null, "Sign in") }),
		).toMatchObject({
			type: "main",
			props: { children: expect.anything() },
		});
	});

	it("renders meta investments without database authorization for page navigation", async () => {
		await expect(MetaInvestmentsSection()).resolves.toMatchObject({
			type: "div",
		});
	});
});
