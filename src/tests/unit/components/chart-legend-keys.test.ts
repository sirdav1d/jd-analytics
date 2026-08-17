// @vitest-environment jsdom

import { createElement, type ComponentType } from "react";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
	ChartContainer,
	ChartLegendContent,
} from "@/components/ui/chart";

afterEach(cleanup);

beforeEach(() => {
	vi.stubGlobal(
		"ResizeObserver",
		class ResizeObserver {
			observe() {}
			unobserve() {}
			disconnect() {}
		},
	);
});

describe("ChartLegendContent", () => {
	it("keeps long legend labels intact while making the chart and items shrinkable", () => {
		const Container = ChartContainer as unknown as ComponentType<
			Record<string, unknown>
		>;
		const LegendContent = ChartLegendContent as unknown as ComponentType<
			Record<string, unknown>
		>;
		const labelText = "Relacionamento comercial muito extenso";

		render(
			createElement(
				Container,
				{
					config: { value: { label: labelText } },
					style: { width: 320, height: 320 },
				},
				createElement(LegendContent, {
					payload: [{ value: "value", dataKey: "value", color: "red" }],
				}),
			),
		);

		const chart = document.querySelector("[data-chart]");
		expect(chart?.className).toContain("min-w-0");
		expect(chart?.className).toContain("overflow-hidden");

		const label = screen.getByTitle(labelText);
		expect(label.className).toContain("text-ellipsis");
		expect(label.className).toContain("whitespace-nowrap");
		expect(label.textContent).toBe(labelText);
	});

	it("does not emit duplicate-key warnings when legend labels are empty", () => {
		const Container = ChartContainer as unknown as ComponentType<
			Record<string, unknown>
		>;
		const LegendContent = ChartLegendContent as unknown as ComponentType<
			Record<string, unknown>
		>;
		const consoleError = vi
			.spyOn(console, "error")
			.mockImplementation(() => undefined);

		render(
			createElement(
				Container,
				{
					config: { value: { label: "Faturamento" } },
					style: { width: 320, height: 320 },
				},
				createElement(LegendContent, {
					payload: [
						{
							value: "",
							color: "red",
							payload: { id: "service", name: "" },
						},
						{
							value: "",
							color: "blue",
							payload: { id: "product", name: "" },
						},
					],
				}),
			),
		);

		const duplicateKeyWarnings = consoleError.mock.calls.filter(([message]) =>
			String(message).includes("same key"),
		);

		expect(duplicateKeyWarnings).toHaveLength(0);
	});
});
