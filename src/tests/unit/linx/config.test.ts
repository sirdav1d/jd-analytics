import { afterEach, describe, expect, it, vi } from "vitest";
import {
  getPublicLinxConfig,
  readLinxConfig,
} from "@/services/linx/config";

describe("Linx server config", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("fails closed when the API key is missing", () => {
    vi.stubEnv("LINX_API_KEY", "");

    expect(() => readLinxConfig()).toThrow("LINX_API_KEY");
  });

  it("does not expose credentials in the public view", () => {
    vi.stubEnv("LINX_API_KEY", "00000000-0000-4000-8000-000000000000");
    vi.stubEnv("LINX_API_USER", "user");
    vi.stubEnv("LINX_API_PASSWORD", "password");

    const publicConfig = getPublicLinxConfig();

    expect(publicConfig).toEqual({
      endpoint: "https://webapi.microvix.com.br/1.0/api/integracao",
    });
    expect(publicConfig).not.toHaveProperty("key");
    expect(publicConfig).not.toHaveProperty("user");
    expect(publicConfig).not.toHaveProperty("password");
  });
});
