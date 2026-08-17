/** @vitest-environment jsdom */

import { render, screen } from "@testing-library/react";
import { createElement } from "react";
import { describe, expect, it, vi } from "vitest";
import HeaderDashboard from "@/components/header-dashboard";
import { DashboardOverviewProvider } from "@/providers/dashboard-overview-provider";

const useSession = vi.hoisted(() => vi.fn());

vi.mock("next-auth/react", () => ({
	useSession,
	signOut: vi.fn(),
}));

vi.mock("next/navigation", () => ({
	usePathname: () => "/dashboard",
	redirect: () => {
		throw new Error("the dashboard header must not redirect");
	},
}));

vi.mock("next-themes", () => ({
	useTheme: () => ({ theme: "light", systemTheme: "light", setTheme: vi.fn() }),
}));

vi.mock("@/components/data-sync-control", () => ({
	DataSyncControl: ({ variant }: { variant: string }) =>
		createElement("span", { "data-testid": `data-${variant}` }, variant),
}));

describe("HeaderDashboard session display", () => {
	it("displays the authenticated name from the root session provider", () => {
		useSession.mockReturnValue({
			data: { user: { name: "Ana Admin", role: "ADMIN", isActive: true } },
		});

		render(
			createElement(
				DashboardOverviewProvider,
				null,
				createElement(HeaderDashboard),
			),
		);

		expect(screen.getByText("Ana Admin")).toBeTruthy();
		expect(screen.getByTestId("data-desktop")).toBeTruthy();
		expect(screen.queryByTestId("data-mobile")).toBeNull();
	});

	it("displays the user fallback without redirecting when no session is available", () => {
		useSession.mockReturnValue({ data: null });

		render(
			createElement(
				DashboardOverviewProvider,
				null,
				createElement(HeaderDashboard),
			),
		);

		expect(screen.getByText("usuário")).toBeTruthy();
	});
});
