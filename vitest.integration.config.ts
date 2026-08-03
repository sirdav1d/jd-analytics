import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    environment: "node",
    include: ["src/tests/integration/**/*.test.ts"],
    setupFiles: ["src/tests/setup.ts"],
    clearMocks: true,
    restoreMocks: true,
    fileParallelism: false,
  },
});
