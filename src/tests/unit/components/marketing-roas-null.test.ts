// @vitest-environment jsdom

import { createElement } from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

afterEach(cleanup);

describe("marketing ROAS without investment", () => {
	it("renders the current ROAS as unavailable when the API returns null", async () => {
		const { default: BigNumberRoas } = await import(
			"@/app/dashboard/(admin)/goals-marketing/_components/big-number-roas"
		);
		const data = {
			ok: true,
			bigNumbers: {
				metaAtual: 3,
				roasAtingido: 2.5,
				roasPrevisto: null,
			},
		};

		render(createElement(BigNumberRoas, { data }));

		expect(screen.getByText("Sem investimento")).toBeTruthy();
	});

	it("renders a historical ROAS as unavailable when the period cost is zero", async () => {
		const { default: HistoryMarketingGoals } = await import(
			"@/app/dashboard/(admin)/goals-marketing/_components/history-marketing-goals"
		);
		const data = {
			ok: true,
			data: [
				{
					goalDateRef: "2026-08-01T00:00:00.000Z",
					faturamento: 100,
					custo: 0,
					roasAtingido: null,
					roas: 3,
				},
			],
		};

		render(createElement(HistoryMarketingGoals, { data }));
		fireEvent.click(
			screen.getByRole("button", { name: /Histórico de metas/i }),
		);

		expect(screen.getByText("Sem investimento")).toBeTruthy();
	});
});
