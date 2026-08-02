import { createElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import AppSidebar from "@/components/app-sidebar";

vi.mock("@/components/ui/sidebar", async () => {
	const { createElement } = await import("react");
	const wrapper = (tag: string) => ({ children }: { children: ReactNode }) =>
		createElement(tag, null, children);
	return {
		Sidebar: wrapper("aside"),
		SidebarContent: wrapper("div"),
		SidebarFooter: wrapper("footer"),
		SidebarGroup: wrapper("section"),
		SidebarGroupContent: wrapper("div"),
		SidebarGroupLabel: wrapper("h2"),
		SidebarMenu: wrapper("ul"),
		SidebarMenuButton: wrapper("div"),
		SidebarMenuItem: wrapper("li"),
		useSidebar: () => ({ open: true }),
	};
});
vi.mock("@/components/ui/collapsible", async () => {
	const { createElement } = await import("react");
	const wrapper = (tag: string) => ({ children }: { children: ReactNode }) =>
		createElement(tag, null, children);
	return {
		Collapsible: wrapper("div"),
		CollapsibleContent: wrapper("div"),
		CollapsibleTrigger: wrapper("button"),
	};
});
vi.mock("@/components/ui/separator", () => ({
	Separator: () => createElement("hr"),
}));
vi.mock("@/components/logo", () => ({
	default: () => createElement("span", null, "JD"),
}));
vi.mock("@/hooks/use-mobile", () => ({ useIsMobile: () => false }));
vi.mock("next-auth/react", () => ({
	useSession: () => ({
		data: { user: { name: "Manager", role: "MANAGER", isActive: true } },
	}),
}));
vi.mock("next/navigation", () => ({ usePathname: () => "/dashboard" }));
vi.mock("next/link", async () => {
	const { createElement } = await import("react");
	return {
		default: ({ children }: { children: ReactNode }) =>
			createElement("a", null, children),
	};
});

describe("AppSidebar", () => {
	it("does not render administrative navigation for an active non-admin", () => {
		const markup = renderToStaticMarkup(createElement(AppSidebar));

		expect(markup).not.toContain("Administrativo");
		expect(markup).not.toContain("Definição de Metas");
		expect(markup).not.toContain("Upload CSV");
	});
});
