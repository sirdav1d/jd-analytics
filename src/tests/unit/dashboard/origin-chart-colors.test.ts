// @vitest-environment jsdom

import { render, waitFor } from "@testing-library/react";
import { createElement, Suspense, type ComponentType } from "react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { RevenueByOrigin } from "@/app/dashboard/comercial/_components/revenue-by-origin";
import { SalesCountByOrigin } from "@/app/dashboard/comercial/_components/sales-count-by-origin";
import { AvgTicketByOrigin } from "@/app/dashboard/comercial/_components/avg-ticket-by-origin";

const resolvedData = vi.hoisted(() => ({
  ok: true,
  data: {
    revenueByOrigin: [
      { origin: "Balcão", revenue: 170, fill: "var(--color-Balcão)" },
    ],
    salesCountByOrigin: [
      { origin: "Balcão", sales_count: 2, fill: "var(--color-Balcão)" },
    ],
    avgTicketByOrigin: [
      { origin: "Balcão", avg_ticket: 85, fill: "var(--color-Balcão)" },
    ],
  },
}));

vi.mock("react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react")>();
  return { ...actual, use: () => resolvedData };
});

beforeEach(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation(() => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  });
  class ResizeObserverStub {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  vi.stubGlobal("ResizeObserver", ResizeObserverStub);
});

const payload = Promise.resolve(resolvedData);

describe.each([
  ["revenue", RevenueByOrigin],
  ["sales count", SalesCountByOrigin],
  ["average ticket", AvgTicketByOrigin],
] as Array<[string, ComponentType<{ data: Promise<unknown> }>]>)(
  "%s origin chart",
  (_name, Chart) => {
    test("defines the color used by Balcão data returned by the API", async () => {
      const { container } = render(
        createElement(
          Suspense,
          { fallback: null },
          createElement(Chart, { data: payload }),
        ),
      );

		await waitFor(() => {
			expect(container.querySelector("style")?.textContent).toContain(
				"--color-Balcão: #242424;",
			);
		});
    });
  },
);
