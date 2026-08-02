import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const files = [
  "src/services/data-services/get-users-all.ts",
  "src/services/data-services/get-goal-target.ts",
  "src/services/data-services/get-marketing-goals.ts",
  "src/app/dashboard/(admin)/meta-investments/_components/meta-investments-section.tsx",
];

describe("server-side admin data access", () => {
  it.each(files)(
    "%s never forwards session cookies to a configurable HTTP origin",
    (file) => {
      const source = readFileSync(resolve(process.cwd(), file), "utf8");
      expect(source).not.toMatch(/NEXT_PUBLIC_API_URL/);
      expect(source).not.toMatch(/get\(\s*['"]cookie['"]\s*\)/);
      expect(source).not.toMatch(/headers\s*\(/);
      expect(source).not.toMatch(/\bfetch\s*\(/);
    },
  );
});
