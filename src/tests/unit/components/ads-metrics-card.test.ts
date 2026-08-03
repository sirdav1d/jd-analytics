// @vitest-environment jsdom

import { createElement, type ComponentType } from "react";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import ListStaticADS from "@/app/dashboard/marketing/_components/list-static-ads";

afterEach(cleanup);

describe("Google Ads metric cards", () => {
	it("renders unavailable changes when both compared periods are zero", () => {
		const withoutActivity = {
			current: 0,
			previous: 0,
			diff: 0,
			percentChange: null,
		};
		const Component = ListStaticADS as unknown as ComponentType<
			Record<string, unknown>
		>;

		render(
			createElement(Component, {
				impressions: withoutActivity,
				clicks: withoutActivity,
				cost_micros: withoutActivity,
				ctr: withoutActivity,
			}),
		);

		expect(screen.getAllByText("N/A")).toHaveLength(5);
	});
});
