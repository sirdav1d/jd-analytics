import { afterEach, vi } from "vitest";
import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

if (!process.env.NEXT_PUBLIC_API_URL) {
  throw new Error("Configure NEXT_PUBLIC_API_URL para executar os testes.");
}

vi.mock("server-only", () => ({}));

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
});
