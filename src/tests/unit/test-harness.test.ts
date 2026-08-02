import { describe, expect, it } from "vitest";
import { cn } from "@/lib/utils";

describe("test harness", () => {
  it("runs TypeScript tests from src/tests", () => {
    expect({ ready: true }).toEqual({ ready: true });
  });

  it("resolves the TypeScript @ alias when importing application code", () => {
    expect(cn("rounded", "rounded-md")).toBe("rounded-md");
  });
});
