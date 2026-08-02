import { describe, expect, it } from "vitest";

describe("integration test harness", () => {
  it("runs tests selected by the integration configuration", () => {
    expect({ integration: true }).toEqual({ integration: true });
  });
});
