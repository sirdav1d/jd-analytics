import { defineConfig } from "vitest/config";

export default defineConfig({
	oxc: {
		jsx: {
			runtime: "automatic",
		},
	},
	resolve: {
    tsconfigPaths: true,
  },
  test: {
    environment: "node",
    include: ["src/tests/unit/**/*.test.ts"],
    setupFiles: ["src/tests/setup.ts"],
    clearMocks: true,
    restoreMocks: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      reportsDirectory: "coverage",
      include: ["src/lib/**/*.ts", "src/services/**/*.ts"],
      exclude: ["src/tests/**", "**/*.d.ts"],
    },
  },
});
