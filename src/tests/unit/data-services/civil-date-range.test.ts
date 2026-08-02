import { describe, expect, test } from "vitest";
import {
  formatBusinessCivilDate,
  resolveBusinessMonthToDate,
  resolveCivilDateRange,
} from "@/services/data-services/civil-date-range";

describe("civil date ranges used by dashboard queries", () => {
  test("keeps the Brazilian business day after UTC has crossed midnight", () => {
    expect(
      formatBusinessCivilDate(new Date("2026-08-02T01:30:00.000Z")),
    ).toBe("2026-08-01");
  });

  test("derives the Brazilian month start without using the runtime timezone", () => {
    expect(
      resolveBusinessMonthToDate(new Date("2026-08-02T01:30:00.000Z")),
    ).toEqual({ startDate: "2026-08-01", endDate: "2026-08-01" });
  });

  test("creates UTC DATE boundaries and a previous period with the same number of days", () => {
    const range = resolveCivilDateRange("2026-08-01", "2026-08-03");

    expect(range).toEqual({
      startDate: "2026-08-01",
      endDate: "2026-08-03",
      start: new Date("2026-08-01T00:00:00.000Z"),
      end: new Date("2026-08-03T00:00:00.000Z"),
      inclusiveDays: 3,
      previousStartDate: "2026-07-29",
      previousEndDate: "2026-07-31",
      previousStart: new Date("2026-07-29T00:00:00.000Z"),
      previousEnd: new Date("2026-07-31T00:00:00.000Z"),
    });
  });

  test.each([
    ["2026-02-30", "2026-03-01"],
    ["01/08/2026", "2026-08-01"],
    ["2026-08-02", "2026-08-01"],
  ])("rejects an invalid civil range from %s to %s", (startDate, endDate) => {
    expect(() => resolveCivilDateRange(startDate, endDate)).toThrow(
      "Intervalo de datas inválido",
    );
  });
});
