// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
	getMobileCategoricalChartHeight,
	ResponsiveChartTick,
} from "@/components/ui/responsive-chart";

describe("responsive chart primitives", () => {
	it("allocates at least 320 px and 44 px per category", () => {
		expect(getMobileCategoricalChartHeight(2)).toBe(320);
		expect(getMobileCategoricalChartHeight(8)).toBe(408);
	});

	it("keeps the complete tick value and delegates overflow to CSS", () => {
		render(
			<svg>
				<ResponsiveChartTick
					axis="y"
					x={100}
					y={20}
					width={96}
					payload={{ value: "Relacionamento comercial muito extenso" }}
				/>
			</svg>,
		);

		const label = screen.getByTitle("Relacionamento comercial muito extenso");
		expect(label.textContent).toBe("Relacionamento comercial muito extenso");
		expect(label.className).toContain("text-ellipsis");
		expect(label.className).toContain("whitespace-nowrap");
		expect(label.textContent).not.toContain("...");
	});
});
