// @vitest-environment jsdom

import { createElement, type ComponentType } from "react";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ServicesVsSales } from "@/app/dashboard/comercial/_components/services-vs-sales";

vi.mock("react", async (importOriginal) => {
	const actual = await importOriginal<typeof import("react")>();

	return {
		...actual,
		use: <T,>(value: T) => value,
	};
});

afterEach(cleanup);

beforeEach(() => {
	vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({
		width: 320,
		height: 320,
		top: 0,
		right: 320,
		bottom: 320,
		left: 0,
		x: 0,
		y: 0,
		toJSON: () => ({}),
	});

	vi.stubGlobal(
		"ResizeObserver",
		class ResizeObserver {
			constructor(
				private readonly callback: ResizeObserverCallback,
			) {}
			observe(target: Element) {
				this.callback(
					[
						{
							target,
							contentRect: {
								width: 320,
								height: 320,
								top: 0,
								right: 320,
								bottom: 320,
								left: 0,
								x: 0,
								y: 0,
								toJSON: () => ({}),
							},
						} as ResizeObserverEntry,
					],
					this as unknown as globalThis.ResizeObserver,
				);
			}
			unobserve() {}
			disconnect() {}
		},
	);

	Object.defineProperty(window, "matchMedia", {
		configurable: true,
		value: () => ({
			matches: false,
			addEventListener: () => undefined,
			removeEventListener: () => undefined,
		}),
	});
});

describe("ServicesVsSales", () => {
	it("keeps the service and product categories when the period has no sales", async () => {
		const Component = ServicesVsSales as unknown as ComponentType<
			Record<string, unknown>
		>;

		render(
			createElement(Component, {
				data: {
					ok: true,
					data: { salesByItemType: [] },
				},
			}),
		);

		expect(await screen.findByText("Serviços")).toBeTruthy();
		expect(await screen.findByText("Produtos")).toBeTruthy();
	});
});
